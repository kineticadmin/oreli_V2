/**
 * Entités principales du domaine Oreli.
 * Source de vérité pour mobile, web, API et backoffice.
 */

// ─── Utilisateur ───────────────────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
    locale: string;
    status: 'active' | 'suspended' | 'deleted';
    marketingConsent: boolean;
    createdAt: string;
}

export interface UserAddress {
    id?: string;
    name: string;
    line: string;
    city?: string;
    postalCode?: string;
    country?: string;
}

// ─── Relation (proche) ─────────────────────────────────────────────────────

export interface Relationship {
    id: string;
    userId: string;
    displayName: string;
    relationshipType: 'partner' | 'friend' | 'parent' | 'child' | 'colleague' | 'other';
    birthdate?: string;
    preferences: RelationshipPreferences;
    affinityScore: number;
    /** Avatar initiale (fallback si pas d'avatarUrl) */
    avatar?: string;
    avatarUrl?: string;
    /** Prochain événement lié à ce proche */
    upcomingEvent?: {
        type: string;
        date: string;
        daysUntil: number;
    };
}

export interface RelationshipPreferences {
    likes?: string[];
    dislikes?: string[];
    allergies?: string[];
    sizes?: Record<string, string>;
    colors?: string[];
    style?: string[];
    [key: string]: unknown;
}

/** Alias rétrocompatible avec le prototype (data/mockData.ts) */
export interface CloseOne extends Pick<Relationship, 'id' | 'avatar' | 'avatarUrl'> {
    name: string;
    relationship: string;
    eventType?: string;
    eventDate?: string;
    daysUntilEvent?: number;
}

// ─── Vendeur ───────────────────────────────────────────────────────────────

export interface Seller {
    id: string;
    displayName: string;
    status: 'pending' | 'active' | 'suspended';
    reliabilityScore: number;
    rating?: number;
    slaPrepHours: number;
    slaDeliveryHours: number;
}

// ─── Produit & Catalogue ───────────────────────────────────────────────────

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: 'EUR';
    seller: string | Seller;
    rating: number;
    images: string[];
    category: string;
    tags: string[];
    isAvailable: boolean;
    isSurpriseReady: boolean;
    deliveryExpress: boolean;
    preparationTimeMin: number;
    /** Score de recommandation IA (0-100) — présent uniquement dans les réponses /gift/recommend */
    matchScore?: number;
    /** Justification courte générée par Gemini */
    aiJustification?: string;
    createdAt?: string;
}

export interface Occasion {
    iconName: string;
    label: string;
    id?: string;
}

// ─── Commandes ─────────────────────────────────────────────────────────────

export type OrderStatus =
    | 'draft'
    | 'pending_payment'
    | 'paid'
    | 'accepted'
    | 'in_preparation'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface Order {
    id: string;
    buyerUserId: string;
    status: OrderStatus;
    itemsSubtotal: number;
    serviceFee: number;
    deliveryFee: number;
    total: number;
    currency: 'EUR';
    giftMessage?: string;
    surpriseMode: 'total' | 'controlled' | 'manual';
    requestedDeliveryDate: string;
    deliveryAddressSnapshot: UserAddress;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productSnapshot: Product;
    quantity: number;
    unitPrice: number;
}

// ─── Événements & Rappels ──────────────────────────────────────────────────

export interface GiftingEvent {
    id: string;
    userId: string;
    relationshipId: string;
    type: string;
    date: string;
    isRecurring: boolean;
    notes?: string;
}
