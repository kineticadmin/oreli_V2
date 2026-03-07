'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSellerContext } from '@/lib/seller-context';
import { apiRequest, ApiError, type SellerProfile, type AuthTokens } from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const { session, setSellerProfile, refreshSession } = useSellerContext();

  const [displayName, setDisplayName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Créer la boutique vendeur
      const profile = await apiRequest<SellerProfile>('/sellers', {
        method: 'POST',
        body: JSON.stringify({
          displayName: displayName.trim(),
          ...(legalName.trim() ? { legalName: legalName.trim() } : {}),
          ...(vatNumber.trim() ? { vatNumber: vatNumber.trim() } : {}),
        }),
        token: session?.accessToken,
      });

      // 2. Mettre à jour le profil dans le contexte
      setSellerProfile(profile);

      // 3. Rafraîchir le token pour obtenir role: 'seller' + sellerId dans le JWT
      await refreshSession();

      router.replace('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur lors de la création. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gold tracking-tight">oreli</h1>
          <p className="text-muted text-sm mt-2">Créez votre boutique</p>
        </div>

        <div className="bg-charcoal border border-warm rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-cream mb-2">Bienvenue sur Oreli</h2>
          <p className="text-muted text-sm mb-8">
            Configurez votre boutique pour commencer à vendre. Ces informations sont visibles par les acheteurs.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-muted mb-1.5">
                Nom de la boutique <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ma Boutique Créative"
                required
                minLength={2}
                maxLength={100}
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors"
              />
              <p className="text-muted text-xs mt-1">Affiché aux acheteurs sur les pages produit</p>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Raison sociale (optionnel)</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="SRL Ma Boutique"
                maxLength={200}
                className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-1.5">Numéro de TVA (optionnel)</label>
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="BE0123456789"
                maxLength={50}
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
              disabled={isLoading || !displayName.trim()}
              className="w-full bg-gold text-obsidian font-semibold py-3 rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création en cours...' : 'Créer ma boutique'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
