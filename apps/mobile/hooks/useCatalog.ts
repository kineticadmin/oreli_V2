import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

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
  createdAt: string;
}

export interface ProductDetail extends ProductSummary {
  images: { id: string; url: string; position: number }[];
  stockQuantity: number;
  preparationTimeMin: number | null;
  seller: { id: string; displayName: string; reliabilityScore: number };
}

export interface CuratedProduct {
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

interface ProductsPage {
  items: ProductSummary[];
  nextCursor: string | null;
  hasMore: boolean;
}

interface ListProductsParams {
  categoryId?: string;
  minPriceAmount?: number;
  maxPriceAmount?: number;
  isSurpriseReady?: boolean;
  isLastMinuteOk?: boolean;
  tagSlugs?: string[];
  limit?: number;
}

// ─── Formatage prix ────────────────────────────────────────────────────────

/** Convertit les centimes en chaîne affichable (ex : 5500 → "55,00 €") */
export function formatPrice(amountCents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useCuratedProducts() {
  return useQuery({
    queryKey: ['catalog', 'curated'],
    queryFn: () => apiRequest<CuratedProduct[]>('/gift/home/curated', { authenticated: false }),
    staleTime: 5 * 60 * 1000, // 5 minutes — les curés changent peu
  });
}

export function useProductsList(params: ListProductsParams = {}) {
  const searchParams = new URLSearchParams();
  if (params.categoryId) searchParams.set('categoryId', params.categoryId);
  if (params.minPriceAmount !== undefined) searchParams.set('minPriceAmount', String(params.minPriceAmount));
  if (params.maxPriceAmount !== undefined) searchParams.set('maxPriceAmount', String(params.maxPriceAmount));
  if (params.isSurpriseReady !== undefined) searchParams.set('isSurpriseReady', String(params.isSurpriseReady));
  if (params.isLastMinuteOk !== undefined) searchParams.set('isLastMinuteOk', String(params.isLastMinuteOk));
  if (params.tagSlugs?.length) searchParams.set('tagSlugs', params.tagSlugs.join(','));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const queryString = searchParams.toString();

  return useInfiniteQuery({
    queryKey: ['catalog', 'products', params],
    queryFn: ({ pageParam }) => {
      const cursorParam = pageParam ? `&cursor=${pageParam}` : '';
      return apiRequest<ProductsPage>(
        `/catalog/products?${queryString}${cursorParam}`,
        { authenticated: false },
      );
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductDetail(productId: string) {
  return useQuery({
    queryKey: ['catalog', 'product', productId],
    queryFn: () =>
      apiRequest<ProductDetail>(`/catalog/products/${productId}`, { authenticated: false }),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}
