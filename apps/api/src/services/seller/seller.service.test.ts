import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError, ConflictError, ForbiddenError } from '../../lib/errors.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    seller: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    sellerUser: {
      findFirst: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    tag: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '../../lib/prisma.js';
import {
  onboardSeller,
  getSellerProfile,
  listSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  archiveSellerProduct,
} from './seller.service.js';

const mockPrisma = prisma as unknown as {
  seller: { create: ReturnType<typeof vi.fn>; findUnique: ReturnType<typeof vi.fn> };
  sellerUser: { findFirst: ReturnType<typeof vi.fn> };
  product: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  tag: { findMany: ReturnType<typeof vi.fn> };
};

// ─── Fixtures ─────────────────────────────────────────────────────────────

const baseSeller = {
  id: 'seller-001',
  displayName: 'Fleuriste Bruxelles',
  legalName: 'Fleurs SPRL',
  vatNumber: 'BE0123456789',
  status: 'pending',
  kybStatus: 'pending',
  reliabilityScore: 1.0,
  policy: {
    slaPrepHours: 4,
    slaDeliveryHours: 24,
    cutoffTimeLocal: '17:00',
  },
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

const baseProduct = {
  id: 'prod-001',
  title: 'Bouquet premium',
  description: 'Un magnifique bouquet',
  priceAmount: 5500,
  currency: 'EUR',
  status: 'draft',
  isSurpriseReady: false,
  isLastMinuteOk: false,
  preparationTimeMin: null,
  sellerId: 'seller-001',
  categoryId: null,
  category: null,
  tags: [],
  assets: [],
  inventory: { stockQuantity: 0 },
  createdAt: new Date('2026-01-15T10:00:00Z'),
  updatedAt: new Date('2026-01-15T10:00:00Z'),
};

// ─── onboardSeller ─────────────────────────────────────────────────────────

describe('onboardSeller', () => {
  beforeEach(() => vi.clearAllMocks());

  it('crée un vendeur et retourne son profil', async () => {
    mockPrisma.sellerUser.findFirst.mockResolvedValue(null);
    mockPrisma.seller.create.mockResolvedValue(baseSeller);

    const result = await onboardSeller('user-001', { displayName: 'Fleuriste Bruxelles' });

    expect(result.id).toBe('seller-001');
    expect(result.policy?.slaPrepHours).toBe(4);
  });

  it('lance ConflictError si l\'utilisateur est déjà vendeur', async () => {
    mockPrisma.sellerUser.findFirst.mockResolvedValue({ sellerId: 'seller-001', userId: 'user-001', role: 'owner' });

    await expect(
      onboardSeller('user-001', { displayName: 'Nouvelle boutique' }),
    ).rejects.toThrow(ConflictError);
  });
});

// ─── getSellerProfile ──────────────────────────────────────────────────────

describe('getSellerProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne le profil d\'un vendeur existant', async () => {
    mockPrisma.seller.findUnique.mockResolvedValue(baseSeller);

    const result = await getSellerProfile('seller-001');

    expect(result.displayName).toBe('Fleuriste Bruxelles');
    expect(result.kybStatus).toBe('pending');
  });

  it('lance NotFoundError si le vendeur n\'existe pas', async () => {
    mockPrisma.seller.findUnique.mockResolvedValue(null);

    await expect(getSellerProfile('seller-inconnu')).rejects.toThrow(NotFoundError);
  });
});

// ─── listSellerProducts ────────────────────────────────────────────────────

describe('listSellerProducts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne les produits du vendeur', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseProduct]);

    const result = await listSellerProducts('seller-001', {});

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.title).toBe('Bouquet premium');
  });
});

// ─── createSellerProduct ───────────────────────────────────────────────────

describe('createSellerProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('crée un produit et retourne son résumé', async () => {
    mockPrisma.tag.findMany.mockResolvedValue([]);
    mockPrisma.product.create.mockResolvedValue(baseProduct);

    const result = await createSellerProduct('seller-001', {
      title: 'Bouquet premium',
      description: 'Un magnifique bouquet',
      priceAmount: 5500,
    });

    expect(result.title).toBe('Bouquet premium');
    expect(result.priceAmount).toBe(5500);
  });

  it('résout les tags depuis leur slug avant création', async () => {
    mockPrisma.tag.findMany.mockResolvedValue([
      { id: 'tag-001', slug: 'romantique' },
    ]);
    mockPrisma.product.create.mockResolvedValue(baseProduct);

    await createSellerProduct('seller-001', {
      title: 'Bouquet',
      description: 'Test',
      priceAmount: 3000,
      tagSlugs: ['romantique'],
    });

    expect(mockPrisma.tag.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { slug: { in: ['romantique'] } },
      }),
    );
  });
});

// ─── updateSellerProduct ───────────────────────────────────────────────────

describe('updateSellerProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('met à jour un produit appartenant au vendeur', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(baseProduct);
    mockPrisma.product.update.mockResolvedValue({ ...baseProduct, priceAmount: 6000 });

    const result = await updateSellerProduct('seller-001', 'prod-001', { priceAmount: 6000 });

    expect(result.priceAmount).toBe(6000);
  });

  it('lance ForbiddenError si le produit appartient à un autre vendeur', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ ...baseProduct, sellerId: 'autre-seller' });

    await expect(
      updateSellerProduct('seller-001', 'prod-001', { title: 'Hack' }),
    ).rejects.toThrow(ForbiddenError);
  });

  it('lance NotFoundError si le produit n\'existe pas', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);

    await expect(
      updateSellerProduct('seller-001', 'prod-inconnu', { title: 'Test' }),
    ).rejects.toThrow(NotFoundError);
  });
});

// ─── archiveSellerProduct ──────────────────────────────────────────────────

describe('archiveSellerProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('archive un produit appartenant au vendeur', async () => {
    mockPrisma.product.findUnique.mockResolvedValue(baseProduct);
    mockPrisma.product.update.mockResolvedValue({ ...baseProduct, status: 'archived' });

    await expect(archiveSellerProduct('seller-001', 'prod-001')).resolves.toBeUndefined();

    expect(mockPrisma.product.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'archived' } }),
    );
  });

  it('lance ForbiddenError si le produit appartient à un autre vendeur', async () => {
    mockPrisma.product.findUnique.mockResolvedValue({ ...baseProduct, sellerId: 'autre-seller' });

    await expect(archiveSellerProduct('seller-001', 'prod-001')).rejects.toThrow(ForbiddenError);
  });
});
