import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import {
  recommendProducts,
  type RecommendedProduct,
} from './recommendation.service.js';

// ─── Config ────────────────────────────────────────────────────────────────

// Lire la clé à l'appel (pas au chargement du module) pour que les tests
// puissent la surcharger via process.env avant chaque cas de test.
const GEMINI_MODEL = 'gemini-1.5-flash';
const MAX_TURNS_BEFORE_RECOMMEND = 4;

// ─── Types ────────────────────────────────────────────────────────────────

export interface ConversationMessage {
  role: 'user' | 'oreli';
  text: string;
}

export interface GiftChatContext {
  relationshipId?: string;
  productId?: string;
  occasion?: string;
  suggestedDeliveryDate?: string;
}

export interface GiftChatInput {
  messages: ConversationMessage[];
  context?: GiftChatContext;
  userId: string;
}

export interface GiftChatOutput {
  message: string;
  suggestions: string[];
  intent: {
    relationshipId?: string;
    budgetMin?: number;
    budgetMax?: number;
    occasion?: string;
    deliveryDate?: string;
    surpriseMode?: 'total' | 'controlled' | 'manual';
  };
  ready: boolean;
  products?: RecommendedProduct[];
}

// ─── Schéma Zod — réponse Gemini ──────────────────────────────────────────

const GeminiResponseSchema = z.object({
  message: z.string().min(1),
  suggestions: z.array(z.string()).max(5).default([]),
  intent: z.object({
    relationshipId: z.string().uuid().nullable().optional(),
    budgetMin: z.number().int().nullable().optional(),
    budgetMax: z.number().int().nullable().optional(),
    occasion: z.string().nullable().optional(),
    deliveryDate: z.string().nullable().optional(),
    surpriseMode: z.enum(['total', 'controlled', 'manual']).nullable().optional(),
  }),
  ready: z.boolean(),
});

type GeminiResponse = z.infer<typeof GeminiResponseSchema>;

// ─── Fallback si Gemini échoue ─────────────────────────────────────────────

const FALLBACK_RESPONSE: GeminiResponse = {
  message: 'Pour qui souhaites-tu offrir un cadeau ?',
  suggestions: ['Ma partenaire', 'Ma mère', 'Un ami', 'Un collègue'],
  intent: {},
  ready: false,
};

// ─── Fonction principale ──────────────────────────────────────────────────

export async function processGiftChat(input: GiftChatInput): Promise<GiftChatOutput> {
  const { messages, context = {}, userId } = input;

  // Charger les proches de l'utilisateur avec leurs préférences
  const relationships = await prisma.relationship.findMany({
    where: { userId },
    include: { events: { orderBy: { eventDate: 'asc' }, take: 3 } },
    orderBy: { affinityScore: 'desc' },
  });

  const prompt = buildPrompt(messages, context, relationships);
  const geminiResponse = await callGemini(prompt);

  // Si ready: true et que l'intent est complet → lancer la recommandation
  if (geminiResponse.ready && hasCompleteIntent(geminiResponse.intent)) {
    const relationship = relationships.find(
      (r) => r.id === geminiResponse.intent.relationshipId,
    );

    const recipientTagSlugs = buildRecipientTags(relationship?.preferences);

    const recommendationResult = await recommendProducts({
      budgetMin: geminiResponse.intent.budgetMin ?? undefined,
      budgetMax: geminiResponse.intent.budgetMax ?? undefined,
      occasionType: geminiResponse.intent.occasion ?? undefined,
      isSurpriseMode: geminiResponse.intent.surpriseMode === 'total',
      recipientTagSlugs,
      limit: 5,
    });

    return {
      message: geminiResponse.message,
      suggestions: geminiResponse.suggestions,
      intent: cleanIntent(geminiResponse.intent),
      ready: true,
      products: recommendationResult.products,
    };
  }

  return {
    message: geminiResponse.message,
    suggestions: geminiResponse.suggestions,
    intent: cleanIntent(geminiResponse.intent),
    ready: false,
  };
}

// ─── Helpers privés ───────────────────────────────────────────────────────

// Inférer le type avec le bon include pour que `.events` soit disponible
type RelationshipWithEvents = Awaited<
  ReturnType<typeof prisma.relationship.findMany<{
    include: { events: true };
  }>>
>[number];

