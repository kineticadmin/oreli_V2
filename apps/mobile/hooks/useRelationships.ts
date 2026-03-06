import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface UpcomingEvent {
  id: string;
  eventType: string;
  eventDate: string;
  daysUntil: number;
}

export interface RelationshipSummary {
  id: string;
  displayName: string;
  relationshipType: string;
  birthdate: string | null;
  preferences: Record<string, unknown>;
  affinityScore: number;
  upcomingEvents: UpcomingEvent[];
  createdAt: string;
}

export interface CreateRelationshipInput {
  displayName: string;
  relationshipType: string;
  birthdate?: string;
  preferences?: Record<string, unknown>;
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useRelationships() {
  return useQuery({
    queryKey: ['relationships'],
    queryFn: () => apiRequest<RelationshipSummary[]>('/relationships'),
    staleTime: 60 * 1000,
  });
}

export function useCreateRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRelationshipInput) =>
      apiRequest<RelationshipSummary>('/relationships', {
        method: 'POST',
        body: input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
    },
  });
}

export function useDeleteRelationship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (relationshipId: string) =>
      apiRequest<void>(`/relationships/${relationshipId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
    },
  });
}
