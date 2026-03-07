import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth, requireSellerOwnership } from '../middleware/auth.middleware.js';
import {
  onboardSeller,
  getSellerProfile,
  getMySellerProfile,
  updateSellerProfile,
  listSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  archiveSellerProduct,
  setProductStock,
} from '../services/seller/seller.service.js';
import { enqueueProductEmbeddingJob } from '../jobs/product-embedding.job.js';
import {
  listSellerOrders,
  acceptSellerOrder,
  rejectSellerOrder,
  shipSellerOrder,
} from '../services/orders/orders.service.js';

export const sellerRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const onboardSellerSchema = z.object({
  displayName: z.string().min(2).max(100),
  legalName: z.string().max(200).optional(),
  vatNumber: z.string().max(50).optional(),
});

const createProductSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(5000),
  // Prix en centimes EUR (ex: 5000 = 50.00 EUR)
  priceAmount: z.number().int().min(100).max(1_000_000),
  categoryId: z.string().uuid().optional(),
  isSurpriseReady: z.boolean().optional(),
  isLastMinuteOk: z.boolean().optional(),
  preparationTimeMin: z.number().int().min(0).max(10_080).optional(), // max 7 jours
  tagSlugs: z.array(z.string()).max(10).optional(),
});

const updateProductSchema = createProductSchema.partial();

const updateSellerProfileSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  legalName: z.string().max(200).optional(),
  vatNumber: z.string().max(50).optional(),
  slaPrepHours: z.number().int().min(0).max(168).optional(),
  slaDeliveryHours: z.number().int().min(0).max(168).optional(),
  cutoffTimeLocal: z.string().regex(/^\d{2}:\d{2}$/).optional(), // HH:MM
});

const sellerProductsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: z.enum(['draft', 'pending_review', 'active', 'paused', 'archived']).optional(),
});

// ─── Routes authentifiées courtes ─────────────────────────────────────────

/**
 * GET /sellers/me
 * Retourne le profil vendeur de l'utilisateur connecté (null si pas vendeur).
 * Utilisé par la seller console au démarrage pour récupérer le sellerId.
 */
sellerRouter.get('/me', requireAuth, async (context) => {
  const userId = context.get('authenticatedUserId');
  const profile = await getMySellerProfile(userId);
  return context.json(profile, 200);
});

// ─── Routes publiques ──────────────────────────────────────────────────────

/**
 * GET /sellers/:sellerId
 * Profil public d'un vendeur.
 */
sellerRouter.get('/:sellerId', async (context) => {
  const { sellerId } = context.req.param();
  const profile = await getSellerProfile(sellerId);
  return context.json(profile, 200);
});

// ─── Routes authentifiées ──────────────────────────────────────────────────

/**
 * POST /sellers
 * Onboarding d'un nouveau vendeur (réservé aux utilisateurs authentifiés).
 * Un utilisateur ne peut avoir qu'une seule boutique vendeur.
 */
sellerRouter.post(
  '/',
  requireAuth,
  zValidator('json', onboardSellerSchema),
  async (context) => {
    const userId = context.get('authenticatedUserId');
    const input = context.req.valid('json');
    const profile = await onboardSeller(userId, input);
    return context.json(profile, 201);
  },
);

/**
 * PATCH /sellers/:sellerId
 * Mise à jour du profil vendeur (displayName, legalName, VAT, politique SLA).
 */
sellerRouter.patch(
  '/:sellerId',
  requireAuth,
  requireSellerOwnership,
  zValidator('json', updateSellerProfileSchema),
  async (context) => {
    const { sellerId } = context.req.param();
    const input = context.req.valid('json');
    const profile = await updateSellerProfile(sellerId, input);
    return context.json(profile, 200);
  },
);

// ─── Routes vendeur (ownership requis) ────────────────────────────────────

/**
 * GET /sellers/:sellerId/products
 * Liste des produits de la boutique (draft inclus — vue vendeur).
 */
sellerRouter.get(
  '/:sellerId/products',
  requireAuth,
  requireSellerOwnership,
  zValidator('query', sellerProductsQuerySchema),
  async (context) => {
    const { sellerId } = context.req.param();
    const filters = context.req.valid('query');
    const page = await listSellerProducts(sellerId, filters);
    return context.json(page, 200);
  },
);

/**
 * POST /sellers/:sellerId/products
 * Création d'un nouveau produit (status initial : draft).
 */
