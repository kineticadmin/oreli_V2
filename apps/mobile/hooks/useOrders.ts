import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface BuyerOrderSummary {
  id: string;
  status: string;
  currency: string;
  totalAmount: number;
  giftMessage: string | null;
  firstItemTitle: string;
  firstItemSellerName: string;
  createdAt: string;
}

// Statuts API → label FR + couleur
export const ORDER_STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending_payment:  { label: 'En attente',       color: '#CA8A04', bg: '#CA8A0422' },
  paid:             { label: 'Payé',              color: '#7C3AED', bg: '#7C3AED22' },
  accepted:         { label: 'Accepté',           color: '#2563EB', bg: '#2563EB22' },
  in_preparation:   { label: 'En préparation',    color: '#7C3AED', bg: '#7C3AED22' },
  shipped:          { label: 'Expédié',           color: '#0891B2', bg: '#0891B222' },
  delivered:        { label: 'Livré',             color: '#16A34A', bg: '#16A34A22' },
  cancelled:        { label: 'Annulé',            color: '#DC2626', bg: '#DC262622' },
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => apiRequest<BuyerOrderSummary[]>('/orders'),
    staleTime: 30 * 1000, // 30 secondes — les statuts changent
  });
}
