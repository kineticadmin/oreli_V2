import { createMiddleware } from 'hono/factory';
import { UnauthorizedError } from '../lib/errors.js';

const ADMIN_API_KEY = process.env['ADMIN_API_KEY'];

/**
 * Vérifie la clé API admin dans le header X-Admin-Key.
 * Approche V1 : clé statique suffisante pour un backoffice interne.
 */
export const requireAdmin = createMiddleware(async (context, next) => {
  if (!ADMIN_API_KEY) {
    throw new Error('Variable ADMIN_API_KEY manquante');
  }

  const providedKey = context.req.header('X-Admin-Key');

  if (!providedKey || providedKey !== ADMIN_API_KEY) {
    throw new UnauthorizedError('Clé admin invalide ou manquante');
  }

  await next();
});
