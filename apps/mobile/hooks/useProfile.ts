import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  locale: string;
  marketingConsent: boolean;
  createdAt: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UserAddress {
  id: string;
  label: string;
  name: string;
  line: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressInput {
  label?: string;
  name: string;
  line: string;
  city: string;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => apiRequest<UserProfile>('/users/me'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) =>
      apiRequest<UserProfile>('/users/me', {
        method: 'PATCH',
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiRequest<UserAddress[]>('/users/me/addresses'),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAddressInput) =>
      apiRequest<UserAddress>('/users/me/addresses', {
        method: 'POST',
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      apiRequest<void>(`/users/me/addresses/${addressId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) =>
      apiRequest<{ success: boolean }>(`/users/me/addresses/${addressId}/default`, {
        method: 'PATCH',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}
