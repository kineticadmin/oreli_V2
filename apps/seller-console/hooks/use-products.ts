import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type SellerProduct, type SellerProductsPage } from '@/lib/api';
import { useSellerContext } from '@/lib/seller-context';

// ─── Types ────────────────────────────────────────────────────────────────

export interface CreateProductInput {
  title: string;
  description: string;
  priceAmount: number;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  preparationTimeMin?: number | undefined;
  tagSlugs?: string[] | undefined;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

// ─── Hooks ────────────────────────────────────────────────────────────────

export function useProducts(status?: string) {
  const { session } = useSellerContext();
  const sellerId = session?.sellerId;

  return useQuery({
    queryKey: ['seller-products', sellerId, status],
    queryFn: () => {
      const statusParam = status ? `&status=${status}` : '';
      return apiRequest<SellerProductsPage>(
        `/sellers/${sellerId}/products?limit=50${statusParam}`,
        { token: session?.accessToken },
      );
    },
    enabled: !!sellerId,
  });
}

export function useProduct(productId: string) {
  const { session } = useSellerContext();
  const sellerId = session?.sellerId;

  return useQuery({
    queryKey: ['seller-product', sellerId, productId],
    queryFn: () =>
      apiRequest<SellerProduct>(
        `/sellers/${sellerId}/products/${productId}`,
        { token: session?.accessToken },
      ),
    enabled: !!sellerId && !!productId,
  });
}

export function useCreateProduct() {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: (input: CreateProductInput) =>
      apiRequest<SellerProduct>(`/sellers/${sellerId}/products`, {
        method: 'POST',
        body: JSON.stringify(input),
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products', sellerId] });
    },
  });
}

export function useUpdateProduct(productId: string) {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: (input: UpdateProductInput) =>
      apiRequest<SellerProduct>(`/sellers/${sellerId}/products/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products', sellerId] });
      queryClient.invalidateQueries({ queryKey: ['seller-product', sellerId, productId] });
    },
  });
}

export function useSetStock(productId: string) {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: (stockQuantity: number) =>
      apiRequest<{ stockQuantity: number }>(`/sellers/${sellerId}/products/${productId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ stockQuantity }),
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products', sellerId] });
    },
  });
}

export function useArchiveProduct() {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: (productId: string) =>
      apiRequest<null>(`/sellers/${sellerId}/products/${productId}`, {
        method: 'DELETE',
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-products', sellerId] });
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export function formatProductStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: 'Brouillon', color: 'text-muted' },
    pending_review: { label: 'En révision', color: 'text-warning' },
    active: { label: 'Actif', color: 'text-success' },
    paused: { label: 'Pausé', color: 'text-warning' },
    archived: { label: 'Archivé', color: 'text-danger' },
  };
  return statusMap[status] ?? { label: status, color: 'text-muted' };
}

export function formatPrice(amountCents: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}
