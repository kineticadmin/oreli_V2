'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiRequest, type AuthTokens } from './api';

interface UserSession {
  accessToken: string;
  refreshToken: string;
}

interface AuthContextValue {
  session: UserSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCESS_TOKEN_KEY = 'oreli_web_access_token';
const REFRESH_TOKEN_KEY = 'oreli_web_refresh_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (accessToken && refreshToken) {
      setSession({ accessToken, refreshToken });
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const tokens = await apiRequest<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    persistSession(tokens);
  }

  async function signup(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<void> {
    const tokens = await apiRequest<AuthTokens>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    persistSession(tokens);
  }

  function logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setSession(null);
  }

  function persistSession(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    setSession({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
