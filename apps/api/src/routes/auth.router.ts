import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { redis } from '../lib/redis.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  signupUser,
  loginUser,
  refreshUserTokens,
  logoutUser,
} from '../services/auth/auth.service.js';
import { UnauthorizedError } from '../lib/errors.js';

const authRouter = new Hono();

// ─── Schémas de validation ────────────────────────────────────────────────

const signupSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  locale: z.enum(['fr', 'nl', 'en']).optional(),
  marketingConsent: z.boolean().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

// ─── Rate limiting ────────────────────────────────────────────────────────

const MAX_LOGIN_ATTEMPTS_PER_MINUTE = 5;

async function checkLoginRateLimit(clientIp: string): Promise<void> {
  const rateLimitKey = `rate_limit:login:${clientIp}`;
  const currentAttempts = await redis.incr(rateLimitKey);

  // Expiration d'une minute sur la première tentative
  if (currentAttempts === 1) {
    await redis.expire(rateLimitKey, 60);
  }

  if (currentAttempts > MAX_LOGIN_ATTEMPTS_PER_MINUTE) {
    throw new UnauthorizedError(
      'Trop de tentatives. Réessayez dans une minute.',
    );
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────

authRouter.post('/signup', zValidator('json', signupSchema), async (context) => {
  const signupData = context.req.valid('json');
  const tokens = await signupUser(signupData);

  return context.json(tokens, 201);
});

authRouter.post('/login', zValidator('json', loginSchema), async (context) => {
  const clientIp = context.req.header('x-forwarded-for') ?? 'unknown';
  await checkLoginRateLimit(clientIp);

  const { email, password } = context.req.valid('json');
  const tokens = await loginUser({ email, password });

  return context.json(tokens, 200);
});

authRouter.post('/refresh', zValidator('json', refreshSchema), async (context) => {
  const { refreshToken } = context.req.valid('json');

  // On doit décoder le userId sans vérification complète du access token
  // car il est peut-être expiré — c'est justement le but du refresh
  const authorizationHeader = context.req.header('Authorization');
  const expiredAccessToken = authorizationHeader?.slice(7) ?? '';

  // Extraire le userId depuis le token (sans vérifier l'expiration)
  let userId: string;
  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.decode(expiredAccessToken) as { sub?: string } | null;
    if (!decoded?.sub) throw new Error();
    userId = decoded.sub;
  } catch {
    throw new UnauthorizedError('Token invalide');
  }

  const newTokens = await refreshUserTokens(refreshToken, userId);
  return context.json(newTokens, 200);
});

authRouter.post('/logout', requireAuth, zValidator('json', logoutSchema), async (context) => {
  const { refreshToken } = context.req.valid('json');
  const userId = context.get('authenticatedUserId');

  await logoutUser(refreshToken, userId);
  return context.json({ success: true }, 200);
});

export { authRouter };
