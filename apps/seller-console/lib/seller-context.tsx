'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiRequest, type AuthTokens, type SellerProfile } from './api';

// ─── Types ────────────────────────────────────────────────────────────────

interface SellerSession {
  accessToken: string;
  refreshToken: string;
  sellerId: string | null; // null = authentifié mais pas encore vendeur
  sellerProfile: SellerProfile | null;
}

interface SellerContextValue {
  session: SellerSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSeller: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  setSellerProfile: (profile: SellerProfile) => void;
}

const SellerContext = createContext<SellerContextValue | null>(null);

const STORAGE_KEYS = {
  accessToken: 'oreli_seller_access_token',
  refreshToken: 'oreli_seller_refresh_token',
} as const;

// ─── Provider ─────────────────────────────────────────────────────────────

export function SellerProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SellerSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const buildSession = useCallback(async (accessToken: string, refreshToken: string): Promise<SellerSession> => {
    const sellerProfile = await apiRequest<SellerProfile | null>('/sellers/me', { token: accessToken });
    return {
      accessToken,
      refreshToken,
      sellerId: sellerProfile?.id ?? null,
      sellerProfile: sellerProfile ?? null,
    };
  }, []);

  // Restaurer la session depuis localStorage au démarrage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem(STORAGE_KEYS.accessToken);
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

    if (!storedAccessToken || !storedRefreshToken) {
      setIsLoading(false);
      return;
    }

    buildSession(storedAccessToken, storedRefreshToken)
      .then((restoredSession) => {
        setSession(restoredSession);
      })
      .catch(() => {
        // Token expiré ou invalide — nettoyer le storage
        localStorage.removeItem(STORAGE_KEYS.accessToken);
        localStorage.removeItem(STORAGE_KEYS.refreshToken);
      })
      .finally(() => setIsLoading(false));
  }, [buildSession]);

  const login = useCallback(async (accessToken: string, refreshToken: string) => {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    const newSession = await buildSession(accessToken, refreshToken);
    setSession(newSession);
  }, [buildSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    setSession(null);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!session) return;

    try {
      const newTokens = await apiRequest<AuthTokens>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: session.refreshToken }),
        token: session.accessToken,
      });

      localStorage.setItem(STORAGE_KEYS.accessToken, newTokens.accessToken);
      localStorage.setItem(STORAGE_KEYS.refreshToken, newTokens.refreshToken);

      const refreshedSession = await buildSession(newTokens.accessToken, newTokens.refreshToken);
      setSession(refreshedSession);
    } catch {
      logout();
    }
  }, [session, buildSession, logout]);

  const setSellerProfile = useCallback((profile: SellerProfile) => {
    setSession((prev) => prev ? { ...prev, sellerId: profile.id, sellerProfile: profile } : null);
  }, []);

  return (
    <SellerContext.Provider value={{
      session,
      isLoading,
      isAuthenticated: session !== null,
      isSeller: session?.sellerId !== null && session?.sellerId !== undefined,
      login,
      logout,
      refreshSession,
      setSellerProfile,
    }}>
      {children}
    </SellerContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useSellerContext() {
  const context = useContext(SellerContext);
  if (!context) throw new Error('useSellerContext must be used inside <SellerProvider>');
  return context;
}
