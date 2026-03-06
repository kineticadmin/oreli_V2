import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError } from '../../lib/errors.js';

// Mock Prisma avant tout import du service
vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    category: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../../lib/prisma.js';
import {
  listPublicProducts,
  getPublicProduct,
  listCategories,
} from './catalog.service.js';

const mockPrisma = prisma as unknown as {
  product: { findMany: ReturnType<typeof vi.fn>; findFirst: ReturnType<typeof vi.fn> };
  category: { findMany: ReturnType<typeof vi.fn> };
};

// ─── Fixtures ─────────────────────────────────────────────────────────────

const baseProduct = {
  id: 'prod-001',
  title: 'Bouquet premium',
  description: 'Un magnifique bouquet',
  priceAmount: 5500,
  currency: 'EUR',
  isSurpriseReady: true,
  isLastMinuteOk: false,
  preparationTimeMin: null,
  status: 'active',
  sellerId: 'seller-001',
  categoryId: 'cat-001',
  category: { id: 'cat-001', name: 'Fleurs', slug: 'fleurs' },
  tags: [{ tag: { slug: 'romantique', label: 'Romantique' } }],
  assets: [{ id: 'asset-001', url: 'https://cdn.oreli.be/p1.jpg', position: 0 }],
  seller: { id: 'seller-001', displayName: 'Fleuriste Bruxelles', reliabilityScore: 0.95 },
  inventory: { stockQuantity: 10 },
  createdAt: new Date('2026-01-15T10:00:00Z'),
  updatedAt: new Date('2026-01-15T10:00:00Z'),
};

// ─── listPublicProducts ────────────────────────────────────────────────────

describe('listPublicProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retourne une page de produits avec hasMore=false quand résultats < pageSize', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseProduct]);

    const result = await listPublicProducts({ limit: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.hasMore).toBe(false);
    expect(result.nextCursor).toBeNull();
  });

  it('retourne hasMore=true et nextCursor quand résultats = pageSize + 1', async () => {
    const products = Array.from({ length: 21 }, (_, index) => ({
      ...baseProduct,
      id: `prod-${String(index).padStart(3, '0')}`,
    }));
    mockPrisma.product.findMany.mockResolvedValue(products);

    const result = await listPublicProducts({ limit: 20 });

    expect(result.items).toHaveLength(20);
    expect(result.hasMore).toBe(true);
    expect(result.nextCursor).not.toBeNull();
  });

  it('mappe correctement les champs du résumé produit', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseProduct]);

    const result = await listPublicProducts({});

    const product = result.items[0];
    expect(product?.id).toBe('prod-001');
    expect(product?.priceAmount).toBe(5500);
    expect(product?.coverImageUrl).toBe('https://cdn.oreli.be/p1.jpg');
    expect(product?.tags).toEqual([{ slug: 'romantique', label: 'Romantique' }]);
    expect(product?.seller.displayName).toBe('Fleuriste Bruxelles');
  });

  it('retourne coverImageUrl=null quand aucune image', async () => {
    mockPrisma.product.findMany.mockResolvedValue([{ ...baseProduct, assets: [] }]);

    const result = await listPublicProducts({});

    expect(result.items[0]?.coverImageUrl).toBeNull();
  });

  it('applique la limite de page par défaut (20)', async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    await listPublicProducts({});

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 21 }), // 20 + 1
    );
  });

  it('plafonne la limite à 100', async () => {
    mockPrisma.product.findMany.mockResolvedValue([]);

    await listPublicProducts({ limit: 500 });

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 101 }), // 100 + 1
    );
  });
});

// ─── getPublicProduct ──────────────────────────────────────────────────────

describe('getPublicProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retourne le détail d\'un produit existant', async () => {
    mockPrisma.product.findFirst.mockResolvedValue(baseProduct);

    const result = await getPublicProduct('prod-001');

    expect(result.id).toBe('prod-001');
    expect(result.stockQuantity).toBe(10);
    expect(result.images).toHaveLength(1);
    expect(result.images[0]?.url).toBe('https://cdn.oreli.be/p1.jpg');
  });

  it('lance NotFoundError quand le produit n\'existe pas', async () => {
    mockPrisma.product.findFirst.mockResolvedValue(null);

    await expect(getPublicProduct('prod-inconnu')).rejects.toThrow(NotFoundError);
  });

  it('retourne stockQuantity=0 quand pas d\'inventory', async () => {
    mockPrisma.product.findFirst.mockResolvedValue({ ...baseProduct, inventory: null });

    const result = await getPublicProduct('prod-001');

    expect(result.stockQuantity).toBe(0);
  });
});

// ─── listCategories ────────────────────────────────────────────────────────

describe('listCategories', () => {
  it('retourne la liste des catégories', async () => {
    mockPrisma.category.findMany.mockResolvedValue([
      { id: 'cat-001', name: 'Fleurs', slug: 'fleurs' },
      { id: 'cat-002', name: 'Gastronomie', slug: 'gastronomie' },
    ]);

    const result = await listCategories();

    expect(result).toHaveLength(2);
    expect(result[0]?.slug).toBe('fleurs');
  });
});
