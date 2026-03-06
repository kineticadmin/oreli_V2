/**
 * DTOs (Data Transfer Objects) — payloads échangés entre mobile/web et API.
 */

import type { OrderStatus } from './entities';

// ─── Gift Flow ─────────────────────────────────────────────────────────────

export type OccasionType =
    | 'birthday'
    | 'anniversary'
    | 'valentines'
    | 'christmas'
    | 'graduation'
    | 'birth'
    | 'housewarming'
    | 'just_because'
    | 'other';

export type SurpriseMode = 'total' | 'controlled' | 'manual';

export interface GiftIntentDTO {
    relationshipId: string;
    budgetMinCents: number;
    budgetMaxCents: number;
    occasion: OccasionType;
    requestedDeliveryDate: string;
    surpriseMode: SurpriseMode;
    deliveryAddressId: string;
}

export interface RecommendationResult {
    productId: string;
    finalScore: number;
    justification: string;
    scoreBreakdown: {
        budgetMatch: number;
        occasionMatch: number;
        relationshipMatch: number;
        vectorSimilarity: number;
        sellerReliability: number;
        popularity: number;
    };
}

// ─── Commandes ─────────────────────────────────────────────────────────────

export interface CreateOrderDTO {
    items: { productId: string; quantity: number }[];
    giftMessage?: string;
    surpriseMode: SurpriseMode;
    requestedDeliveryDate: string;
    deliveryAddressId: string;
    giftIntentId?: string;
}

export interface OrderStatusUpdateDTO {
    status: OrderStatus;
    note?: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface SignupDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    locale?: string;
    marketingConsent?: boolean;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface TokenPairDTO {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

// ─── Gift Flow store (mobile) ──────────────────────────────────────────────

/** État local du flow cadeau dans le store Zustand (apps/mobile) */
export interface GiftFlowData {
    personId: string;
    budget: [number, number];
    occasion: string;
    deliveryDate: string;
    surpriseLevel: string;
    giftMessage: string;
    premiumWrap: boolean;
}
