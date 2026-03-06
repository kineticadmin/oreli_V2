import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors.js';
import {
  parsePaginationInput,
  buildCursorPage,
  type CursorInput,
  type CursorPage,
} from '../../lib/pagination.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface OnboardSellerInput {
  displayName: string;
  legalName?: string | undefined;
  vatNumber?: string | undefined;
}

export interface SellerProfile {
  id: string;
  displayName: string;
  legalName: string | null;
  vatNumber: string | null;
  status: string;
  kybStatus: string;
  reliabilityScore: number;
  policy: {
    slaPrepHours: number;
    slaDeliveryHours: number;
    cutoffTimeLocal: string;
  } | null;
  createdAt: Date;
}

export interface CreateProductInput {
  title: string;
  description: string;
  priceAmount: number;
  categoryId?: string | undefined;
  isSurpriseReady?: boolean | undefined;
  isLastMinuteOk?: boolean | undefined;
  preparationTimeMin?: number | undefined;
  tagSlugs?: string[] | undefined;
}

// Tous les champs sont optionnels pour le PATCH.
// Les champs sont explicitement `| undefined` pour satisfaire exactOptionalPropertyTypes.
export interface UpdateProductInput {
  title?: string | undefined;
  description?: string | undefined;
  priceAmount?: number | undefined;
  categoryId?: string | undefined;
  isSurpriseReady?: boolean | undefined;
  isLastMinuteOk?: boolean | undefined;
  preparationTimeMin?: number | undefined;
  tagSlugs?: string[] | undefined;
}

export interface SellerProductSummary {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  currency: string;
  status: string;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  preparationTimeMin: number | null;
  category: { id: string; name: string; slug: string } | null;
  tags: { slug: string; label: string }[];
  coverImageUrl: string | null;
  stockQuantity: number;
  createdAt: Date;
}

export interface SellerProductsFilters extends CursorInput {
  status?: string | undefined;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export async function onboardSeller(
  userId: string,
  input: OnboardSellerInput,
): Promise<SellerProfile> {
  const existingMembership = await prisma.sellerUser.findFirst({
    where: { userId },
  });

  if (existingMembership) {
    throw new ConflictError('Cet utilisateur est déjà membre d\'une boutique vendeur');
  }

  const newSeller = await prisma.seller.create({
    data: {
      displayName: input.displayName,
      ...(input.legalName !== undefined && { legalName: input.legalName }),
      ...(input.vatNumber !== undefined && { vatNumber: input.vatNumber }),
      users: {
        create: { userId, role: 'owner' },
      },
      policy: {
        create: {}, // Valeurs par défaut : slaPrepHours=4, slaDeliveryHours=24, cutoff=17:00
      },
    },
    include: {
      policy: true,
    },
  });

  return toSellerProfile(newSeller);
}

export async function getSellerProfile(sellerId: string): Promise<SellerProfile> {
  const seller = await prisma.seller.findUnique({
    where: { id: sellerId },
    include: { policy: true },
  });

  if (!seller) {
    throw new NotFoundError('Vendeur');
  }

  return toSellerProfile(seller);
}

export async function listSellerProducts(
  sellerId: string,
  filters: SellerProductsFilters,
): Promise<CursorPage<SellerProductSummary>> {
  const { decodedCursor, pageSize } = parsePaginationInput(filters);

  const cursorFilter = decodedCursor
    ? {
        OR: [
          { createdAt: { lt: decodedCursor.createdAt } },
          { createdAt: decodedCursor.createdAt, id: { lt: decodedCursor.id } },
        ],
      }
    : {};

  const rawProducts = await prisma.product.findMany({
    where: {
      sellerId,
      // Si pas de filtre status, on exclut uniquement archived
      ...(filters.status !== undefined
        ? { status: filters.status as never }
        : { status: { not: 'archived' } }),
      ...cursorFilter,
    },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take: pageSize + 1,
    include: {
      category: true,
      tags: { include: { tag: true } },
      assets: { orderBy: { position: 'asc' }, take: 1 },
      inventory: true,
    },
  });

  const summaries = rawProducts.map(toSellerProductSummary);
  return buildCursorPage(summaries, pageSize);
}

export async function createSellerProduct(
  sellerId: string,
  input: CreateProductInput,
): Promise<SellerProductSummary> {
  const tagConnections =
    input.tagSlugs && input.tagSlugs.length > 0
      ? await resolveTagConnections(input.tagSlugs)
      : [];

  const newProduct = await prisma.product.create({
    data: {
      sellerId,
      title: input.title,
      description: input.description,
      priceAmount: input.priceAmount,
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      isSurpriseReady: input.isSurpriseReady ?? false,
      isLastMinuteOk: input.isLastMinuteOk ?? false,
      ...(input.preparationTimeMin !== undefined && {
        preparationTimeMin: input.preparationTimeMin,
      }),
      tags: { create: tagConnections },
      inventory: { create: { stockQuantity: 0 } },
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
      assets: { orderBy: { position: 'asc' }, take: 1 },
      inventory: true,
    },
  });

  return toSellerProductSummary(newProduct);
}

export async function updateSellerProduct(
  sellerId: string,
  productId: string,
  input: UpdateProductInput,
): Promise<SellerProductSummary> {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new NotFoundError('Produit');
  }

