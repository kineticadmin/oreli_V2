import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

interface OrderItem {
  productId: string;
  quantity: number;
}

interface DeliveryAddress {
  name: string;
  line: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderInput {
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  requestedDeliveryDate: string; // YYYY-MM-DD
  giftMessage?: string;
  surpriseMode: 'total' | 'controlled' | 'manual';
}

interface CreateOrderResult {
  orderId: string;
  stripeClientSecret: string;
}

// ─── Helper ────────────────────────────────────────────────────────────────

/** Convertit le niveau de surprise du store vers le format attendu par l'API. */
export function toSurpriseMode(level: string | undefined): 'total' | 'controlled' | 'manual' {
  if (level === 'total') return 'total';
  if (level === 'guided') return 'controlled';
  return 'manual';
}

/** Extrait la date YYYY-MM-DD depuis un ISO string ou retourne aujourd'hui. */
export function toDeliveryDate(isoDate: string | undefined): string {
  if (!isoDate) return new Date().toISOString().slice(0, 10);
  return new Date(isoDate).toISOString().slice(0, 10);
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) =>
      apiRequest<CreateOrderResult>('/orders', {
        method: 'POST',
        body: input,
      }),
    onSuccess: () => {
      // Invalider la liste des commandes après création
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
