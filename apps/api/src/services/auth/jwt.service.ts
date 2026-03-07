import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';
import { UnauthorizedError } from '../../lib/errors.js';

// ─── Constantes ───────────────────────────────────────────────────────────

const ACCESS_TOKEN_SECRET = process.env['JWT_ACCESS_SECRET'];
const REFRESH_TOKEN_SECRET = process.env['JWT_REFRESH_SECRET'];
// Durée du token d'accès en secondes (défaut : 15 minutes)
const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 30;
const BCRYPT_ROUNDS = 10;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_ACCESS_SECRET et JWT_REFRESH_SECRET sont requis');
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface AccessTokenPayload {
  sub: string;
  role: string;
  sellerId?: string | undefined; // présent uniquement pour les tokens vendeur
}

export interface RefreshTokenBundle {
  plainToken: string;   // envoyé au client (cookie httpOnly)
  tokenHash: string;    // stocké en DB (bcrypt)
  familyId: string;     // regroupe toute une chaîne de rotation
  expiresAt: Date;
}

export interface NewTokenPair {
  accessToken: string;
  refreshTokenBundle: RefreshTokenBundle;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export function issueAccessToken(
  userId: string,
  role: string,
  sellerId?: string | undefined,
): string {
  const payload: AccessTokenPayload = {
    sub: userId,
    role,
    ...(sellerId !== undefined && { sellerId }),
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export async function issueRefreshToken(
  userId: string,
  familyId?: string,
): Promise<RefreshTokenBundle> {
  const plainToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = await bcrypt.hash(plainToken, BCRYPT_ROUNDS);
  const resolvedFamilyId = familyId ?? crypto.randomUUID();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      familyId: resolvedFamilyId,
      expiresAt,
    },
  });

  return { plainToken, tokenHash, familyId: resolvedFamilyId, expiresAt };
}

/**
 * Rotation sécurisée du refresh token avec détection de réutilisation.
 *
 * Si un token déjà consommé est présenté → attaque détectée → toute
 * la famille est révoquée immédiatement (tous les appareils déconnectés).
 */
export async function rotateRefreshToken(
  plainToken: string,
  userId: string,
): Promise<NewTokenPair> {
  const allUserTokens = await prisma.refreshToken.findMany({
    where: { userId },
  });

  // Trouver le token correspondant par comparaison bcrypt
  const matchingToken = await findTokenByPlainValue(plainToken, allUserTokens);

  if (!matchingToken) {
    throw new UnauthorizedError('Refresh token invalide');
  }

  // Token déjà utilisé → compromission détectée → invalider toute la famille
  if (matchingToken.usedAt !== null) {
    await prisma.refreshToken.deleteMany({
      where: { familyId: matchingToken.familyId },
    });
    throw new UnauthorizedError(
      'Token réutilisé détecté — toutes les sessions ont été révoquées',
    );
  }

  if (matchingToken.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token expiré');
  }

  // Marquer le token actuel comme consommé
  await prisma.refreshToken.update({
    where: { id: matchingToken.id },
    data: { usedAt: new Date() },
  });

  // Émettre une nouvelle paire avec le même familyId
  const newRefreshTokenBundle = await issueRefreshToken(
    userId,
    matchingToken.familyId,
  );

  // Inclure le sellerId si l'utilisateur est vendeur
  const sellerMembership = await prisma.sellerUser.findFirst({
    where: { userId },
    select: { sellerId: true },
  });
  const role = sellerMembership ? 'seller' : 'user';
  const newAccessToken = issueAccessToken(userId, role, sellerMembership?.sellerId);

  return {
    accessToken: newAccessToken,
    refreshTokenBundle: newRefreshTokenBundle,
  };
}

export async function revokeRefreshToken(plainToken: string, userId: string): Promise<void> {
  const allUserTokens = await prisma.refreshToken.findMany({
    where: { userId, usedAt: null },
  });

  const matchingToken = await findTokenByPlainValue(plainToken, allUserTokens);

  if (matchingToken) {
    await prisma.refreshToken.delete({ where: { id: matchingToken.id } });
  }
}

// ─── Helpers privés ───────────────────────────────────────────────────────

async function findTokenByPlainValue(
  plainToken: string,
  candidates: Array<{ id: string; tokenHash: string; usedAt: Date | null; expiresAt: Date; familyId: string }>,
) {
  for (const candidate of candidates) {
    const isMatch = await bcrypt.compare(plainToken, candidate.tokenHash);
    if (isMatch) return candidate;
  }
  return null;
}
