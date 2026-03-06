import * as SecureStore from 'expo-secure-store';

// ─── Config ────────────────────────────────────────────────────────────────

const API_BASE_URL =
  (process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:8080') + '/api/v1';

const SECURE_STORE_KEY_ACCESS_TOKEN = 'oreli_access_token';
const SECURE_STORE_KEY_REFRESH_TOKEN = 'oreli_refresh_token';

// ─── Token storage ─────────────────────────────────────────────────────────

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(SECURE_STORE_KEY_ACCESS_TOKEN);
  },
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(SECURE_STORE_KEY_REFRESH_TOKEN);
  },
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(SECURE_STORE_KEY_ACCESS_TOKEN, accessToken),
      SecureStore.setItemAsync(SECURE_STORE_KEY_REFRESH_TOKEN, refreshToken),
    ]);
  },
  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(SECURE_STORE_KEY_ACCESS_TOKEN),
      SecureStore.deleteItemAsync(SECURE_STORE_KEY_REFRESH_TOKEN),
    ]);
  },
};

// ─── Client API ────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  authenticated?: boolean;
};

let isRefreshing = false;
let pendingRequests: (() => void)[] = [];

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  const accessToken = await tokenStorage.getAccessToken();

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken ?? ''}` },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await tokenStorage.clearTokens();
    return null;
  }

  const data = (await response.json()) as { accessToken: string; refreshToken: string };
  await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, authenticated = true } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authenticated) {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  // Token expiré → tenter un refresh une seule fois
  if (response.status === 401 && authenticated) {
    if (isRefreshing) {
      // Attendre que le refresh en cours se termine
      await new Promise<void>((resolve) => pendingRequests.push(resolve));
      return apiRequest<T>(path, options);
    }

    isRefreshing = true;
    const newAccessToken = await refreshAccessToken();
    isRefreshing = false;
    pendingRequests.forEach((resolve) => resolve());
    pendingRequests = [];

    if (newAccessToken) {
      return apiRequest<T>(path, options);
    }

    throw new ApiError(401, 'UNAUTHORIZED', 'Session expirée — veuillez vous reconnecter');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Erreur inconnue' })) as
      | { code?: string; message?: string }
      | null;
    throw new ApiError(
      response.status,
      errorBody?.code ?? 'UNKNOWN_ERROR',
      errorBody?.message ?? `Erreur HTTP ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
