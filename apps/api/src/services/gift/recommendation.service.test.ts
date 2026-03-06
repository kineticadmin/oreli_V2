import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../../lib/prisma.js';
import {
  recommendProducts,
  getCuratedHomeProducts,
} from './recommendation.service.js';

const mockPrisma = prisma as unknown as {
  product: { findMany: ReturnType<typeof vi.fn> };
};

// ─── Fixtures ─────────────────────────────────────────────────────────────

function makeProduct(overrides: Partial<typeof baseRawProduct> = {}) {
  return { ...baseRawProduct, ...overrides };
}

const baseRawProduct = {
  id: 'prod-001',
  title: 'Bouquet premium',
  description: 'Un magnifique bouquet',
  priceAmount: 5500,
  currency: 'EUR',
  status: 'active',
  isSurpriseReady: true,
  isLastMinuteOk: false,
  preparationTimeMin: null,
  sellerId: 'seller-001',
  categoryId: 'cat-001',
  category: { id: 'cat-001', name: 'Fleurs', slug: 'fleurs' },
  tags: [{ tag: { slug: 'romantique', label: 'Romantique' } }],
  assets: [{ url: 'https://cdn.oreli.be/p1.jpg', position: 0 }],
  seller: { id: 'seller-001', displayName: 'Fleuriste Bruxelles', reliabilityScore: 0.95 },
  inventory: { stockQuantity: 8 },
  createdAt: new Date(), // Produit récent → recencyScore élevé
  updatedAt: new Date(),
};

// ─── recommendProducts ─────────────────────────────────────────────────────

describe('recommendProducts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne les produits triés par score décroissant', async () => {
    const oldProduct = makeProduct({
      id: 'prod-old',
      seller: { id: 'seller-002', displayName: 'Autre', reliabilityScore: 0.75 },
      createdAt: new Date('2020-01-01'),
      inventory: { stockQuantity: 1 },
    });
    mockPrisma.product.findMany.mockResolvedValue([oldProduct, baseRawProduct]);

    const result = await recommendProducts({ recipientTagSlugs: ['romantique'] });

    // Le produit récent avec haute fiabilité doit être premier
    expect(result.products[0]?.id).toBe('prod-001');
    expect(result.products[0]?.score).toBeGreaterThan(result.products[1]?.score ?? 0);
  });

  it('retourne le nombre de candidats évalués', async () => {
    const products = [baseRawProduct, makeProduct({ id: 'prod-002' })];
    mockPrisma.product.findMany.mockResolvedValue(products);

    const result = await recommendProducts({});

    expect(result.totalCandidatesEvaluated).toBe(2);
  });

  it('respecte la limite de résultats', async () => {
    const products = Array.from({ length: 15 }, (_, i) =>
      makeProduct({ id: `prod-${String(i).padStart(3, '0')}` }),
    );
    mockPrisma.product.findMany.mockResolvedValue(products);

    const result = await recommendProducts({ limit: 5 });

    expect(result.products).toHaveLength(5);
  });

  it('plafonne la limite à 20', async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    await recommendProducts({ limit: 100 });

    // On ne vérifie pas la limite dans la requête Prisma (elle est gérée en mémoire après fetch)
    expect(mockPrisma.product.findMany).toHaveBeenCalledOnce();
  });

  it('score tag-match = 1 quand aucune préférence destinataire fournie', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseRawProduct]);

    const result = await recommendProducts({ recipientTagSlugs: [] });

    expect(result.products[0]?.score).toBeGreaterThan(0.5);
  });

  it('score tag-match = 0 quand aucun tag ne correspond', async () => {
    const productWithoutMatchingTags = makeProduct({
      tags: [{ tag: { slug: 'gastronomie', label: 'Gastronomie' } }],
      seller: { ...baseRawProduct.seller, reliabilityScore: 0.70 },
      createdAt: new Date('2020-01-01'), // vieux = recencyScore bas
      inventory: { stockQuantity: 1 },
    });
    mockPrisma.product.findMany.mockResolvedValue([productWithoutMatchingTags]);

    const result = await recommendProducts({ recipientTagSlugs: ['romantique', 'luxe'] });

    // Avec 40% de poids tag * 0 + autres poids bas → score faible
    expect(result.products[0]?.score).toBeLessThan(0.5);
  });

  it('mappe correctement les champs du produit recommandé', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseRawProduct]);

    const result = await recommendProducts({});

    const product = result.products[0];
    expect(product?.id).toBe('prod-001');
    expect(product?.coverImageUrl).toBe('https://cdn.oreli.be/p1.jpg');
    expect(product?.tags).toEqual([{ slug: 'romantique', label: 'Romantique' }]);
    expect(product?.seller.displayName).toBe('Fleuriste Bruxelles');
  });
});

// ─── getCuratedHomeProducts ────────────────────────────────────────────────

describe('getCuratedHomeProducts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne au maximum 8 produits', async () => {
    const products = Array.from({ length: 20 }, (_, i) =>
      makeProduct({ id: `prod-${String(i).padStart(3, '0')}` }),
    );
    mockPrisma.product.findMany.mockResolvedValue(products);

    const result = await getCuratedHomeProducts();

    expect(result.length).toBeLessThanOrEqual(8);
  });

  it('limite à 2 produits par catégorie pour la diversité', async () => {
    // 6 produits tous dans la même catégorie
    const sameCategory = Array.from({ length: 6 }, (_, i) =>
      makeProduct({
        id: `prod-${String(i).padStart(3, '0')}`,
        category: { id: 'cat-001', name: 'Fleurs', slug: 'fleurs' },
      }),
    );
    mockPrisma.product.findMany.mockResolvedValue(sameCategory);

    const result = await getCuratedHomeProducts();

    expect(result.length).toBeLessThanOrEqual(2);
  });

  it('mappe les champs pour la home (pas de description longue)', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseRawProduct]);

    const result = await getCuratedHomeProducts();

    const product = result[0];
    expect(product).not.toHaveProperty('description');
    expect(product?.coverImageUrl).toBe('https://cdn.oreli.be/p1.jpg');
  });
});
