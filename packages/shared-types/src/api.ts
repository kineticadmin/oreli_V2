/**
 * Types génériques pour les réponses et erreurs API.
 */

// ─── Réponses API ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
    data: T;
    meta?: ApiMeta;
}

export interface ApiListResponse<T> {
    data: T[];
    meta: ApiListMeta;
}

export interface ApiMeta {
    requestId?: string;
    timestamp?: string;
}

export interface ApiListMeta {
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
}

export interface ApiError {
    code: string;
    message: string;
    field?: string;
    requestId?: string;
}

// ─── Pagination cursor-based ───────────────────────────────────────────────

/**
 * Cursor encodé base64 : "ISO_DATE__uuid"
 * Exemple : btoa("2024-01-15T10:30:00Z__uuid-xxx")
 */
export interface PaginationCursor {
    after?: string;
    limit: number;
}

// ─── SSE Events ────────────────────────────────────────────────────────────

export interface OrderTrackingEvent {
    orderId: string;
    status: string;
    timestamp: string;
    note?: string;
}
