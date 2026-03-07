import { useQuery } from '@tanstack/react-query';
import { apiRequest, type CursorPage, type ProductSummary, type ProductDetail, type Category } from '@/lib/api';

export interface ProductFilters {
  categoryId?: string;
  minPriceAmount?: number;
  maxPriceAmount?: number;
  isSurpriseReady?: boolean;
  isLastMinuteOk?: boolean;
  tagSlugs?: string[];
}

function buildProductsQueryString(filters: ProductFilters, limit = 24): string {
  const params = new URLSearchParams();
  params.set('limit', String(limit));

  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.minPriceAmount !== undefined) params.set('minPriceAmount', String(filters.minPriceAmount));
  if (filters.maxPriceAmount !== undefined) params.set('maxPriceAmount', String(filters.maxPriceAmount));
  if (filters.isSurpriseReady !== undefined) params.set('isSurpriseReady', String(filters.isSurpriseReady));
  if (filters.isLastMinuteOk !== undefined) params.set('isLastMinuteOk', String(filters.isLastMinuteOk));
  if (filters.tagSlugs && filters.tagSlugs.length > 0) params.set('tagSlugs', filters.tagSlugs.join(','));

  return params.toString();
}

export function useProducts(filters: ProductFilters = {}) {
  const queryString = buildProductsQueryString(filters);

  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => apiRequest<CursorPage<ProductSummary>>(`/catalog/products?${queryString}`),
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => apiRequest<ProductDetail>(`/catalog/products/${productId}`),
    enabled: !!productId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiRequest<Category[]>('/catalog/categories'),
    staleTime: 5 * 60_000,
  });
}

export function formatPrice(amountCents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}
