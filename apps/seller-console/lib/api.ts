const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8080';

// ─── Types ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface SellerProfile {
  id: string;
  displayName: string;
  legalName: string | null;
  vatNumber: string | null;
  status: string;
  kybStatus: string;
  reliabilityScore: number;
  policy: {
    slaPrepHours: number;
    slaDeliveryHours: number;
    cutoffTimeLocal: string;
  } | null;
  createdAt: string;
}

export interface SellerProduct {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  currency: string;
  status: string;
  isSurpriseReady: boolean;
  isLastMinuteOk: boolean;
  preparationTimeMin: number | null;
  category: { id: string; name: string; slug: string } | null;
  tags: { slug: string; label: string }[];
  coverImageUrl: string | null;
  stockQuantity: number;
  createdAt: string;
}

export interface SellerProductsPage {
  items: SellerProduct[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SellerOrderItem {
  productTitle: string;
  quantity: number;
  unitPriceAmount: number;
}

export interface SellerOrderFulfillment {
  id: string;
  status: string;
  acceptDeadline: string;
  trackingCode: string | null;
}

export interface SellerOrder {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  buyerFirstName: string;
  giftMessage: string | null;
  requestedDeliveryDate: string;
  items: SellerOrderItem[];
  fulfillment: SellerOrderFulfillment | null;
  createdAt: string;
}

// ─── Fetch wrapper ────────────────────────────────────────────────────────

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers: extraHeaders, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> ?? {}),
  };

  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new ApiError(response.status, body.message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}
