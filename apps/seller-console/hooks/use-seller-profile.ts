import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest, type SellerProfile } from '@/lib/api';
import { useSellerContext } from '@/lib/seller-context';

// ─── Types ────────────────────────────────────────────────────────────────

export interface UpdateSellerProfileInput {
  displayName?: string;
  legalName?: string;
  vatNumber?: string;
  slaPrepHours?: number;
  slaDeliveryHours?: number;
  cutoffTimeLocal?: string;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useUpdateSellerProfile() {
  const { session } = useSellerContext();
  const queryClient = useQueryClient();
  const sellerId = session?.sellerId;

  return useMutation({
    mutationFn: (input: UpdateSellerProfileInput) =>
      apiRequest<SellerProfile>(`/sellers/${sellerId}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
        token: session?.accessToken,
      }),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['seller-profile', sellerId] });
      // Also update the session context so the navbar reflects changes immediately
      if (session) {
        queryClient.setQueryData(['seller-me'], updatedProfile);
      }
    },
  });
}
