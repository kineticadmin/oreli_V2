# Oreli Chat IA — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remplacer le wizard hardcodé par une conversation Gemini qui collecte les infos manquantes en 3-4 échanges max et retourne des recommandations avec justifications.

**Architecture:** `POST /gift/chat` reçoit l'historique complet + le contexte d'entrée, appelle Gemini 1.5 Flash (JSON forcé), parse la réponse avec Zod, et déclenche le moteur de recommandation existant quand `ready: true`. Stateless côté serveur. Le hook `useGiftChat` côté client maintient l'historique et expose les messages/suggestions/produits.

**Tech Stack:** `@google/generative-ai` (Google AI Studio), Gemini 1.5 Flash, Zod, Vitest, React Native, Next.js 14

---

## Task 1 : Installer le SDK Gemini dans apps/api

**Files:**
- Modify: `apps/api/package.json`

**Step 1 : Installer `@google/generative-ai`**

```bash
cd apps/api && pnpm add @google/generative-ai
```

**Step 2 : Vérifier que le package est dans les dépendances**

```bash
grep "@google/generative-ai" apps/api/package.json
```

Expected : `"@google/generative-ai": "^0.x.x"`

**Step 3 : Ajouter `GEMINI_API_KEY` dans `.env.example` (à la racine de apps/api)**

Si le fichier n'existe pas, le créer. Ajouter la ligne :

```
GEMINI_API_KEY=AIza...   # Google AI Studio — aistudio.google.com (free tier)
```

**Step 4 : Commit**

```bash
git add apps/api/package.json apps/api/pnpm-lock.yaml
git commit -m "chore: add @google/generative-ai SDK to apps/api"
```

---

## Task 2 : Service Gemini chat — `chat.service.ts`

**Files:**
- Create: `apps/api/src/services/gift/chat.service.ts`
- Create: `apps/api/src/services/gift/chat.service.test.ts`

### Step 1 : Écrire les tests en premier

Créer `apps/api/src/services/gift/chat.service.test.ts` :

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @google/generative-ai avant l'import du service
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn(),
    }),
  })),
}));

// Mock prisma
vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    relationship: {
      findMany: vi.fn(),
    },
  },
}));

// Mock recommendation service
vi.mock('./recommendation.service.js', () => ({
  recommendProducts: vi.fn(),
}));

import { processGiftChat } from './chat.service.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../../lib/prisma.js';
import { recommendProducts } from './recommendation.service.js';

describe('processGiftChat', () => {
  const mockUserId = '00000000-0000-0000-0000-000000000001';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.relationship.findMany).mockResolvedValue([]);
  });

  it('retourne un message Oreli et des suggestions quand ready: false', async () => {
    const mockGenerate = vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          message: 'Pour qui veux-tu offrir un cadeau ?',
          suggestions: ['Sophie', 'Maman', 'Un ami'],
          intent: { relationshipId: null, budgetMin: null, budgetMax: null, occasion: null, deliveryDate: null, surpriseMode: 'manual' },
          ready: false,
        }),
      },
    });

    const MockGAI = vi.mocked(GoogleGenerativeAI);
    MockGAI.mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({ generateContent: mockGenerate }),
    }) as never);

    const result = await processGiftChat({
      messages: [],
      context: {},
      userId: mockUserId,
    });

    expect(result.message).toBe('Pour qui veux-tu offrir un cadeau ?');
    expect(result.suggestions).toHaveLength(3);
    expect(result.ready).toBe(false);
    expect(result.products).toBeUndefined();
  });

  it('appelle recommendProducts quand ready: true', async () => {
    const mockGenerate = vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          message: "J'ai trouvé 3 cadeaux parfaits !",
          suggestions: [],
          intent: {
            relationshipId: '00000000-0000-0000-0000-000000000002',
            budgetMin: 4000,
            budgetMax: 6000,
            occasion: 'birthday',
            deliveryDate: '2026-03-14',
            surpriseMode: 'manual',
          },
          ready: true,
        }),
      },
    });

    const MockGAI = vi.mocked(GoogleGenerativeAI);
    MockGAI.mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({ generateContent: mockGenerate }),
    }) as never);

    vi.mocked(recommendProducts).mockResolvedValue({
      products: [
        {
          id: 'prod-1',
          title: 'Box Chocolats Artisanaux',
          description: 'Une sélection premium',
          priceAmount: 4500,
          currency: 'EUR',
          coverImageUrl: null,
          isSurpriseReady: true,
          isLastMinuteOk: false,
          category: { id: 'cat-1', name: 'Chocolat', slug: 'chocolat' },
          tags: [{ slug: 'artisanal', label: 'Artisanal' }],
          seller: { id: 'sel-1', displayName: 'Maison Cacao' },
          score: 0.92,
        },
      ],
      totalCandidatesEvaluated: 10,
    });

    const result = await processGiftChat({
      messages: [
        { role: 'oreli', text: 'Pour qui ?' },
        { role: 'user', text: 'Sophie' },
      ],
      context: {},
      userId: mockUserId,
    });

    expect(result.ready).toBe(true);
    expect(result.products).toHaveLength(1);
    expect(recommendProducts).toHaveBeenCalledWith(
      expect.objectContaining({ budgetMin: 4000, budgetMax: 6000 }),
    );
  });

  it('gère une réponse JSON invalide de Gemini avec un fallback', async () => {
    const mockGenerate = vi.fn().mockResolvedValue({
      response: { text: () => 'pas du json' },
    });

    const MockGAI = vi.mocked(GoogleGenerativeAI);
    MockGAI.mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({ generateContent: mockGenerate }),
    }) as never);

    const result = await processGiftChat({
      messages: [],
      context: {},
      userId: mockUserId,
    });

    // Fallback : message neutre, pas de crash
    expect(result.message).toBeTruthy();
    expect(result.ready).toBe(false);
  });

  it('inclut les préférences des proches dans le contexte Gemini', async () => {
    vi.mocked(prisma.relationship.findMany).mockResolvedValue([
      {
        id: '00000000-0000-0000-0000-000000000002',
        userId: mockUserId,
        displayName: 'Sophie',
        relationshipType: 'partner' as never,
        birthdate: null,
        preferences: { likes: ['chocolat', 'yoga'], dislikes: ['parfum'] },
        affinityScore: 0.9,
        createdAt: new Date(),
      },
    ]);

    const mockGenerate = vi.fn().mockResolvedValue({
      response: {
        text: () => JSON.stringify({
          message: 'Sophie a de la chance !',
          suggestions: ['Anniversaire', 'Saint-Valentin'],
          intent: { relationshipId: '00000000-0000-0000-0000-000000000002', budgetMin: null, budgetMax: null, occasion: null, deliveryDate: null, surpriseMode: 'manual' },
          ready: false,
        }),
      },
    });

    const MockGAI = vi.mocked(GoogleGenerativeAI);
    MockGAI.mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({ generateContent: mockGenerate }),
    }) as never);

    await processGiftChat({
      messages: [],
      context: { relationshipId: '00000000-0000-0000-0000-000000000002' },
      userId: mockUserId,
    });

    // Vérifier que le prompt envoyé à Gemini contient les préférences
    const callArg = mockGenerate.mock.calls[0][0] as string;
    expect(callArg).toContain('chocolat');
    expect(callArg).toContain('Sophie');
  });
});
```

### Step 2 : Lancer les tests pour confirmer qu'ils échouent

```bash
cd apps/api && npx vitest run src/services/gift/chat.service.test.ts 2>&1 | tail -20
```

Expected : FAIL — `chat.service.js` n'existe pas encore.

### Step 3 : Implémenter `chat.service.ts`

Créer `apps/api/src/services/gift/chat.service.ts` :

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import {
  recommendProducts,
  type RecommendedProduct,
} from './recommendation.service.js';

// ─── Config ────────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env['GEMINI_API_KEY'] ?? '';
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

type RelationshipWithEvents = Awaited<
  ReturnType<typeof prisma.relationship.findMany>
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
  if (!GEMINI_API_KEY) {
    console.warn('[chat.service] GEMINI_API_KEY manquante — fallback activé');
    return FALLBACK_RESPONSE;
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
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
  return likes.filter((t): t is string => typeof t === 'string');
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
```

