import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  listPublicProducts,
  getPublicProduct,
  listCategories,
} from '../services/catalog/catalog.service.js';

export const catalogRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const productListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  categoryId: z.string().uuid().optional(),
  minPriceAmount: z.coerce.number().int().min(0).optional(),
  maxPriceAmount: z.coerce.number().int().min(0).optional(),
  isSurpriseReady: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  isLastMinuteOk: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  // Tags séparés par virgule : ?tagSlugs=romantique,anniversaire
  tagSlugs: z
    .string()
    .transform((value) => value.split(',').map((slug) => slug.trim()).filter(Boolean))
    .optional(),
});

// ─── Routes ────────────────────────────────────────────────────────────────

/**
 * GET /catalog/products
 * Liste paginée des produits actifs avec filtres optionnels.
 */
catalogRouter.get(
  '/products',
  zValidator('query', productListQuerySchema),
  async (context) => {
    const filters = context.req.valid('query');
    const page = await listPublicProducts(filters);
    return context.json(page, 200);
  },
);

/**
 * GET /catalog/products/:productId
 * Détail d'un produit actif.
 */
catalogRouter.get('/products/:productId', async (context) => {
  const { productId } = context.req.param();
  const product = await getPublicProduct(productId);
  return context.json(product, 200);
});

/**
 * GET /catalog/categories
 * Liste de toutes les catégories (triées par nom).
 */
catalogRouter.get('/categories', async (context) => {
  const categories = await listCategories();
  return context.json(categories, 200);
});
