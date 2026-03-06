import { prisma } from '../../lib/prisma.js';

// ─── Constantes de scoring ─────────────────────────────────────────────────

const MIN_SELLER_RELIABILITY_SCORE = 0.70;
const MAX_RECOMMENDATION_RESULTS = 20;
const MAX_STOCK_THRESHOLD = 5; // Au-delà de 5 unités, score stock = 1.0

// Poids du score composite (somme = 1.0)
const SCORE_WEIGHT_TAG_MATCH = 0.40;
const SCORE_WEIGHT_SELLER_RELIABILITY = 0.35;
const SCORE_WEIGHT_RECENCY = 0.15;
const SCORE_WEIGHT_STOCK_AVAILABILITY = 0.10;

const MILLISECONDS_PER_DAY = 86_400_000;
const RECENCY_DECAY_DAYS = 365; // Un produit créé il y a 365+ jours a score recency = 0

// ─── Types ────────────────────────────────────────────────────────────────

export interface GiftIntentInput {
  budgetMin?: number | undefined;     // en centimes EUR
  budgetMax?: number | undefined;     // en centimes EUR
  occasionType?: string | undefined;
  recipientTagSlugs?: string[] | undefined;
  isSurpriseMode?: boolean | undefined;
  isLastMinute?: boolean | undefined;
  limit?: number | undefined;
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
}

export interface RecommendationResult {
  products: RecommendedProduct[];
  totalCandidatesEvaluated: number;
}