### Step 4 : Lancer les tests

```bash
cd apps/api && npx vitest run src/services/gift/chat.service.test.ts 2>&1 | tail -30
```

Expected : 4 tests PASS.

### Step 5 : Typecheck

```bash
cd apps/api && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 6 : Commit

```bash
git add apps/api/src/services/gift/chat.service.ts apps/api/src/services/gift/chat.service.test.ts
git commit -m "feat(api): chat.service — Gemini pilote la conversation gifting"
```

---

## Task 3 : Route `POST /gift/chat`

**Files:**
- Modify: `apps/api/src/routes/gift.router.ts`

### Step 1 : Ajouter le schéma Zod et la route

Dans `apps/api/src/routes/gift.router.ts`, ajouter après les imports existants :

```typescript
import {
  processGiftChat,
  type ConversationMessage,
} from '../services/gift/chat.service.js';
```

Puis ajouter le schéma de validation :

```typescript
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
```

Puis ajouter la route à la fin du fichier :

```typescript
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

    const result = await processGiftChat({
      messages: messages as ConversationMessage[],
      context: chatContext ?? {},
      userId: userId ?? '',
    });

    return context.json(result, 200);
  },
);
```

### Step 2 : Typecheck

```bash
cd apps/api && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 3 : Commit

```bash
git add apps/api/src/routes/gift.router.ts
git commit -m "feat(api): POST /gift/chat — route conversation Gemini"
```

---

## Task 4 : Seed data

**Files:**
- Create: `apps/api/src/seed.ts`
- Modify: `apps/api/package.json` (scripts)

### Step 1 : Créer le script de seed

Créer `apps/api/src/seed.ts` :

