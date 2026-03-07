const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
    throw new ApiError(response.status, body.message ?? 'Erreur inconnue');
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface ProductSummary {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  currency: string;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  category: { id: string; name: string; slug: string } | null;
  tags: { slug: string; label: string }[];
  coverImageUrl: string | null;
  seller: { id: string; displayName: string };
  createdAt: string;
}

export interface ProductDetail extends ProductSummary {
  images: { id: string; url: string; position: number }[];
  stockQuantity: number;
  preparationTimeMin: number | null;
  seller: { id: string; displayName: string; reliabilityScore: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface BuyerOrder {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  giftMessage: string | null;
  requestedDeliveryDate: string;
  items: {
    productTitle: string;
    quantity: number;
    unitPriceAmount: number;
  }[];
  fulfillment: { trackingCode: string } | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}
