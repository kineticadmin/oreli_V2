import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import { tokenStorage, apiRequest } from '@/lib/api';
import { useGiftStore } from './giftStore';

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
  userFirstName: string | null;
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;

  // Actions
  initializeAuth: () => Promise<void>;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: (refreshToken: string) => Promise<void>;
}

// ─── Store ─────────────────────────────────────────────────────────────────

async function fetchAndSyncUserProfile(): Promise<void> {
  try {
    const profile = await apiRequest<{ firstName: string; email: string }>('/users/me');
    useGiftStore.getState().setUserName(profile.firstName);
  } catch {
    // Non-bloquant — le profil sera chargé plus tard
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userRole: null,
  userFirstName: null,
  userEmail: null,
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
        await fetchAndSyncUserProfile();
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
      await fetchAndSyncUserProfile();
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
    await fetchAndSyncUserProfile();
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
      useGiftStore.getState().setUserName('');
      set({ userId: null, userRole: null, userFirstName: null, userEmail: null, isAuthenticated: false });
    }
  },
}));
