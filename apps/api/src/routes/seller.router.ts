import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth, requireSellerOwnership } from '../middleware/auth.middleware.js';
import {
  onboardSeller,
  getSellerProfile,
  listSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  archiveSellerProduct,
} from '../services/seller/seller.service.js';

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

const sellerProductsQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  status: z.enum(['draft', 'pending_review', 'active', 'paused', 'archived']).optional(),
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
    return context.json(product, 200);
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
