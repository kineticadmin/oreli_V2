// Helper partagé pour la pagination cursor-based (règle absolue : jamais offset).
// Curseur encodé en base64url : JSON({ createdAt: ISO string, id: string })

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

// ─── Types ────────────────────────────────────────────────────────────────

export interface CursorInput {
  cursor?: string | undefined;
  limit?: number | undefined;
}

export interface DecodedCursor {
  createdAt: Date;
  id: string;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export function parsePaginationInput(input: CursorInput): {
  decodedCursor: DecodedCursor | null;
  pageSize: number;
} {
  const pageSize = Math.min(input.limit ?? DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);

  if (!input.cursor) {
    return { decodedCursor: null, pageSize };
  }

  try {
    const rawJson = Buffer.from(input.cursor, 'base64url').toString('utf8');
    const parsed = JSON.parse(rawJson) as { createdAt: string; id: string };
    return {
      decodedCursor: { createdAt: new Date(parsed.createdAt), id: parsed.id },
      pageSize,
    };
  } catch {
    return { decodedCursor: null, pageSize };
  }
}

export function encodeCursor(createdAt: Date, id: string): string {
  const payload = JSON.stringify({ createdAt: createdAt.toISOString(), id });
  return Buffer.from(payload).toString('base64url');
}

/**
 * Construit la réponse paginée depuis un tableau de (pageSize + 1) éléments.
 * Le +1 permet de détecter s'il existe une page suivante sans requête COUNT.
 */
export function buildCursorPage<T extends { createdAt: Date; id: string }>(
  oversizedItems: T[],
  pageSize: number,
): CursorPage<T> {
  const hasMore = oversizedItems.length > pageSize;
  const pageItems = hasMore ? oversizedItems.slice(0, pageSize) : oversizedItems;
  const lastItem = pageItems[pageItems.length - 1];
  const nextCursor =
    hasMore && lastItem ? encodeCursor(lastItem.createdAt, lastItem.id) : null;

  return { items: pageItems, nextCursor, hasMore };
}
