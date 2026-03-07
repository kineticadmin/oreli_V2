import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type SellerOrder } from '@/lib/api';
import { useSellerContext } from '@/lib/seller-context';

// ─── Hooks ────────────────────────────────────────────────────────────────

export function useOrders(status?: string) {
  const { session } = useSellerContext();
  const sellerId = session?.sellerId;

  return useQuery({
    queryKey: ['seller-orders', sellerId, status],
    queryFn: () => {
      const statusParam = status ? `?status=${status}` : '';
      return apiRequest<SellerOrder[]>(
        `/sellers/${sellerId}/orders${statusParam}`,
        { token: session?.accessToken },
      );
    },
    enabled: !!sellerId,
    refetchInterval: 30_000, // Rafraîchissement auto toutes les 30s
  });
}

export function useAcceptOrder() {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: (orderId: string) =>
      apiRequest<{ success: boolean }>(`/sellers/${sellerId}/orders/${orderId}/accept`, {
        method: 'PATCH',
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders', sellerId] });
    },
  });
}

export function useRejectOrder() {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      apiRequest<{ success: boolean }>(`/sellers/${sellerId}/orders/${orderId}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders', sellerId] });
    },
  });
}

export function useShipOrder() {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: ({ orderId, trackingCode }: { orderId: string; trackingCode: string }) =>
      apiRequest<{ success: boolean }>(`/sellers/${sellerId}/orders/${orderId}/ship`, {
        method: 'PATCH',
        body: JSON.stringify({ trackingCode }),
        token: session?.accessToken,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-orders', sellerId] });
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────

export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  paid: { label: 'Payée', color: 'text-warning', bgColor: 'bg-warning/10' },
  accepted: { label: 'Acceptée', color: 'text-success', bgColor: 'bg-success/10' },
  in_preparation: { label: 'En préparation', color: 'text-success', bgColor: 'bg-success/10' },
  shipped: { label: 'Expédiée', color: 'text-cream', bgColor: 'bg-stone' },
  delivered: { label: 'Livrée', color: 'text-muted', bgColor: 'bg-stone' },
  cancelled: { label: 'Annulée', color: 'text-danger', bgColor: 'bg-danger/10' },
};
