import { createMiddleware } from 'hono/factory';
import { verifyAccessToken, type AccessTokenPayload } from '../services/auth/jwt.service.js';
import { UnauthorizedError, ForbiddenError } from '../lib/errors.js';

// Extension du contexte Hono avec les données d'authentification
declare module 'hono' {
  interface ContextVariableMap {
    authenticatedUserId: string;
    authenticatedUserRole: string;
    authenticatedSellerId: string;
    jwtPayload: AccessTokenPayload;
  }
}

/**
 * Vérifie le Bearer token et injecte userId + role dans le contexte.
 * À appliquer sur toutes les routes authentifiées.
 */
export const requireAuth = createMiddleware(async (context, next) => {
  const authorizationHeader = context.req.header('Authorization');

  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token d\'authentification manquant');
  }

  const token = authorizationHeader.slice(7); // Retirer "Bearer "
  const payload = verifyAccessToken(token);

  if (!payload) {
    throw new UnauthorizedError('Token invalide ou expiré');
  }

  context.set('jwtPayload', payload);
  context.set('authenticatedUserId', payload.sub);
  context.set('authenticatedUserRole', payload.role);

  if (payload.sellerId) {
    context.set('authenticatedSellerId', payload.sellerId);
  }

  await next();
});

/**
 * Vérifie que l'utilisateur est un vendeur actif.
 * Doit être appliqué après requireAuth sur toutes les routes /seller/*.
 *
 * Règle de sécurité : toujours filtrer les requêtes DB par authenticatedSellerId,
 * jamais par un sellerId venant du body ou des params URL.
 */
export const requireSellerRole = createMiddleware(async (context, next) => {
  const userRole = context.get('authenticatedUserRole');
  const sellerIdFromToken = context.get('jwtPayload')?.sellerId;

  if (userRole !== 'seller' || !sellerIdFromToken) {
    throw new ForbiddenError('Accès réservé aux vendeurs');
  }

  context.set('authenticatedSellerId', sellerIdFromToken);
  await next();
});

/**
 * Vérifie que le sellerId dans l'URL correspond au sellerId du token JWT.
 * Empêche un vendeur d'accéder aux données d'un autre vendeur.
 */
export const requireSellerOwnership = createMiddleware(async (context, next) => {
  const sellerIdFromToken = context.get('authenticatedSellerId');
  const sellerIdFromUrl = context.req.param('sellerId');

  if (sellerIdFromUrl && sellerIdFromUrl !== sellerIdFromToken) {
    throw new ForbiddenError('Vous ne pouvez pas accéder aux données de ce vendeur');
  }

  await next();
});
