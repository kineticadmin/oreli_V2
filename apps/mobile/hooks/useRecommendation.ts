import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface GiftIntentInput {
  budgetMin?: number;
  budgetMax?: number;
  occasionType?: string;
  recipientTagSlugs?: string[];
  isSurpriseMode?: boolean;
  isLastMinute?: boolean;
  limit?: number;
}

export interface RecommendedProduct {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  currency: string;
  coverImageUrl: string | null;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  category: { id: string; name: string; slug: string } | null;
  tags: { slug: string; label: string }[];
  seller: { id: string; displayName: string };
  score: number;
}

export interface RecommendationResult {
  products: RecommendedProduct[];
  totalCandidatesEvaluated: number;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useRecommendation() {
  return useMutation({
    mutationFn: (intent: GiftIntentInput) =>
      apiRequest<RecommendationResult>('/gift/recommend', {
        method: 'POST',
        body: intent,
        authenticated: false,
      }),
  });
}
