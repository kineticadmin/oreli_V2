import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { tokenStorage, apiRequest } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

interface DecodedAccessToken {
  sub: string;
  role: string;
  sellerId?: string;
  exp: number;
}

interface AuthState {
  userId: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: (refreshToken: string) => Promise<void>;
}

// ─── Store ─────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userRole: null,
  isAuthenticated: false,
  isLoadingAuth: true,

  /**
   * Appelé au démarrage de l'app — restaure la session depuis SecureStore.
   * Si le token est expiré, tente un refresh silencieux.
   */
  initializeAuth: async () => {
    try {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        set({ isAuthenticated: false, isLoadingAuth: false });
        return;
      }

      const decoded = jwtDecode<DecodedAccessToken>(accessToken);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (!isExpired) {
        set({
          userId: decoded.sub,
          userRole: decoded.role,
          isAuthenticated: true,
          isLoadingAuth: false,
        });
        return;
      }

      // Token expiré → refresh silencieux
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        await tokenStorage.clearTokens();
        set({ isAuthenticated: false, isLoadingAuth: false });
        return;
      }

      const data = await apiRequest<{ accessToken: string; refreshToken: string }>(
        '/auth/refresh',
        {
          method: 'POST',
          body: { refreshToken },
          authenticated: false,
        },
      );

      await tokenStorage.saveTokens(data.accessToken, data.refreshToken);
      const freshDecoded = jwtDecode<DecodedAccessToken>(data.accessToken);
      set({
        userId: freshDecoded.sub,
        userRole: freshDecoded.role,
        isAuthenticated: true,
        isLoadingAuth: false,
      });
    } catch {
      await tokenStorage.clearTokens();
      set({ isAuthenticated: false, isLoadingAuth: false });
    }
  },

  loginWithTokens: async (accessToken: string, refreshToken: string) => {
    await tokenStorage.saveTokens(accessToken, refreshToken);
    const decoded = jwtDecode<DecodedAccessToken>(accessToken);
    set({
      userId: decoded.sub,
      userRole: decoded.role,
      isAuthenticated: true,
    });
  },

  logout: async (refreshToken: string) => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: { refreshToken },
      });
    } catch {
      // On efface les tokens locaux même si l'API échoue
    } finally {
      await tokenStorage.clearTokens();
      set({ userId: null, userRole: null, isAuthenticated: false });
    }
  },
}));