```typescript
/**
 * Seed data — données de test pour développement local.
 * Toutes les entités ont isTestData: true dans metadata pour nettoyage propre.
 *
 * Usage:
 *   pnpm seed           → insérer les données
 *   pnpm seed:clean     → supprimer uniquement les données de test
 */

import { PrismaClient } from '@oreli/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const IS_TEST_DATA_FLAG = { isTestData: true };

async function seed() {
  console.log('🌱 Seeding test data...');

  // ─── Nettoyage préalable (idempotent) ──────────────────────────────────
  await cleanTestData(prisma);

  // ─── Catégories ────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'chocolat' }, update: {}, create: { name: 'Chocolat', slug: 'chocolat' } }),
    prisma.category.upsert({ where: { slug: 'bien-etre' }, update: {}, create: { name: 'Bien-être', slug: 'bien-etre' } }),
    prisma.category.upsert({ where: { slug: 'gastronomie' }, update: {}, create: { name: 'Gastronomie', slug: 'gastronomie' } }),
    prisma.category.upsert({ where: { slug: 'accessoires' }, update: {}, create: { name: 'Accessoires', slug: 'accessoires' } }),
    prisma.category.upsert({ where: { slug: 'experiences' }, update: {}, create: { name: 'Expériences', slug: 'experiences' } }),
  ]);

  const [catChocolat, catBienEtre, catGastro, catAccessoires, catExp] = categories;

  // ─── Tags ──────────────────────────────────────────────────────────────
  const tagSlugs = [
    { slug: 'romantique', label: 'Romantique' },
    { slug: 'artisanal', label: 'Artisanal' },
    { slug: 'local', label: 'Local Brussels' },
    { slug: 'wellness', label: 'Wellness' },
    { slug: 'gourmet', label: 'Gourmet' },
    { slug: 'couple', label: 'Pour couple' },
    { slug: 'femme', label: 'Pour femme' },
    { slug: 'homme', label: 'Pour homme' },
    { slug: 'premium', label: 'Premium' },
    { slug: 'fait-main', label: 'Fait main' },
    { slug: 'birthday', label: 'Anniversaire' },
    { slug: 'celebration', label: 'Célébration' },
    { slug: 'detente', label: 'Détente' },
    { slug: 'gastronomie', label: 'Gastronomie' },
    { slug: 'decouverte', label: 'Découverte' },
  ];

  const tags = await Promise.all(
    tagSlugs.map((t) =>
      prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t }),
    ),
  );

  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t.id]));

  // ─── Sellers ───────────────────────────────────────────────────────────
  const sellers = await Promise.all([
    prisma.seller.create({
      data: {
        displayName: 'Maison Cacao',
        legalName: 'Maison Cacao SPRL',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.96,
        policy: { create: { slaPrepHours: 2, slaDeliveryHours: 4, cutoffTimeLocal: '16:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: "L'Apothicaire Bruxelles",
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.91,
        policy: { create: { slaPrepHours: 3, slaDeliveryHours: 6, cutoffTimeLocal: '15:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: 'Cave du Sablon',
        legalName: 'Cave du Sablon SA',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.88,
        policy: { create: { slaPrepHours: 4, slaDeliveryHours: 8, cutoffTimeLocal: '14:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: 'Atelier Brussel',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.93,
        policy: { create: { slaPrepHours: 6, slaDeliveryHours: 24, cutoffTimeLocal: '17:00' } },
      },
    }),
    prisma.seller.create({
      data: {
        displayName: 'Expériences & Co',
        status: 'active',
        kybStatus: 'approved',
        reliabilityScore: 0.85,
        policy: { create: { slaPrepHours: 1, slaDeliveryHours: 2, cutoffTimeLocal: '18:00' } },
      },
    }),
  ]);

  const [sellerCacao, sellerApo, sellerCave, sellerAtelier, sellerExp] = sellers;

  // ─── Produits (25) ─────────────────────────────────────────────────────

  type ProductSeed = {
    sellerId: string;
    categoryId: string;
    title: string;
    description: string;
    priceAmount: number;
    isSurpriseReady: boolean;
    isLastMinuteOk: boolean;
    preparationTimeMin: number | null;
    stock: number;
    tagSlugsToLink: string[];
  };

  const productSeeds: ProductSeed[] = [
    // Chocolat (5)
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Box Grands Crus — Sélection Maison Cacao',
      description: 'Une sélection de 12 pralines artisanales fabriquées à Bruxelles. Cacao origine Équateur et Madagascar. Packaging cadeau inclus.',
      priceAmount: 3500,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 30,
      stock: 25,
      tagSlugsToLink: ['artisanal', 'local', 'romantique', 'birthday'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Coffret Tablettes Origines — 6 pièces',
      description: '6 tablettes de chocolat noir 70% issues de 6 origines différentes. Un voyage sensoriel en format cadeau.',
      priceAmount: 4800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 60,
      stock: 15,
      tagSlugsToLink: ['artisanal', 'gourmet', 'premium', 'decouverte'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Truffes Maison — Boîte de 24',
      description: 'Truffes au chocolat belge et ganaches variées : vanille bourbon, caramel fleur de sel, praliné noisette.',
      priceAmount: 2800,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 20,
      stock: 30,
      tagSlugsToLink: ['artisanal', 'fait-main', 'celebration'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Duo Couple — Box Chocolats & Message Personnalisé',
      description: 'Box romantique pour deux : 16 pralines assorties + carte message personnalisée gravée. Idéal anniversaire ou Saint-Valentin.',
      priceAmount: 5500,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 90,
      stock: 10,
      tagSlugsToLink: ['romantique', 'couple', 'artisanal', 'birthday'],
    },
    {
      sellerId: sellerCacao.id,
      categoryId: catChocolat.id,
      title: 'Tablette Grand Format — Personnalisable',
      description: 'Tablette de chocolat au lait 500g avec prénom ou message personnalisé gravé. Emballage premium.',
      priceAmount: 3200,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 120,
      stock: 8,
      tagSlugsToLink: ['fait-main', 'premium', 'celebration'],
    },
    // Bien-être (5)
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Kit Rituel Spa Maison — Collection Bruxelles',
      description: 'Coffret bien-être : bougie de soja, sel de bain aux huiles essentielles, masque visage, gommage corps. Fabriqué à Bruxelles.',
      priceAmount: 6800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 45,
      stock: 12,
      tagSlugsToLink: ['wellness', 'femme', 'artisanal', 'detente'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Bougie Parfumée Artisanale — Figuier & Cèdre',
      description: 'Bougie en cire de soja 200g, parfum délicat figuier et bois de cèdre. Mèche en coton, 45h de combustion. Made in Brussels.',
      priceAmount: 3200,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 15,
      stock: 40,
      tagSlugsToLink: ['artisanal', 'local', 'wellness', 'femme'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Coffret Soins Visage — Actifs Botaniques',
      description: 'Routine visage complète : sérum hyaluronique, crème jour, huile démaquillante. Formulations naturelles, testées dermatologiquement.',
      priceAmount: 8900,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 30,
      stock: 7,
      tagSlugsToLink: ['wellness', 'premium', 'femme'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Pack Méditation — Tapis, Bougie & Thé',
      description: 'Kit méditation pour débutants : tapis de yoga fin 3mm, bougie méditation lavande, thé blanc bio. Un cadeau qui invite à ralentir.',
      priceAmount: 5500,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 30,
      stock: 9,
      tagSlugsToLink: ['wellness', 'detente', 'femme'],
    },
    {
      sellerId: sellerApo.id,
      categoryId: catBienEtre.id,
      title: 'Coffret Bain Sensoriel — Sel & Huiles',
      description: 'Box bain luxueuse : 3 sachets de sel minéral (rose, noir, blanc), 2 huiles de bain, pierre ponce naturelle.',
      priceAmount: 4200,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 20,
      stock: 18,
      tagSlugsToLink: ['wellness', 'detente', 'fait-main'],
    },
    // Gastronomie (5)
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Coffret Vins Naturels — 3 Bouteilles Sélection Sablon',
      description: '3 vins naturels sélectionnés par notre sommelier : un blanc minéral, un rouge gourmand, un orange surprenant. Fiches de dégustation incluses.',
      priceAmount: 8500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 60,
      stock: 6,
      tagSlugsToLink: ['gourmet', 'homme', 'premium', 'decouverte'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Box Apéro Belge — Charcuterie & Fromages Artisanaux',
      description: 'Sélection belge : coppa, jambon d\'Ardenne, fromage de Herve, gaufres liégeoises. Pour 2 personnes, livré sous vide.',
      priceAmount: 6200,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 30,
      stock: 14,
      tagSlugsToLink: ['gourmet', 'artisanal', 'local', 'celebration'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Coffret Huiles & Vinaigres Rares',
      description: 'Pour le cuisinier curieux : huile d\'olive AOP Crète, huile de truffe noire, vinaigre balsamique 12 ans. Coffret bois inclus.',
      priceAmount: 7400,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 45,
      stock: 5,
      tagSlugsToLink: ['gourmet', 'premium', 'fait-main'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Champagne & Pralines — Coffret Célébration',
      description: 'Le grand classique revisité : une bouteille de champagne Blanc de Blancs + box de 8 pralines Maison Cacao.',
      priceAmount: 9800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 60,
      stock: 8,
      tagSlugsToLink: ['romantique', 'couple', 'premium', 'celebration'],
    },
    {
      sellerId: sellerCave.id,
      categoryId: catGastro.id,
      title: 'Box Petit-Déjeuner Luxe — Livraison Matin',
      description: 'Réveil gourmand : croissants frais de la boulangerie, confiture artisanale, miel local, jus pressé, café grand cru.',
      priceAmount: 5500,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 15,
      stock: 20,
      tagSlugsToLink: ['artisanal', 'local', 'gourmet', 'birthday'],
    },
    // Accessoires (5)
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Carnet Cuir Pleine Fleur — Gravure Personnalisée',
      description: 'Carnet A5 en cuir végétan tanné naturellement. Pages ivoire non lignées 120g. Gravure prénom ou initiales incluse.',
      priceAmount: 4500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 1440,
      stock: 15,
      tagSlugsToLink: ['artisanal', 'fait-main', 'premium'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Tote Bag Lin Naturel — Broderie Bruxelles',
      description: 'Grand sac en lin naturel certifié OEKO-TEX. Broderie "Bruxelles" en fil doré. Anses en coton tressé. 40x45cm.',
      priceAmount: 3800,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 240,
      stock: 22,
      tagSlugsToLink: ['artisanal', 'local', 'femme', 'fait-main'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Porte-Clés Cuir Monogramme',
      description: 'Porte-clés en cuir pleine fleur avec vos initiales estampées à chaud. Finition naturelle patinée. Fabriqué à Bruxelles.',
      priceAmount: 2200,
      isSurpriseReady: true,
      isLastMinuteOk: false,
      preparationTimeMin: 360,
      stock: 30,
      tagSlugsToLink: ['artisanal', 'fait-main', 'homme'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Kit Bureau Premium — Organisateur & Stylo',
      description: 'Pour le professionnel élégant : organisateur de bureau en chêne massif + stylo plume en résine. Boîte cadeau incluse.',
      priceAmount: 6500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: 120,
      stock: 8,
      tagSlugsToLink: ['premium', 'homme', 'artisanal'],
    },
    {
      sellerId: sellerAtelier.id,
      categoryId: catAccessoires.id,
      title: 'Sachet Bain & Cadeau — Packaging Luxe',
      description: 'Mini kit cadeau prêt à offrir : sachet organza, petite bougie, savon artisanal, carte message. Idéal collègue ou remerciement.',
      priceAmount: 1800,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: 10,
      stock: 50,
      tagSlugsToLink: ['artisanal', 'fait-main', 'wellness'],
    },
    // Expériences (5)
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Atelier Chocolat Pour 2 — Maison Cacao',
      description: '2h d\'atelier avec notre maître chocolatier : création de pralines et truffes maison. Tabliers fournis. Dégustation incluse.',
      priceAmount: 12000,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: null,
      stock: 4,
      tagSlugsToLink: ['couple', 'decouverte', 'artisanal', 'celebration'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Dégustation Vins Naturels Guidée — 1h30',
      description: 'Session de dégustation avec notre sommelier : 6 vins naturels en dégustation à l\'aveugle. Accord mets-vins, lexique sensoriel.',
      priceAmount: 8500,
      isSurpriseReady: false,
      isLastMinuteOk: true,
      preparationTimeMin: null,
      stock: 6,
      tagSlugsToLink: ['gourmet', 'decouverte', 'couple'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Brunch Gastronomique Privé — Pour 2',
      description: 'Brunch le dimanche matin dans notre espace privatisé : table dressée, menu 8 plats, accords jus & vins doux.',
      priceAmount: 15000,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: null,
      stock: 2,
      tagSlugsToLink: ['romantique', 'couple', 'premium', 'gourmet'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Cours de Cuisine Belge — 2h Avec Chef',
      description: 'Apprenez à cuisiner 3 classiques belges revisités avec un chef étoilé. Dîner à emporter inclus. Max 4 participants.',
      priceAmount: 9500,
      isSurpriseReady: false,
      isLastMinuteOk: false,
      preparationTimeMin: null,
      stock: 4,
      tagSlugsToLink: ['decouverte', 'gastronomie', 'artisanal'],
    },
    {
      sellerId: sellerExp.id,
      categoryId: catExp.id,
      title: 'Visite Privée Grand-Place + Dégustation Bières',
      description: 'Visite guidée privée de la Grand-Place (1h) + dégustation de 5 bières artisanales bruxelloises dans un café historique.',
      priceAmount: 7500,
      isSurpriseReady: true,
      isLastMinuteOk: true,
      preparationTimeMin: null,
      stock: 8,
      tagSlugsToLink: ['local', 'decouverte', 'couple', 'homme'],
    },
  ];

  // Créer les produits
  for (const seed of productSeeds) {
    const product = await prisma.product.create({
      data: {
        sellerId: seed.sellerId,
        categoryId: seed.categoryId,
        title: seed.title,
        description: seed.description,
        priceAmount: seed.priceAmount,
        status: 'active',
        isSurpriseReady: seed.isSurpriseReady,
        isLastMinuteOk: seed.isLastMinuteOk,
        ...(seed.preparationTimeMin != null ? { preparationTimeMin: seed.preparationTimeMin } : {}),
        inventory: {
          create: { stockQuantity: seed.stock, reservedQuantity: 0 },
        },
        tags: {
          create: seed.tagSlugsToLink
            .filter((slug) => tagMap[slug])
            .map((slug) => ({ tagId: tagMap[slug] })),
        },
      },
    });
    console.log(`  ✓ Product: ${product.title}`);
  }

  // ─── Utilisateur de test ───────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Test1234!', 10);

  const testUser = await prisma.user.create({
    data: {
      email: 'test@oreli.ai',
      firstName: 'Alex',
      lastName: 'Test',
      passwordHash,
      status: 'active',
      addresses: {
        create: {
          label: 'Domicile',
          name: 'Alex Test',
          line: 'Rue de la Loi 42',
          city: 'Bruxelles',
          postalCode: '1000',
          country: 'BE',
          isDefault: true,
        },
      },
    },
  });

  console.log(`  ✓ User: ${testUser.email}`);

  // ─── Relationships avec préférences riches ────────────────────────────

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const inTwoMonths = new Date();
  inTwoMonths.setMonth(inTwoMonths.getMonth() + 2);

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Sophie',
      relationshipType: 'partner',
      birthdate: new Date('1992-03-14'),
      affinityScore: 0.95,
      preferences: {
        likes: ['chocolat artisanal', 'yoga', 'bougies', 'bien-être', 'vin blanc'],
        dislikes: ['parfum', 'alcool fort'],
        style: 'minimaliste premium',
        colors: ['blanc', 'beige', 'or'],
      },
      events: {
        create: [
          {
            userId: testUser.id,
            eventType: 'birthday',
            eventDate: tomorrow,
            isRecurring: true,
          },
        ],
      },
    },
  });

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Maman',
      relationshipType: 'parent',
      birthdate: new Date('1958-05-11'),
      affinityScore: 0.90,
      preferences: {
        likes: ['fleurs', 'thé', 'lecture', 'jardinage', 'chocolat au lait'],
        dislikes: ['alcool', 'gadgets technologiques'],
        style: 'classique chaleureux',
        colors: ['rose', 'vert', 'bordeaux'],
      },
      events: {
        create: [
          {
            userId: testUser.id,
            eventType: 'mothers_day',
            eventDate: new Date(new Date().getFullYear(), 4, 11),
            isRecurring: true,
          },
        ],
      },
    },
  });

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Marc',
      relationshipType: 'friend',
      birthdate: new Date('1989-07-22'),
      affinityScore: 0.75,
      preferences: {
        likes: ['gastronomie', 'vins', 'sport', 'voyages', 'bières artisanales'],
        dislikes: ['accessoires déco', 'bougies'],
        style: 'aventurier gourmet',
        colors: ['noir', 'gris', 'bleu marine'],
      },
      events: {
        create: [],
      },
    },
  });

  await prisma.relationship.create({
    data: {
      userId: testUser.id,
      displayName: 'Julie',
      relationshipType: 'colleague',
      birthdate: null,
      affinityScore: 0.60,
      preferences: {
        likes: ['accessoires bureau', 'chocolat', 'café', 'plantes'],
        dislikes: [],
        style: 'pratique et élégant',
      },
      events: {
        create: [
          {
            userId: testUser.id,
            eventType: 'birthday',
            eventDate: inTwoMonths,
            isRecurring: true,
          },
        ],
      },
    },
  });

  console.log('  ✓ Relationships: Sophie, Maman, Marc, Julie');
  console.log('\n✅ Seed terminé !');
  console.log('\n📝 Credentials de test:');
  console.log('   Email    : test@oreli.ai');
  console.log('   Password : Test1234!');
}

async function cleanTestData(_prisma: PrismaClient) {
  // Supprimer dans l'ordre pour respecter les FK
  // On identifie les données de test par l'email test@oreli.ai pour les users
  // et par displayName pour les sellers (préfixés avec des noms spécifiques)
  const testSellerNames = [
    'Maison Cacao',
    "L'Apothicaire Bruxelles",
    'Cave du Sablon',
    'Atelier Brussel',
    'Expériences & Co',
  ];

  const testUser = await _prisma.user.findUnique({ where: { email: 'test@oreli.ai' } });
  if (testUser) {
    await _prisma.user.delete({ where: { id: testUser.id } });
    console.log('  🗑️  User test supprimé');
  }

  for (const name of testSellerNames) {
    const seller = await _prisma.seller.findFirst({ where: { displayName: name } });
    if (seller) {
      await _prisma.seller.delete({ where: { id: seller.id } });
      console.log(`  🗑️  Seller "${name}" supprimé`);
    }
  }
}

async function cleanOnly() {
  console.log('🗑️  Nettoyage des données de test...');
  await cleanTestData(prisma);
  console.log('✅ Nettoyage terminé');
}

// Main
const isCleanOnly = process.argv.includes('--clean');

if (isCleanOnly) {
  cleanOnly()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
} else {
  seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
```

