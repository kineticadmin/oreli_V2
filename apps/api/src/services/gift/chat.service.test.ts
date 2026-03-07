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

  const mockRelationshipBase = {
    id: '00000000-0000-0000-0000-000000000002',
    userId: mockUserId,
    displayName: 'Sophie',
    relationshipType: 'partner' as const,
    birthdate: null,
    preferences: { likes: ['chocolat', 'yoga'], dislikes: ['parfum'] },
    affinityScore: 0.9,
    createdAt: new Date(),
    events: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Fournir une clé factice pour que callGemini() dépasse le guard GEMINI_API_KEY
    // et atteigne le mock GoogleGenerativeAI au lieu du fallback immédiat
    process.env['GEMINI_API_KEY'] = 'test-key-fake';
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
    vi.mocked(prisma.relationship.findMany).mockResolvedValue([mockRelationshipBase] as never);

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
    const callArg = mockGenerate.mock.calls[0]![0] as string;
    expect(callArg).toContain('chocolat');
    expect(callArg).toContain('Sophie');
  });
});
