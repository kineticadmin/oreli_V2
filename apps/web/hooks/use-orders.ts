import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, type BuyerOrder } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  deliveryAddress: {
    name: string;
    line: string;
    city: string;
    postalCode: string;
    country: string;
  };
  requestedDeliveryDate: string;
  giftMessage?: string;
  surpriseMode: 'total' | 'controlled' | 'manual';
}

export interface CreateOrderResult {
  orderId: string;
  stripeClientSecret: string;
}

export function useBuyerOrders() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['buyer-orders', session?.accessToken],
    queryFn: () => apiRequest<BuyerOrder[]>('/orders', { token: session?.accessToken }),
    enabled: !!session,
  });
}

export function useBuyerOrder(orderId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['buyer-order', orderId],
    queryFn: () => apiRequest<BuyerOrder>(`/orders/${orderId}`, { token: session?.accessToken }),
    enabled: !!session && !!orderId,
  });
}

export function useCreateOrder() {
  const { session } = useAuth();

  return useMutation({
    mutationFn: (input: CreateOrderInput) =>
      apiRequest<CreateOrderResult>('/orders', {
        method: 'POST',
        body: JSON.stringify(input),
        token: session?.accessToken,
      }),
  });
}

export function formatOrderStatus(status: string): { label: string; color: string } {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending_payment: { label: 'En attente de paiement', color: 'text-muted' },
    paid: { label: 'Payé', color: 'text-warning' },
    accepted: { label: 'Accepté', color: 'text-warning' },
    in_preparation: { label: 'En préparation', color: 'text-warning' },
    shipped: { label: 'Expédié', color: 'text-gold' },
    delivered: { label: 'Livré', color: 'text-success' },
    cancelled: { label: 'Annulé', color: 'text-danger' },
  };
  return statusMap[status] ?? { label: status, color: 'text-muted' };
}