### Step 2 : Ajouter les scripts dans `apps/api/package.json`

Dans la section `"scripts"` de `apps/api/package.json`, ajouter :

```json
"seed": "tsx src/seed.ts",
"seed:clean": "tsx src/seed.ts --clean"
```

### Step 3 : Typecheck

```bash
cd apps/api && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 4 : Commit

```bash
git add apps/api/src/seed.ts apps/api/package.json
git commit -m "feat(api): seed data — 25 produits, 5 sellers, 4 relationships test"
```

---

## Task 5 : Hook `useGiftChat` — Mobile

**Files:**
- Create: `apps/mobile/hooks/useGiftChat.ts`

### Step 1 : Créer le hook

Créer `apps/mobile/hooks/useGiftChat.ts` :

```typescript
import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface GiftChatMessage {
    role: 'user' | 'oreli';
    text: string;
}

export interface GiftChatContext {
    relationshipId?: string;
    productId?: string;
    occasion?: string;
    suggestedDeliveryDate?: string;
}

export interface RecommendedProduct {
    id: string;
    title: string;
    description: string;
    priceAmount: number;
    currency: string;
    coverImageUrl: string | null;
    isSurpriseReady: boolean;
    isLastMinuteOk: boolean;
    category: { id: string; name: string; slug: string } | null;
    tags: { slug: string; label: string }[];
    seller: { id: string; displayName: string };
    score: number;
    justification?: string; // Phrase générée par Gemini
}

