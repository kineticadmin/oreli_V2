const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8080';
const ADMIN_KEY = process.env['NEXT_PUBLIC_ADMIN_KEY'] ?? '';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}/api/v1/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_KEY,
      ...(options.headers as Record<string, string> ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new ApiError(response.status, body.message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRevenueCents: number;
  ordersByStatus: Record<string, number>;
  activeSellerCount: number;
  pendingKybCount: number;
  ordersLast7Days: number;
}

export interface AdminOrder {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  buyerEmail: string;
  buyerFirstName: string;
  firstItemTitle: string;
  sellerDisplayName: string;
  createdAt: string;
}

export interface AdminSeller {
  id: string;
  displayName: string;
  legalName: string | null;
  vatNumber: string | null;
  status: string;
  kybStatus: string;
  reliabilityScore: number;
  productCount: number;
  orderCount: number;
  ownerEmail: string | null;
  createdAt: string;
}
