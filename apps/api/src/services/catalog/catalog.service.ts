import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../lib/errors.js';
import {
  parsePaginationInput,
  buildCursorPage,
  type CursorInput,
  type CursorPage,
} from '../../lib/pagination.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ProductListFilters extends CursorInput {
  categoryId?: string | undefined;
  minPriceAmount?: number | undefined;
  maxPriceAmount?: number | undefined;
  isSurpriseReady?: boolean | undefined;
  isLastMinuteOk?: boolean | undefined;
  tagSlugs?: string[] | undefined;
}

export interface ProductSummary {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  currency: string;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  category: { id: string; name: string; slug: string } | null;
  tags: { slug: string; label: string }[];
  coverImageUrl: string | null;
  seller: { id: string; displayName: string };
  createdAt: Date;
}

export interface ProductDetail extends ProductSummary {
  images: { id: string; url: string; position: number }[];
  stockQuantity: number;
  preparationTimeMin: number | null;
  seller: { id: string; displayName: string; reliabilityScore: number };
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export async function listPublicProducts(
  filters: ProductListFilters,
): Promise<CursorPage<ProductSummary>> {
  const { decodedCursor, pageSize } = parsePaginationInput(filters);

  const tagFilter =
    filters.tagSlugs && filters.tagSlugs.length > 0
      ? { tags: { some: { tag: { slug: { in: filters.tagSlugs } } } } }
      : {};

  // Cursor-based : on récupère les produits créés avant le curseur (ou à même date, id inférieur)
  const cursorFilter = decodedCursor
    ? {
        OR: [
          { createdAt: { lt: decodedCursor.createdAt } },
          { createdAt: decodedCursor.createdAt, id: { lt: decodedCursor.id } },
        ],
      }
    : {};

  const priceFilter = {
    ...(filters.minPriceAmount !== undefined && {
      priceAmount: { gte: filters.minPriceAmount },
    }),
    ...(filters.maxPriceAmount !== undefined && {
      priceAmount: { lte: filters.maxPriceAmount },
    }),
  };

  const rawProducts = await prisma.product.findMany({
    where: {
      status: 'active',
      seller: { status: 'active' },
      ...(filters.categoryId !== undefined && { categoryId: filters.categoryId }),
      ...(filters.isSurpriseReady !== undefined && { isSurpriseReady: filters.isSurpriseReady }),
      ...(filters.isLastMinuteOk !== undefined && { isLastMinuteOk: filters.isLastMinuteOk }),
      ...priceFilter,
      ...tagFilter,
      ...cursorFilter,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    // +1 pour détecter s'il existe une page suivante sans COUNT(*)
    take: pageSize + 1,
    include: {
      category: true,
      tags: { include: { tag: true } },
      // Uniquement l'image de couverture (position 0) pour la liste
      assets: { orderBy: { position: 'asc' }, take: 1 },
      seller: { select: { id: true, displayName: true } },
    },
  });

  const summaries = rawProducts.map(toProductSummary);
  return buildCursorPage(summaries, pageSize);
}

export async function getPublicProduct(productId: string): Promise<ProductDetail> {
  const rawProduct = await prisma.product.findFirst({
    where: { id: productId, status: 'active', seller: { status: 'active' } },
    include: {
      category: true,
      tags: { include: { tag: true } },
      assets: { orderBy: { position: 'asc' } },
      inventory: true,
      seller: { select: { id: true, displayName: true, reliabilityScore: true } },
    },
  });

  if (!rawProduct) {
    throw new NotFoundError('Produit');
  }

  return toProductDetail(rawProduct);
}

export async function listCategories(): Promise<CategorySummary[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  });
}

// ─── Helpers privés ───────────────────────────────────────────────────────

// Le paramètre est typé via `ReturnType` pour rester cohérent avec Prisma
// sans dupliquer les types générés.
type RawSummary = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  category: { id: string; name: string; slug: string } | null;
  tags: { tag: { slug: string; label: string } }[];
  assets: { url: string }[];
  seller: { id: string; displayName: string };
};

type RawDetail = Omit<RawSummary, 'assets'> & {
  assets: { id: string; url: string; position: number }[];
  inventory: { stockQuantity: number } | null;
  seller: { id: string; displayName: string; reliabilityScore: number };
};

function toProductSummary(raw: RawSummary): ProductSummary {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    priceAmount: raw.priceAmount,
    currency: raw.currency,
    isSurpriseReady: raw.isSurpriseReady,
    isLastMinuteOk: raw.isLastMinuteOk,
    category: raw.category ?? null,
    tags: raw.tags.map((productTag) => ({
      slug: productTag.tag.slug,
      label: productTag.tag.label,
    })),
    coverImageUrl: raw.assets[0]?.url ?? null,
    seller: raw.seller,
    createdAt: raw.createdAt,
  };
}

function toProductDetail(raw: RawDetail): ProductDetail {
  return {
    ...toProductSummary(raw),
    images: raw.assets.map((asset) => ({
      id: asset.id,
      url: asset.url,
      position: asset.position,
    })),
    stockQuantity: raw.inventory?.stockQuantity ?? 0,
    preparationTimeMin: raw.preparationTimeMin ?? null,
    seller: raw.seller,
  };
}