function buildPrompt(
  messages: ConversationMessage[],
  context: GiftChatContext,
  relationships: RelationshipWithEvents[],
): string {
  const userTurnCount = messages.filter((m) => m.role === 'user').length;
  const forceRecommendInstruction =
    userTurnCount >= MAX_TURNS_BEFORE_RECOMMEND
      ? 'IMPORTANT : Tu as atteint le maximum de tours. Fixe ready: true avec les informations disponibles. Complète les champs manquants avec des valeurs raisonnables.'
      : '';

  const relationshipsJson = JSON.stringify(
    relationships.map((r) => ({
      id: r.id,
      name: r.displayName,
      type: r.relationshipType,
      preferences: r.preferences,
      upcomingEvents: r.events.map((e) => ({
        type: e.eventType,
        date: e.eventDate.toISOString().slice(0, 10),
      })),
    })),
    null,
    2,
  );

  const contextJson = JSON.stringify(context, null, 2);

  const historyText = messages
    .map((m) => `${m.role === 'oreli' ? 'Oreli' : 'Utilisateur'}: ${m.text}`)
    .join('\n');

  return `Tu es Oreli, un concierge gifting premium, chaleureux et efficace.
Ton rôle : collecter les informations nécessaires pour recommander le cadeau parfait, en 3-4 échanges maximum.

RÈGLES ABSOLUES :
- Ne demande JAMAIS ce que tu peux déduire du contexte ou de la conversation
- Si les préférences du proche sont connues, utilise-les sans les redemander
- Si les préférences sont inconnues, pose UNE seule question ouverte
- Maximum 4 tours au total. ${forceRecommendInstruction}
- Ton : chaleureux, concis, jamais condescendant, jamais robotique
- Suggestions : 3-4 chips cliquables, pertinentes au contexte actuel
- Budget en centimes EUR (ex: 50€ = 5000, 100€ = 10000)
- Dès que tu as { relationshipId, budgetMin, budgetMax, occasion, deliveryDate } → ready: true

INFORMATIONS DISPONIBLES :
- Date actuelle : ${new Date().toISOString().slice(0, 10)}
- Proches de l'utilisateur :
${relationshipsJson}
- Contexte d'entrée (déjà connu) :
${contextJson}

CONVERSATION :
${historyText || '(début de conversation)'}

Réponds UNIQUEMENT en JSON valide, sans markdown, sans explication :
{
  "message": "...",
  "suggestions": ["...", "...", "..."],
  "intent": {
    "relationshipId": null,
    "budgetMin": null,
    "budgetMax": null,
    "occasion": null,
    "deliveryDate": null,
    "surpriseMode": "manual"
  },
  "ready": false
}`;
}

async function callGemini(prompt: string): Promise<GeminiResponse> {
  const geminiApiKey = process.env['GEMINI_API_KEY'] ?? '';

  if (!geminiApiKey) {
    console.warn('[chat.service] GEMINI_API_KEY manquante — fallback activé');
    return FALLBACK_RESPONSE;
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: { responseMimeType: 'application/json' },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);

    return GeminiResponseSchema.parse(parsed);
  } catch (error) {
    console.error('[chat.service] Gemini error:', error);
    return FALLBACK_RESPONSE;
  }
}

function hasCompleteIntent(intent: GeminiResponse['intent']): boolean {
  return !!(
    intent.relationshipId &&
    intent.budgetMin != null &&
    intent.budgetMax != null &&
    intent.occasion &&
    intent.deliveryDate
  );
}

function buildRecipientTags(preferences: unknown): string[] {
  if (!preferences || typeof preferences !== 'object') return [];
  const prefs = preferences as Record<string, unknown>;
  const likes = prefs['likes'];
  if (!Array.isArray(likes)) return [];
  return likes.filter((tag): tag is string => typeof tag === 'string');
}

function cleanIntent(intent: GeminiResponse['intent']): GiftChatOutput['intent'] {
  return {
    ...(intent.relationshipId ? { relationshipId: intent.relationshipId } : {}),
    ...(intent.budgetMin != null ? { budgetMin: intent.budgetMin } : {}),
    ...(intent.budgetMax != null ? { budgetMax: intent.budgetMax } : {}),
    ...(intent.occasion ? { occasion: intent.occasion } : {}),
    ...(intent.deliveryDate ? { deliveryDate: intent.deliveryDate } : {}),
    ...(intent.surpriseMode ? { surpriseMode: intent.surpriseMode } : {}),
  };
}