sellerRouter.post(
  '/:sellerId/products',
  requireAuth,
  requireSellerOwnership,
  zValidator('json', createProductSchema),
  async (context) => {
    const { sellerId } = context.req.param();
    const input = context.req.valid('json');
    const product = await createSellerProduct(sellerId, input);
    // Enfile l'embedding de façon asynchrone — ne bloque pas la réponse
    await enqueueProductEmbeddingJob(product.id, product.title, product.description);
    return context.json(product, 201);
  },
);

/**
 * PATCH /sellers/:sellerId/products/:productId
 * Mise à jour partielle d'un produit.
 */
sellerRouter.patch(
  '/:sellerId/products/:productId',
  requireAuth,
  requireSellerOwnership,
  zValidator('json', updateProductSchema),
  async (context) => {
    const { sellerId, productId } = context.req.param();
    const input = context.req.valid('json');
    const product = await updateSellerProduct(sellerId, productId, input);
    // Re-génère l'embedding seulement si le contenu textuel a changé
    const textContentChanged = input.title !== undefined || input.description !== undefined;
    if (textContentChanged) {
      await enqueueProductEmbeddingJob(product.id, product.title, product.description);
    }
    return context.json(product, 200);
  },
);

/**
 * PATCH /sellers/:sellerId/products/:productId/stock
 * Met à jour le stock disponible d'un produit.
 */
sellerRouter.patch(
  '/:sellerId/products/:productId/stock',
  requireAuth,
  requireSellerOwnership,
  zValidator('json', z.object({ stockQuantity: z.number().int().min(0).max(100_000) })),
  async (context) => {
    const { sellerId, productId } = context.req.param();
    const { stockQuantity } = context.req.valid('json');
    const result = await setProductStock(sellerId, productId, stockQuantity);
    return context.json(result, 200);
  },
);

/**
 * DELETE /sellers/:sellerId/products/:productId
 * Archive un produit (suppression logique — jamais de delete physique).
 */
sellerRouter.delete(
  '/:sellerId/products/:productId',
  requireAuth,
  requireSellerOwnership,
  async (context) => {
    const { sellerId, productId } = context.req.param();
    await archiveSellerProduct(sellerId, productId);
    return context.body(null, 204);
  },
);

// ─── Routes commandes vendeur ──────────────────────────────────────────────

const sellerOrdersQuerySchema = z.object({
  status: z.enum([
    'paid', 'accepted', 'in_preparation', 'shipped', 'delivered', 'cancelled',
  ]).optional(),
});

const rejectOrderSchema = z.object({
  reason: z.string().min(1).max(500),
});

const shipOrderSchema = z.object({
  trackingCode: z.string().min(1).max(200),
});

/**
 * GET /sellers/:sellerId/orders
 * Liste des commandes de la boutique (seulement les produits de ce vendeur).
 */
sellerRouter.get(
  '/:sellerId/orders',
  requireAuth,
  requireSellerOwnership,
  zValidator('query', sellerOrdersQuerySchema),
  async (context) => {
    const { sellerId } = context.req.param();
    const { status } = context.req.valid('query');
    const orders = await listSellerOrders(sellerId, status);
    return context.json(orders, 200);
  },
);

/**
 * PATCH /sellers/:sellerId/orders/:orderId/accept
 * Accepte une commande payée — déclenche la préparation.
 */
sellerRouter.patch(
  '/:sellerId/orders/:orderId/accept',
  requireAuth,
  requireSellerOwnership,
  async (context) => {
    const { sellerId, orderId } = context.req.param();
    await acceptSellerOrder(sellerId, orderId);
    return context.json({ success: true }, 200);
  },
);

/**
 * PATCH /sellers/:sellerId/orders/:orderId/reject
 * Rejette une commande payée — libère le stock et annule la commande.
 */
sellerRouter.patch(
  '/:sellerId/orders/:orderId/reject',
  requireAuth,
  requireSellerOwnership,
  zValidator('json', rejectOrderSchema),
  async (context) => {
    const { sellerId, orderId } = context.req.param();
    const { reason } = context.req.valid('json');
    await rejectSellerOrder(sellerId, orderId, reason);
    return context.json({ success: true }, 200);
  },
);

/**
 * PATCH /sellers/:sellerId/orders/:orderId/ship
 * Marque la commande comme expédiée avec le numéro de suivi.
 */
sellerRouter.patch(
  '/:sellerId/orders/:orderId/ship',
  requireAuth,
  requireSellerOwnership,
  zValidator('json', shipOrderSchema),
  async (context) => {
    const { sellerId, orderId } = context.req.param();
    const { trackingCode } = context.req.valid('json');
    await shipSellerOrder(sellerId, orderId, trackingCode);
    return context.json({ success: true }, 200);
  },
);