export interface CuratedHomeProduct {
  id: string;
  title: string;
  priceAmount: number;
  currency: string;
  coverImageUrl: string | null;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  category: { id: string; name: string; slug: string } | null;
  seller: { id: string; displayName: string };
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export async function recommendProducts(
  intent: GiftIntentInput,
): Promise<RecommendationResult> {
  const limit = Math.min(intent.limit ?? 10, MAX_RECOMMENDATION_RESULTS);

  const candidates = await fetchEligibleProducts(intent);

  const recipientTags = intent.recipientTagSlugs ?? [];
  const now = new Date();

  const scoredProducts = candidates
    .map((product) => ({
      product,
      score: computeCompositeScore(product, recipientTags, now),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return {
    products: scoredProducts.map(({ product, score }) =>
      toRecommendedProduct(product, score),
    ),
    totalCandidatesEvaluated: candidates.length,
  };
}

/**
 * Sélection curatoriale pour la home : 8 produits diversifiés depuis les vendeurs
 * les plus fiables. Au maximum 2 produits par catégorie pour garantir la diversité.
 */
export async function getCuratedHomeProducts(): Promise<CuratedHomeProduct[]> {
  const HIGH_RELIABILITY_THRESHOLD = 0.85;
  const MAX_PRODUCTS_PER_CATEGORY = 2;
  const CURATED_HOME_SIZE = 8;

  const topProducts = await prisma.product.findMany({
    where: {
      status: 'active',
      seller: { status: 'active', reliabilityScore: { gte: HIGH_RELIABILITY_THRESHOLD } },
      inventory: { stockQuantity: { gt: 0 } },
    },
    orderBy: [
      { seller: { reliabilityScore: 'desc' } },
      { createdAt: 'desc' },
    ],
    // Récupère un surplus pour compenser le filtre de diversité par catégorie
    take: CURATED_HOME_SIZE * 4,
    include: {
      category: true,
      assets: { orderBy: { position: 'asc' }, take: 1 },
      seller: { select: { id: true, displayName: true } },
    },
  });

  const selectedProducts = selectDiverseProducts(
    topProducts,
    MAX_PRODUCTS_PER_CATEGORY,
    CURATED_HOME_SIZE,
  );

  return selectedProducts.map(toCuratedHomeProduct);
}

// ─── Helpers privés ───────────────────────────────────────────────────────

type EligibleProduct = Awaited<ReturnType<typeof fetchEligibleProducts>>[number];

async function fetchEligibleProducts(intent: GiftIntentInput) {
  const occasionTagFilter =
    intent.occasionType
      ? { tags: { some: { tag: { slug: intent.occasionType } } } }
      : {};

  return prisma.product.findMany({
    where: {
      status: 'active',
      seller: {
        status: 'active',
        reliabilityScore: { gte: MIN_SELLER_RELIABILITY_SCORE },
      },
      ...(intent.budgetMin !== undefined && { priceAmount: { gte: intent.budgetMin } }),
      ...(intent.budgetMax !== undefined && { priceAmount: { lte: intent.budgetMax } }),
      ...(intent.isSurpriseMode === true && { isSurpriseReady: true }),
      ...(intent.isLastMinute === true && { isLastMinuteOk: true }),
      inventory: { stockQuantity: { gt: 0 } },
      ...occasionTagFilter,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
      assets: { orderBy: { position: 'asc' }, take: 1 },
      inventory: true,
      seller: { select: { id: true, displayName: true, reliabilityScore: true } },
    },
  });
}

function computeCompositeScore(
  product: EligibleProduct,
  recipientTagSlugs: string[],
  now: Date,
): number {
  const tagMatchScore = computeTagMatchScore(product.tags, recipientTagSlugs);

  // reliabilityScore est déjà entre 0 et 1 dans le schema
  const sellerReliabilityScore = product.seller.reliabilityScore;

  const daysSinceCreation =
    (now.getTime() - product.createdAt.getTime()) / MILLISECONDS_PER_DAY;
  const recencyScore = Math.max(0, 1 - daysSinceCreation / RECENCY_DECAY_DAYS);

  const stockQuantity = product.inventory?.stockQuantity ?? 0;
  const stockAvailabilityScore = Math.min(stockQuantity / MAX_STOCK_THRESHOLD, 1);

  return (
    SCORE_WEIGHT_TAG_MATCH * tagMatchScore +
    SCORE_WEIGHT_SELLER_RELIABILITY * sellerReliabilityScore +
    SCORE_WEIGHT_RECENCY * recencyScore +
    SCORE_WEIGHT_STOCK_AVAILABILITY * stockAvailabilityScore
  );
}

function computeTagMatchScore(
  productTags: { tag: { slug: string } }[],
  recipientTagSlugs: string[],
): number {
  // Sans préférences connues du destinataire, tous les produits sont considérés équivalents
  if (recipientTagSlugs.length === 0) return 1;

  const productTagSlugs = new Set(productTags.map((pt) => pt.tag.slug));
  const matchingTagsCount = recipientTagSlugs.filter((slug) =>
    productTagSlugs.has(slug),
  ).length;

  return matchingTagsCount / recipientTagSlugs.length;
}

function selectDiverseProducts<T extends { category: { id: string } | null }>(
  products: T[],
  maxPerCategory: number,
  totalLimit: number,
): T[] {
  const countByCategoryId = new Map<string, number>();
  const selected: T[] = [];

  for (const product of products) {
    if (selected.length >= totalLimit) break;

    const categoryKey = product.category?.id ?? 'uncategorized';
    const currentCount = countByCategoryId.get(categoryKey) ?? 0;

    if (currentCount < maxPerCategory) {
      selected.push(product);
      countByCategoryId.set(categoryKey, currentCount + 1);
    }
  }

  return selected;
}

function toRecommendedProduct(
  product: EligibleProduct,
  score: number,
): RecommendedProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    priceAmount: product.priceAmount,
    currency: product.currency,
    coverImageUrl: product.assets[0]?.url ?? null,
    isSurpriseReady: product.isSurpriseReady,
    isLastMinuteOk: product.isLastMinuteOk,
    category: product.category ?? null,
    tags: product.tags.map((pt) => ({ slug: pt.tag.slug, label: pt.tag.label })),
    seller: product.seller,
    score: Math.round(score * 1000) / 1000, // 3 décimales
  };
}

type CuratedRawProduct = Awaited<
  ReturnType<typeof prisma.product.findMany>
>[number] & {
  category: { id: string; name: string; slug: string } | null;
  assets: { url: string }[];
  seller: { id: string; displayName: string };
};

function toCuratedHomeProduct(product: CuratedRawProduct): CuratedHomeProduct {
  return {
    id: product.id,
    title: product.title,
    priceAmount: product.priceAmount,
    currency: product.currency,
    coverImageUrl: product.assets[0]?.url ?? null,
    isSurpriseReady: product.isSurpriseReady,
    isLastMinuteOk: product.isLastMinuteOk,
    category: product.category ?? null,
    seller: product.seller,
  };
}