  if (existingProduct.sellerId !== sellerId) {
    throw new ForbiddenError('Ce produit n\'appartient pas à cette boutique');
  }

  const tagOperations =
    input.tagSlugs !== undefined
      ? {
          tags: {
            deleteMany: {},
            create: await resolveTagConnections(input.tagSlugs),
          },
        }
      : {};

  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.priceAmount !== undefined && { priceAmount: input.priceAmount }),
      ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
      ...(input.isSurpriseReady !== undefined && { isSurpriseReady: input.isSurpriseReady }),
      ...(input.isLastMinuteOk !== undefined && { isLastMinuteOk: input.isLastMinuteOk }),
      ...(input.preparationTimeMin !== undefined && {
        preparationTimeMin: input.preparationTimeMin,
      }),
      ...tagOperations,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
      assets: { orderBy: { position: 'asc' }, take: 1 },
      inventory: true,
    },
  });

  return toSellerProductSummary(updatedProduct);
}

export async function archiveSellerProduct(
  sellerId: string,
  productId: string,
): Promise<void> {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new NotFoundError('Produit');
  }

  if (existingProduct.sellerId !== sellerId) {
    throw new ForbiddenError('Ce produit n\'appartient pas à cette boutique');
  }

  await prisma.product.update({
    where: { id: productId },
    data: { status: 'archived' },
  });
}

// ─── Helpers privés ───────────────────────────────────────────────────────

type RawSellerWithPolicy = Awaited<ReturnType<typeof prisma.seller.findUnique>> & {
  policy: {
    slaPrepHours: number;
    slaDeliveryHours: number;
    cutoffTimeLocal: string;
  } | null;
};

type RawSellerProduct = Awaited<ReturnType<typeof prisma.product.findMany>>[number] & {
  category: { id: string; name: string; slug: string } | null;
  tags: { tag: { slug: string; label: string } }[];
  assets: { url: string }[];
  inventory: { stockQuantity: number } | null;
};

function toSellerProfile(raw: RawSellerWithPolicy): SellerProfile {
  if (!raw) throw new NotFoundError('Vendeur');

  return {
    id: raw.id,
    displayName: raw.displayName,
    legalName: raw.legalName ?? null,
    vatNumber: raw.vatNumber ?? null,
    status: raw.status,
    kybStatus: raw.kybStatus,
    reliabilityScore: raw.reliabilityScore,
    policy: raw.policy
      ? {
          slaPrepHours: raw.policy.slaPrepHours,
          slaDeliveryHours: raw.policy.slaDeliveryHours,
          cutoffTimeLocal: raw.policy.cutoffTimeLocal,
        }
      : null,
    createdAt: raw.createdAt,
  };
}

function toSellerProductSummary(raw: RawSellerProduct): SellerProductSummary {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    priceAmount: raw.priceAmount,
    currency: raw.currency,
    status: raw.status,
    isSurpriseReady: raw.isSurpriseReady,
    isLastMinuteOk: raw.isLastMinuteOk,
    preparationTimeMin: raw.preparationTimeMin ?? null,
    category: raw.category ?? null,
    tags: raw.tags.map((productTag) => ({
      slug: productTag.tag.slug,
      label: productTag.tag.label,
    })),
    coverImageUrl: raw.assets[0]?.url ?? null,
    stockQuantity: raw.inventory?.stockQuantity ?? 0,
    createdAt: raw.createdAt,
  };
}

async function resolveTagConnections(
  tagSlugs: string[],
): Promise<{ tagId: string }[]> {
  const existingTags = await prisma.tag.findMany({
    where: { slug: { in: tagSlugs } },
    select: { id: true, slug: true },
  });

  return existingTags.map((tag) => ({ tagId: tag.id }));
}
