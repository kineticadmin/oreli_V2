import { useMutation } from '@tanstack/react-query';
import { apiRequest, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

// ─── Types ────────────────────────────────────────────────────────────────

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const loginWithTokens = useAuthStore((state) => state.loginWithTokens);

  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiRequest<AuthTokensResponse>('/auth/login', {
        method: 'POST',
        body: input,
        authenticated: false,
      }),
    onSuccess: async (data) => {
      await loginWithTokens(data.accessToken, data.refreshToken);
    },
  });
}

export function useSignup() {
  const loginWithTokens = useAuthStore((state) => state.loginWithTokens);

  return useMutation({
    mutationFn: (input: SignupInput) =>
      apiRequest<AuthTokensResponse>('/auth/signup', {
        method: 'POST',
        body: input,
        authenticated: false,
      }),
    onSuccess: async (data) => {
      await loginWithTokens(data.accessToken, data.refreshToken);
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.userId); // Trigger re-read

  return useMutation({
    mutationFn: async () => {
      const { getRefreshToken } = await import('@/lib/api').then((m) => m.tokenStorage);
      const token = await getRefreshToken();
      await logout(token ?? '');
    },
  });
}

export { ApiError };
