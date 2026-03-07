import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../lib/errors.js';
import {
  issueAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  type NewTokenPair,
  type RefreshTokenBundle,
} from './jwt.service.js';

const PASSWORD_BCRYPT_ROUNDS = 12;

// ─── Types ────────────────────────────────────────────────────────────────

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  locale?: string | undefined;
  marketingConsent?: boolean | undefined;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export async function signupUser(input: SignupInput): Promise<AuthTokens> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('Un compte existe déjà avec cet email');
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_BCRYPT_ROUNDS);

  const newUser = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      locale: input.locale ?? 'fr',
      marketingConsent: input.marketingConsent ?? false,
    },
  });

  return buildAuthTokens(newUser.id);
}

export async function loginUser(input: LoginInput): Promise<AuthTokens> {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  // Message générique volontaire — ne pas révéler si l'email existe
  const invalidCredentialsError = new UnauthorizedError(
    'Email ou mot de passe incorrect',
  );

  if (!user || !user.passwordHash) {
    throw invalidCredentialsError;
  }

  if (user.status !== 'active') {
    throw new UnauthorizedError('Ce compte est suspendu ou supprimé');
  }

  const passwordIsValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordIsValid) {
    throw invalidCredentialsError;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return buildAuthTokens(user.id);
}

export async function refreshUserTokens(plainRefreshToken: string, userId: string): Promise<AuthTokens> {
  const newTokenPair = await rotateRefreshToken(plainRefreshToken, userId);

  return {
    accessToken: newTokenPair.accessToken,
    refreshToken: newTokenPair.refreshTokenBundle.plainToken,
    refreshTokenExpiresAt: newTokenPair.refreshTokenBundle.expiresAt,
  };
}

export async function logoutUser(plainRefreshToken: string, userId: string): Promise<void> {
  await revokeRefreshToken(plainRefreshToken, userId);
}

/**
 * Upsert un utilisateur via OAuth (Google ou Apple).
 * Crée le compte si inexistant, connecte si existant.
 */
export async function upsertOauthUser(input: {
  provider: 'google' | 'apple';
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
}): Promise<AuthTokens> {
  // Chercher d'abord par compte OAuth existant
  const existingOauthAccount = await prisma.userOauthAccount.findUnique({
    where: {
      provider_providerId: {
        provider: input.provider,
        providerId: input.providerId,
      },
    },
    include: { user: true },
  });

  if (existingOauthAccount) {
    if (existingOauthAccount.user.status !== 'active') {
      throw new UnauthorizedError('Ce compte est suspendu');
    }
    return buildAuthTokens(existingOauthAccount.userId);
  }

  // Chercher si un compte email existe déjà — on les lie
  const existingUserByEmail = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUserByEmail) {
    await prisma.userOauthAccount.create({
      data: {
        userId: existingUserByEmail.id,
        provider: input.provider,
        providerId: input.providerId,
      },
    });
    return buildAuthTokens(existingUserByEmail.id);
  }

  // Nouveau compte complet
  const newUser = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      firstName: input.firstName,
      lastName: input.lastName,
      locale: 'fr',
      oauthAccounts: {
        create: {
          provider: input.provider,
          providerId: input.providerId,
        },
      },
    },
  });

  return buildAuthTokens(newUser.id);
}

// ─── Helper privé ─────────────────────────────────────────────────────────

/**
 * Construit une paire de tokens en incluant le sellerId si l'utilisateur est vendeur.
 * Appelé à chaque login, signup, et rotation de refresh token.
 */
async function buildAuthTokens(userId: string): Promise<AuthTokens> {
  const sellerMembership = await prisma.sellerUser.findFirst({
    where: { userId },
    select: { sellerId: true },
  });

  const role = sellerMembership ? 'seller' : 'user';
  const sellerId = sellerMembership?.sellerId;

  const [accessToken, refreshTokenBundle] = await Promise.all([
    Promise.resolve(issueAccessToken(userId, role, sellerId)),
    issueRefreshToken(userId),
  ]);

  return {
    accessToken,
    refreshToken: refreshTokenBundle.plainToken,
    refreshTokenExpiresAt: refreshTokenBundle.expiresAt,
  };
}
