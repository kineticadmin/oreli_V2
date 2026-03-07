import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import {
  recommendProducts,
  getCuratedHomeProducts,
} from '../services/gift/recommendation.service.js';
import {
  processGiftChat,
  type ConversationMessage,
} from '../services/gift/chat.service.js';

export const giftRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const conversationMessageSchema = z.object({
  role: z.enum(['user', 'oreli']),
  text: z.string().min(1).max(2000),
});

const giftChatSchema = z.object({
  messages: z.array(conversationMessageSchema).max(20),
  context: z.object({
    relationshipId: z.string().uuid().optional(),
    productId: z.string().uuid().optional(),
    occasion: z.string().max(50).optional(),
    suggestedDeliveryDate: z.string().optional(),
  }).optional(),
});

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
 * POST /gift/chat
 * Conversation Gemini pilotée : collecte l'intent en 3-4 échanges max,
 * retourne les recommandations quand ready: true.
 * Auth optionnelle — guests peuvent utiliser (sans historique proches).
 */
giftRouter.post(
  '/chat',
  zValidator('json', giftChatSchema),
  async (context) => {
    const { messages, context: chatContext } = context.req.valid('json');

    // userId optionnel — si non authentifié, les proches ne sont pas chargés
    const userId = context.get('authenticatedUserId') as string | undefined;

    // Build context without explicit `undefined` values to satisfy exactOptionalPropertyTypes
    const resolvedChatContext: Record<string, string> = {};
    if (chatContext?.relationshipId) resolvedChatContext['relationshipId'] = chatContext.relationshipId;
    if (chatContext?.productId) resolvedChatContext['productId'] = chatContext.productId;
    if (chatContext?.occasion) resolvedChatContext['occasion'] = chatContext.occasion;
    if (chatContext?.suggestedDeliveryDate) resolvedChatContext['suggestedDeliveryDate'] = chatContext.suggestedDeliveryDate;

    const result = await processGiftChat({
      messages: messages as ConversationMessage[],
      context: resolvedChatContext,
      userId: userId ?? '',
    });

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
