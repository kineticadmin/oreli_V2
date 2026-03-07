'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSellerContext } from '@/lib/seller-context';
import { apiRequest, ApiError, type AuthTokens } from '@/lib/api';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useSellerContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Mot de passe : 8 caractères minimum.');
      return;
    }

    setIsLoading(true);

    try {
      const tokens = await apiRequest<AuthTokens>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      await login(tokens.accessToken, tokens.refreshToken);
      router.replace('/onboarding');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur lors de l\'inscription. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gold tracking-tight">oreli</h1>
          <p className="text-muted text-sm mt-2">Espace vendeur</p>
        </div>

        <div className="bg-charcoal border border-warm rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-cream mb-6">Créer un compte</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm text-muted mb-1.5">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alice"
                  required
                  className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-muted mb-1.5">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  required
                  className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@boutique.com"
                required
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caractères minimum"
                required
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold text-obsidian font-semibold py-3 rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-muted text-sm mt-6">
            Déjà un compte ?{' '}
            <a href="/login" className="text-gold hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