interface GiftChatResponse {
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

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useGiftChat(context: GiftChatContext = {}) {
    const [messages, setMessages] = useState<GiftChatMessage[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [products, setProducts] = useState<RecommendedProduct[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Envoyer un message utilisateur et obtenir la réponse d'Oreli
    const sendMessage = useCallback(async (userText: string) => {
        const userMessage: GiftChatMessage = { role: 'user', text: userText };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setSuggestions([]);
        setIsLoading(true);

        try {
            const response = await apiRequest<GiftChatResponse>('/gift/chat', {
                method: 'POST',
                body: {
                    messages: updatedMessages,
                    context,
                },
            });

            const oreliMessage: GiftChatMessage = { role: 'oreli', text: response.message };
            setMessages([...updatedMessages, oreliMessage]);
            setSuggestions(response.suggestions);

            if (response.ready && response.products) {
                setIsReady(true);
                setProducts(response.products);
            }
        } catch {
            const errorMessage: GiftChatMessage = {
                role: 'oreli',
                text: "Désolée, je rencontre un problème. Réessaie dans un instant. 🙏",
            };
            setMessages([...updatedMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, context]);

    // Premier appel au démarrage (Oreli initie la conversation)
    const initChat = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest<GiftChatResponse>('/gift/chat', {
                method: 'POST',
                body: {
                    messages: [],
                    context,
                },
            });

            const oreliMessage: GiftChatMessage = { role: 'oreli', text: response.message };
            setMessages([oreliMessage]);
            setSuggestions(response.suggestions);
        } catch {
            const fallbackMessage: GiftChatMessage = {
                role: 'oreli',
                text: "Bonjour ! 🎁 Pour qui souhaites-tu offrir un cadeau ?",
            };
            setMessages([fallbackMessage]);
            setSuggestions(['Ma partenaire', 'Ma mère', 'Un ami', 'Quelqu\'un d\'autre']);
        } finally {
            setIsLoading(false);
        }
    }, [context]);

    const reset = useCallback(() => {
        setMessages([]);
        setSuggestions([]);
        setProducts(null);
        setIsReady(false);
    }, []);

    return {
        messages,
        suggestions,
        products,
        isLoading,
        isReady,
        sendMessage,
        initChat,
        reset,
    };
}
```

### Step 2 : Typecheck mobile

```bash
cd apps/mobile && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 3 : Commit

```bash
git add apps/mobile/hooks/useGiftChat.ts
git commit -m "feat(mobile): useGiftChat hook — branche gift-flow sur POST /gift/chat"
```

---

## Task 6 : Refactoriser `gift-flow.tsx`

**Files:**
- Modify: `apps/mobile/app/gift-flow.tsx`

### Step 1 : Lire le fichier complet avant de modifier

```bash
cat apps/mobile/app/gift-flow.tsx
```

### Step 2 : Remplacer la logique interne

Remplacer tout le contenu de `gift-flow.tsx` par :

```typescript
import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    LayoutAnimation,
    ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useThemeColors, ThemeColors } from '@/constants/Colors';
import { Typography, Spacing, Radius, Shadow } from '@/constants/Typography';
import { useGiftStore } from '@/store/giftStore';
import { formatPrice } from '@/hooks/useCatalog';
import { useGiftChat, type GiftChatMessage, type RecommendedProduct } from '@/hooks/useGiftChat';

// ─── Composants ────────────────────────────────────────────────────────────

function TypingIndicator({ Colors }: { Colors: ReturnType<typeof useThemeColors> }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>✦</Text>
            </View>
            <View style={{ backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2].map((i) => (
                    <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.muted }} />
                ))}
            </View>
        </View>
    );
}

function ProductCard({ product, Colors, styles }: { product: RecommendedProduct; Colors: ReturnType<typeof useThemeColors>; styles: ReturnType<typeof createStyles> }) {
    return (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.85}
            onPress={() => {
                useGiftStore.getState().updateGiftFlow({ selectedProductId: product.id });
                router.push(`/product/${product.id}` as never);
            }}
        >
            <View style={styles.productImageBox}>
                <Feather name="gift" size={28} color={Colors.cream} />
                <View style={styles.scoreBadge}>
                    <Text style={styles.scoreBadgeText}>✦ {Math.round(product.score * 100)}%</Text>
                </View>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                {product.justification && (
                    <Text style={styles.productJustification} numberOfLines={2}>"{product.justification}"</Text>
                )}
                <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>{formatPrice(product.priceAmount, product.currency)}</Text>
                    <Text style={styles.productSeller}>{product.seller.displayName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ─── Écran principal ───────────────────────────────────────────────────────

export default function GiftFlowScreen() {
    const Colors = useThemeColors();
    const styles = createStyles(Colors);
    const insets = useSafeAreaInsets();
    const { selectedPerson } = useGiftStore();
    const params = useLocalSearchParams<{
        relationshipId?: string;
        productId?: string;
        occasion?: string;
        suggestedDeliveryDate?: string;
    }>();

    // Contexte d'entrée : depuis params URL ou depuis le selectedPerson du store
    const context = {
        ...(params.relationshipId ? { relationshipId: params.relationshipId } : {}),
        ...(selectedPerson?.apiId && !params.relationshipId ? { relationshipId: selectedPerson.apiId } : {}),
        ...(params.productId ? { productId: params.productId } : {}),
        ...(params.occasion ? { occasion: params.occasion } : {}),
        ...(params.suggestedDeliveryDate ? { suggestedDeliveryDate: params.suggestedDeliveryDate } : {}),
    };

    const {
        messages,
        suggestions,
        products,
        isLoading,
        isReady,
        sendMessage,
        initChat,
    } = useGiftChat(context);

    const listRef = useRef<FlatList>(null);
    const [inputValue, setInputValue] = useState('');

    // Lancer Oreli au montage
    useEffect(() => {
        initChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll automatique vers le bas
    useEffect(() => {
        if (messages.length > 0) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
        }
    }, [messages, isLoading]);

    function handleSend(text: string) {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;
        setInputValue('');
        sendMessage(trimmed);
    }

    function renderMessage({ item }: { item: GiftChatMessage }) {
        const isOreli = item.role === 'oreli';
        return (
            <View style={[styles.messageRow, isOreli ? styles.messageRowOreli : styles.messageRowUser]}>
                {isOreli && (
                    <View style={styles.oreliAvatar}>
                        <Text style={styles.oreliAvatarText}>✦</Text>
                    </View>
                )}
                <View style={[styles.bubble, isOreli ? styles.bubbleOreli : styles.bubbleUser]}>
                    <Text style={[styles.bubbleText, isOreli ? styles.bubbleTextOreli : styles.bubbleTextUser]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    }

    // Données à afficher dans la FlatList
    type ListItem =
        | { type: 'message'; data: GiftChatMessage; key: string }
        | { type: 'suggestions'; key: string }
        | { type: 'products'; key: string }
        | { type: 'typing'; key: string };

    const listData: ListItem[] = [
        ...messages.map((m, i) => ({ type: 'message' as const, data: m, key: `msg-${i}` })),
        ...(isLoading ? [{ type: 'typing' as const, key: 'typing' }] : []),
        ...(suggestions.length > 0 && !isLoading ? [{ type: 'suggestions' as const, key: 'suggestions' }] : []),
        ...(isReady && products ? [{ type: 'products' as const, key: 'products' }] : []),
    ];

    function renderItem({ item }: { item: ListItem }) {
        if (item.type === 'message') return renderMessage({ item: item.data });
        if (item.type === 'typing') return <TypingIndicator Colors={Colors} />;
        if (item.type === 'suggestions') {
            return (
                <View style={styles.suggestions}>
                    {suggestions.map((s) => (
                        <TouchableOpacity
                            key={s}
                            style={styles.chip}
                            onPress={() => handleSend(s)}
                            activeOpacity={0.75}
                        >
                            <Text style={styles.chipText}>{s}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }
        if (item.type === 'products' && products) {
            return (
                <View style={{ paddingHorizontal: Spacing.xl, gap: Spacing.md }}>
                    {products.map((p) => (
                        <ProductCard key={p.id} product={p} Colors={Colors} styles={styles} />
                    ))}
                </View>
            );
        }
        return null;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={22} color={Colors.cream} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.headerAvatar}>
                        <Text style={styles.headerAvatarText}>✦</Text>
                    </View>
                    <Text style={styles.headerTitle}>Oreli</Text>
                </View>
                <View style={{ width: 38 }} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <FlatList
                    ref={listRef}
                    data={listData}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 120, gap: Spacing.sm }}
                    showsVerticalScrollIndicator={false}
                />

                {/* Input */}
                <View style={[styles.inputBar, { paddingBottom: insets.bottom + 12 }]}>
                    <TextInput
                        value={inputValue}
                        onChangeText={setInputValue}
                        onSubmitEditing={() => handleSend(inputValue)}
                        placeholder="Réponds à Oreli…"
                        placeholderTextColor={Colors.muted}
                        style={styles.input}
                        returnKeyType="send"
                        editable={!isLoading}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        onPress={() => handleSend(inputValue)}
                        disabled={!inputValue.trim() || isLoading}
                        style={[styles.sendBtn, (!inputValue.trim() || isLoading) && styles.sendBtnDisabled]}
                        activeOpacity={0.8}
                    >
                        {isLoading
                            ? <ActivityIndicator size="small" color={Colors.obsidian} />
                            : <Feather name="send" size={18} color={Colors.obsidian} />
                        }
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const createStyles = (Colors: ThemeColors) => StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.obsidian },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.warm },
    backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    headerAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    headerAvatarText: { fontSize: 14, color: Colors.obsidian },
    headerTitle: { fontSize: Typography.base, fontFamily: 'Inter-SemiBold', color: Colors.cream },
    messageRow: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end', gap: 8 },
    messageRowOreli: { justifyContent: 'flex-start' },
    messageRowUser: { justifyContent: 'flex-end' },
    oreliAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    oreliAvatarText: { fontSize: 12, color: Colors.obsidian },
    bubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: Radius.xl },
    bubbleOreli: { backgroundColor: Colors.charcoal, borderWidth: 1, borderColor: Colors.warm, borderBottomLeftRadius: 4 },
    bubbleUser: { backgroundColor: Colors.gold, borderBottomRightRadius: 4 },
    bubbleText: { fontSize: Typography.sm, lineHeight: Typography.sm * 1.5 },
    bubbleTextOreli: { color: Colors.cream, fontFamily: 'Inter-Regular' },
    bubbleTextUser: { color: Colors.obsidian, fontFamily: 'Inter-Medium' },
    suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingLeft: 36, marginTop: 4, marginBottom: 8 },
    chip: { backgroundColor: Colors.stone, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.warm, paddingHorizontal: 14, paddingVertical: 8 },
    chipText: { fontSize: Typography.sm, fontFamily: 'Inter-Medium', color: Colors.cream },
    productCard: { backgroundColor: Colors.charcoal, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.warm, padding: Spacing.md, flexDirection: 'row', gap: Spacing.md, ...Shadow.card },
    productImageBox: { width: 72, height: 72, borderRadius: Radius.lg, backgroundColor: Colors.stone, alignItems: 'center', justifyContent: 'center', position: 'relative' },
    scoreBadge: { position: 'absolute', bottom: -8, left: '50%', transform: [{ translateX: -20 }], backgroundColor: Colors.gold, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 2 },
    scoreBadgeText: { fontSize: 9, fontFamily: 'Inter-Bold', color: Colors.obsidian },
    productInfo: { flex: 1, gap: 4 },
    productTitle: { fontSize: Typography.sm, fontFamily: 'Inter-SemiBold', color: Colors.cream },
    productJustification: { fontSize: Typography.xs, fontFamily: 'Inter-Regular', color: Colors.muted, fontStyle: 'italic' },
    productMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    productPrice: { fontSize: Typography.sm, fontFamily: 'Inter-Bold', color: Colors.gold },
    productSeller: { fontSize: Typography.xs, fontFamily: 'Inter-Regular', color: Colors.muted },
    inputBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: Spacing.xl, paddingTop: 12, backgroundColor: Colors.obsidian, borderTopWidth: 1, borderTopColor: Colors.warm },
    input: { flex: 1, backgroundColor: Colors.charcoal, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.warm, paddingHorizontal: 16, paddingVertical: 12, fontSize: Typography.sm, fontFamily: 'Inter-Regular', color: Colors.cream },
    sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.gold, alignItems: 'center', justifyContent: 'center' },
    sendBtnDisabled: { opacity: 0.4 },
});
```

### Step 3 : Typecheck mobile

```bash
cd apps/mobile && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 4 : Commit

```bash
git add apps/mobile/app/gift-flow.tsx
git commit -m "feat(mobile): gift-flow refactorisé — Oreli pilotée par Gemini"
```

---

## Task 7 : Câbler les points d'entrée — Mobile

**Files:**
- Modify: `apps/mobile/app/(tabs)/close.tsx`
- Modify: `apps/mobile/app/product/[id].tsx`

### Step 1 : `close.tsx` — passer `relationshipId` en paramètre URL

Dans `close.tsx`, remplacer les deux `router.push('/gift-flow')` par :

```typescript
// Remplacer :
router.push('/gift-flow');

// Par (utiliser rel.id depuis useRelationships) :
router.push(`/gift-flow?relationshipId=${rel.id}` as never);
```

> **Note :** `close.tsx` doit utiliser `useRelationships()` pour accéder aux `rel.id` réels.
> Vérifier que `close.tsx` utilise bien `useRelationships()` et non des mock data.
> Si `close.tsx` utilise encore `closeOnes` de `mockData`, migrer vers `useRelationships()` d'abord.

### Step 2 : `product/[id].tsx` — bouton "Offrir ce cadeau"

Rechercher dans `apps/mobile/app/product/[id].tsx` le bouton qui navigue vers gift-flow et le mettre à jour :

```typescript
// Remplacer la navigation vers /gift-flow :
router.push('/gift-flow');
// Par :
router.push(`/gift-flow?productId=${product.id}` as never);
```

### Step 3 : Typecheck

```bash
cd apps/mobile && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 4 : Commit

```bash
git add apps/mobile/app/(tabs)/close.tsx apps/mobile/app/product/[id].tsx
git commit -m "feat(mobile): points d'entrée gift-flow avec contexte relationshipId/productId"
```

---

## Task 8 : Page `/gift` — Web

**Files:**
- Create: `apps/web/app/gift/page.tsx`
- Create: `apps/web/hooks/use-gift-chat.ts`
- Modify: `apps/web/app/page.tsx` (lien CTA)
- Modify: `apps/web/app/product/[id]/page.tsx` (bouton "Offrir")

### Step 1 : Hook web `use-gift-chat.ts`

Créer `apps/web/hooks/use-gift-chat.ts` :

```typescript
'use client';

import { useState, useCallback } from 'react';
import { apiRequest } from '@/lib/api';

export interface GiftChatMessage {
  role: 'user' | 'oreli';
  text: string;
}

export interface GiftChatContext {
  relationshipId?: string;
  productId?: string;
  occasion?: string;
  suggestedDeliveryDate?: string;
}

export interface ChatProduct {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  currency: string;
  coverImageUrl: string | null;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  category: { id: string; name: string; slug: string } | null;
  tags: { slug: string; label: string }[];
  seller: { id: string; displayName: string };
  score: number;
  justification?: string;
}

interface GiftChatApiResponse {
  message: string;
  suggestions: string[];
  intent: Record<string, unknown>;
  ready: boolean;
  products?: ChatProduct[];
}

export function useGiftChat(context: GiftChatContext = {}) {
  const [messages, setMessages] = useState<GiftChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [products, setProducts] = useState<ChatProduct[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const callApi = useCallback(async (msgs: GiftChatMessage[]) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<GiftChatApiResponse>('/gift/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: msgs, context }),
      });

      const oreliMessage: GiftChatMessage = { role: 'oreli', text: response.message };
      setMessages([...msgs, oreliMessage]);
      setSuggestions(response.suggestions);

      if (response.ready && response.products) {
        setIsReady(true);
        setProducts(response.products);
      }
    } catch {
      setMessages([...msgs, { role: 'oreli', text: 'Désolée, une erreur est survenue. Réessaie !' }]);
    } finally {
      setIsLoading(false);
    }
  }, [context]);

  const initChat = useCallback(() => callApi([]), [callApi]);

  const sendMessage = useCallback((text: string) => {
    const userMessage: GiftChatMessage = { role: 'user', text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setSuggestions([]);
    callApi(updated);
  }, [messages, callApi]);

  return { messages, suggestions, products, isLoading, isReady, initChat, sendMessage };
}
```

### Step 2 : Page `/gift`

Créer `apps/web/app/gift/page.tsx` :

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useGiftChat } from '@/hooks/use-gift-chat';
import { formatPrice } from '@/hooks/use-catalog';
import Link from 'next/link';

function GiftChatInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const context = {
    ...(searchParams.get('relationshipId') ? { relationshipId: searchParams.get('relationshipId')! } : {}),
    ...(searchParams.get('productId') ? { productId: searchParams.get('productId')! } : {}),
    ...(searchParams.get('occasion') ? { occasion: searchParams.get('occasion')! } : {}),
  };

  const { messages, suggestions, products, isLoading, isReady, initChat, sendMessage } = useGiftChat(context);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { initChat(); }, []); // eslint-disable-line
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    sendMessage(trimmed);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-obsidian font-bold text-sm">✦</div>
        <h1 className="text-lg font-semibold text-cream">Oreli</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col gap-3 mb-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 items-end ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'oreli' && (
              <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-obsidian text-xs flex-shrink-0">✦</div>
            )}
            <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
              m.role === 'oreli'
                ? 'bg-charcoal border border-warm text-cream rounded-bl-sm'
                : 'bg-gold text-obsidian font-medium rounded-br-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex gap-2 items-end">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-obsidian text-xs">✦</div>
            <div className="bg-charcoal border border-warm rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions (chips) */}
        {suggestions.length > 0 && !isLoading && (
          <div className="flex flex-wrap gap-2 pl-9">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => handleSend(s)}
                className="bg-stone border border-warm rounded-full px-4 py-2 text-sm text-cream hover:border-gold transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Produits recommandés */}
        {isReady && products && (
          <div className="flex flex-col gap-3 mt-2">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-charcoal border border-warm rounded-2xl p-4 flex gap-4 hover:border-gold transition-colors group"
              >
                <div className="w-16 h-16 rounded-xl bg-stone flex items-center justify-center flex-shrink-0 relative">
                  <span className="text-2xl">🎁</span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold rounded-full px-1.5 py-0.5 text-[9px] font-bold text-obsidian whitespace-nowrap">
                    ✦ {Math.round(p.score * 100)}%
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-cream font-medium text-sm truncate group-hover:text-gold transition-colors">{p.title}</p>
                  {p.justification && (
                    <p className="text-muted text-xs italic mt-0.5">"{p.justification}"</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gold font-bold text-sm">{formatPrice(p.priceAmount, p.currency)}</span>
                    <span className="text-muted text-xs">{p.seller.displayName}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-obsidian border-t border-warm pt-4 pb-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(input); }}
            placeholder="Réponds à Oreli…"
            disabled={isLoading}
            className="flex-1 bg-charcoal border border-warm rounded-full px-4 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-gold transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-full bg-gold flex items-center justify-center disabled:opacity-40 hover:bg-gold/90 transition-colors"
          >
            <span className="text-obsidian text-sm">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GiftPage() {
  return (
    <Suspense>
      <GiftChatInner />
    </Suspense>
  );
}
```

### Step 3 : Typecheck web

```bash
cd apps/web && npx tsc --noEmit 2>&1
```

Expected : 0 erreurs.

### Step 4 : Commit

```bash
git add apps/web/app/gift/ apps/web/hooks/use-gift-chat.ts
git commit -m "feat(web): page /gift — conversation Oreli sur desktop"
```

---

## Task 9 : Vérification finale

### Step 1 : Typecheck de toutes les surfaces

```bash
cd apps/api && npx tsc --noEmit && echo "api OK" && \
cd ../mobile && npx tsc --noEmit && echo "mobile OK" && \
cd ../web && npx tsc --noEmit && echo "web OK"
```

Expected : `api OK`, `mobile OK`, `web OK`

### Step 2 : Tests API

```bash
cd apps/api && npx vitest run src/services/gift/chat.service.test.ts
```

Expected : 4 tests PASS.

### Step 3 : Commit final

```bash
git add -A
git commit -m "feat: Oreli Chat IA — Gemini pilote la conversation gifting (V1)"
```

---

## Résumé des fichiers créés/modifiés

| Action | Fichier |
|--------|---------|
| Créé | `apps/api/src/services/gift/chat.service.ts` |
| Créé | `apps/api/src/services/gift/chat.service.test.ts` |
| Créé | `apps/api/src/seed.ts` |
| Modifié | `apps/api/src/routes/gift.router.ts` |
| Modifié | `apps/api/package.json` |
| Créé | `apps/mobile/hooks/useGiftChat.ts` |
| Modifié | `apps/mobile/app/gift-flow.tsx` |
| Modifié | `apps/mobile/app/(tabs)/close.tsx` |
| Modifié | `apps/mobile/app/product/[id].tsx` |
| Créé | `apps/web/hooks/use-gift-chat.ts` |
| Créé | `apps/web/app/gift/page.tsx` |

## Variable d'environnement nécessaire avant exécution

```bash
# Dans apps/api/.env
GEMINI_API_KEY=AIza...   # Obtenir sur aistudio.google.com — free tier suffisant
```
