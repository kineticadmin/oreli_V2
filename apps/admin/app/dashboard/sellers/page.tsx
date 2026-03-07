'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRequest, type AdminSeller } from '@/lib/api';

const KYB_FILTERS = [
  { value: undefined, label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'submitted', label: 'Soumis' },
  { value: 'approved', label: 'Approuvés' },
  { value: 'rejected', label: 'Rejetés' },
] as const;

const KYB_COLOR: Record<string, string> = {
  pending: 'text-muted', submitted: 'text-warning', approved: 'text-success', rejected: 'text-danger',
};

export default function AdminSellersPage() {
  const queryClient = useQueryClient();
  const [kybFilter, setKybFilter] = useState<string | undefined>(undefined);
  const [rejectState, setRejectState] = useState<{ sellerId: string; note: string } | null>(null);

  const { data: sellers, isLoading } = useQuery<AdminSeller[]>({
    queryKey: ['admin-sellers', kybFilter],
    queryFn: () => adminRequest<AdminSeller[]>(`/sellers${kybFilter ? `?kybStatus=${kybFilter}` : ''}`),
  });

  const kybMutation = useMutation({
    mutationFn: ({ sellerId, status, note }: { sellerId: string; status: 'approved' | 'rejected'; note?: string }) =>
      adminRequest(`/sellers/${sellerId}/kyb`, {
        method: 'PATCH',
        body: JSON.stringify({ status, note }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sellers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setRejectState(null);
    },
  });

  function handleApprove(sellerId: string) {
    if (!confirm('Approuver ce vendeur ? La boutique sera activée immédiatement.')) return;
    kybMutation.mutate({ sellerId, status: 'approved' });
  }

  function handleRejectConfirm() {
    if (!rejectState) return;
    kybMutation.mutate({ sellerId: rejectState.sellerId, status: 'rejected', note: rejectState.note || undefined });
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Vendeurs / KYB</h1>
        <p className="text-muted text-sm mt-1">{sellers?.length ?? 0} vendeur{(sellers?.length ?? 0) !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {KYB_FILTERS.map((f) => (
          <button key={f.label} onClick={() => setKybFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${kybFilter === f.value ? 'bg-gold text-obsidian font-medium' : 'bg-stone text-muted hover:text-cream'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}

      {!isLoading && sellers && sellers.length > 0 && (
        <div className="space-y-3">
          {sellers.map((seller) => (
            <div key={seller.id} className="bg-charcoal border border-warm rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-cream font-semibold">{seller.displayName}</h3>
                    <span className={`text-xs font-medium ${KYB_COLOR[seller.kybStatus] ?? 'text-muted'}`}>
                      KYB : {seller.kybStatus}
                    </span>
                    {seller.status !== 'active' && (
                      <span className="text-xs text-warning">statut : {seller.status}</span>
                    )}
                  </div>
                  <div className="text-muted text-xs space-y-0.5">
                    {seller.ownerEmail && <p>Contact : {seller.ownerEmail}</p>}
                    {seller.legalName && <p>Raison sociale : {seller.legalName}</p>}
                    {seller.vatNumber && <p>TVA : {seller.vatNumber}</p>}
                    <p>
                      {seller.productCount} produit{seller.productCount !== 1 ? 's' : ''} &middot;{' '}
                      {seller.orderCount} commande{seller.orderCount !== 1 ? 's' : ''} &middot;{' '}
                      Score : {(seller.reliabilityScore * 100).toFixed(0)}%
                    </p>
                    <p>Inscrit le {new Date(seller.createdAt).toLocaleDateString('fr-BE')}</p>
                  </div>
                </div>

                {(seller.kybStatus === 'pending' || seller.kybStatus === 'submitted') && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(seller.id)}
                      disabled={kybMutation.isPending}
                      className="bg-success/10 text-success border border-success/30 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => setRejectState({ sellerId: seller.id, note: '' })}
                      className="bg-danger/10 text-danger border border-danger/30 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-danger/20 transition-colors"
                    >
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && sellers?.length === 0 && (
        <div className="text-center py-20"><p className="text-muted text-sm">Aucun vendeur</p></div>
      )}

      {/* Modal rejet */}
      {rejectState && (
        <div className="fixed inset-0 bg-obsidian/80 flex items-center justify-center p-4 z-50">
          <div className="bg-charcoal border border-warm rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-cream mb-4">Motif du rejet KYB</h3>
            <textarea
              value={rejectState.note}
              onChange={(e) => setRejectState({ ...rejectState, note: e.target.value })}
              placeholder="Raison du rejet (optionnel)..."
              rows={3}
              className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-danger resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setRejectState(null)} className="flex-1 bg-stone text-cream py-2.5 rounded-xl text-sm hover:bg-warm transition-colors">
                Annuler
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={kybMutation.isPending}
                className="flex-1 bg-danger text-cream py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-danger/80 transition-colors"
              >
                Rejeter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
