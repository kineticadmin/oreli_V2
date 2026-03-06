import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  recommendProducts,
  getCuratedHomeProducts,
} from '../services/gift/recommendation.service.js';

export const giftRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const giftIntentSchema = z.object({
  // Budget en centimes EUR (ex: 5000 = 50.00 EUR)
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  occasionType: z.string().max(50).optional(),
  recipientTagSlugs: z.array(z.string()).max(20).optional(),
  isSurpriseMode: z.boolean().optional(),
  isLastMinute: z.boolean().optional(),
  limit: z.number().int().min(1).max(20).optional(),
});

// ─── Routes ────────────────────────────────────────────────────────────────

/**
 * POST /gift/recommend
 * Moteur de recommandation V1 (rules engine + scoring composite).
 * V2 : remplacement par Gemini embeddings + pgvector similarity search.
 */
giftRouter.post(
  '/recommend',
  zValidator('json', giftIntentSchema),
  async (context) => {
    const intent = context.req.valid('json');
    const result = await recommendProducts(intent);
    return context.json(result, 200);
  },
);

/**
 * GET /gift/home/curated
 * Sélection curatoriale pour la home : 8 produits diversifiés des meilleurs vendeurs.
 * Mise en cache possible côté client (données relativement stables).
 */
giftRouter.get('/home/curated', async (context) => {
  const products = await getCuratedHomeProducts();
  return context.json(products, 200);
});
