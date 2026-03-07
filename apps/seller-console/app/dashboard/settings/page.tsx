'use client';

import { useState, useEffect } from 'react';
import { useSellerContext } from '@/lib/seller-context';
import { useUpdateSellerProfile, type UpdateSellerProfileInput } from '@/hooks/use-seller-profile';

export default function SettingsPage() {
  const { session } = useSellerContext();
  const profile = session?.sellerProfile;
  const updateProfile = useUpdateSellerProfile();

  const [displayName, setDisplayName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [slaPrepHours, setSlaPrepHours] = useState('');
  const [slaDeliveryHours, setSlaDeliveryHours] = useState('');
  const [cutoffTimeLocal, setCutoffTimeLocal] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName);
    setLegalName(profile.legalName ?? '');
    setVatNumber(profile.vatNumber ?? '');
    setSlaPrepHours(String(profile.policy?.slaPrepHours ?? 4));
    setSlaDeliveryHours(String(profile.policy?.slaDeliveryHours ?? 24));
    setCutoffTimeLocal(profile.policy?.cutoffTimeLocal ?? '17:00');
  }, [profile]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const input: UpdateSellerProfileInput = {
      displayName: displayName || undefined,
      legalName: legalName || undefined,
      vatNumber: vatNumber || undefined,
      slaPrepHours: slaPrepHours ? parseInt(slaPrepHours) : undefined,
      slaDeliveryHours: slaDeliveryHours ? parseInt(slaDeliveryHours) : undefined,
      cutoffTimeLocal: cutoffTimeLocal || undefined,
    };

    updateProfile.mutate(input, {
      onSuccess: () => {
        setSuccessMessage('Modifications enregistrées.');
        setTimeout(() => setSuccessMessage(null), 3000);
      },
    });
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Paramètres</h1>
        <p className="text-muted text-sm mt-1">Profil et politique de livraison</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profil public */}
        <section className="bg-charcoal border border-warm rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-cream uppercase tracking-wide">Profil</h2>

          <div>
            <label className="block text-xs text-muted mb-1.5">Nom de la boutique *</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
              maxLength={100}
              className="w-full bg-stone border border-warm rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">Raison sociale</label>
            <input
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              maxLength={200}
              className="w-full bg-stone border border-warm rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">Numéro de TVA</label>
            <input
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              maxLength={50}
              placeholder="BE0123456789"
              className="w-full bg-stone border border-warm rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold"
            />
          </div>
        </section>

        {/* Politique SLA */}
        <section className="bg-charcoal border border-warm rounded-2xl p-6 space-y-5">
          <h2 className="text-sm font-semibold text-cream uppercase tracking-wide">Politique de livraison</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">Délai de préparation (h)</label>
              <input
                type="number"
                value={slaPrepHours}
                onChange={(e) => setSlaPrepHours(e.target.value)}
                min={0}
                max={168}
                className="w-full bg-stone border border-warm rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">Délai de livraison (h)</label>
              <input
                type="number"
                value={slaDeliveryHours}
                onChange={(e) => setSlaDeliveryHours(e.target.value)}
                min={0}
                max={168}
                className="w-full bg-stone border border-warm rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1.5">Heure limite de commande</label>
            <input
              type="time"
              value={cutoffTimeLocal}
              onChange={(e) => setCutoffTimeLocal(e.target.value)}
              className="w-full bg-stone border border-warm rounded-xl px-4 py-2.5 text-cream text-sm focus:outline-none focus:border-gold"
            />
            <p className="text-muted text-xs mt-1">
              Les commandes reçues après cette heure seront traitées le lendemain.
            </p>
          </div>
        </section>

        {/* KYB status — read only */}
        <section className="bg-charcoal border border-warm rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-cream uppercase tracking-wide mb-4">Vérification KYB</h2>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${
              profile?.kybStatus === 'approved' ? 'text-success' :
              profile?.kybStatus === 'rejected' ? 'text-danger' :
              'text-warning'
            }`}>
              {profile?.kybStatus === 'approved' ? 'Vérifiée' :
               profile?.kybStatus === 'rejected' ? 'Refusée' :
               'En attente de vérification'}
            </span>
            <span className="text-muted text-xs">
              {profile?.kybStatus === 'approved'
                ? 'Votre identité a été vérifiée avec succès.'
                : 'Contactez support@oreli.ai pour accélérer la vérification.'}
            </span>
          </div>
        </section>

        {successMessage && (
          <p className="text-success text-sm">{successMessage}</p>
        )}

        {updateProfile.error && (
          <p className="text-danger text-sm">{updateProfile.error.message}</p>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="bg-gold text-obsidian font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {updateProfile.isPending ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
