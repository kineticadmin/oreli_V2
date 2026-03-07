'use client';
import { useQuery } from '@tanstack/react-query';
import { adminRequest, type AdminStats } from '@/lib/api';

function formatPrice(cents: number) {
  return new Intl.NumberFormat('fr-BE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

const ORDER_STATUS_FR: Record<string, string> = {
  pending_payment: 'En attente paiement', paid: 'Payée', accepted: 'Acceptée',
  in_preparation: 'En préparation', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée',
};

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => adminRequest<AdminStats>('/stats'),
    refetchInterval: 60_000,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Vue d&apos;ensemble</h1>
        <p className="text-muted text-sm mt-1">Métriques globales Oreli</p>
      </div>

      {isLoading && <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}
      {error && <p className="text-danger text-sm">Erreur de chargement — vérifie la clé admin dans .env.local</p>}

      {stats && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Commandes totales" value={String(stats.totalOrders)} />
            <StatCard label="Revenu confirmé" value={formatPrice(stats.totalRevenueCents)} />
            <StatCard label="Commandes (7 jours)" value={String(stats.ordersLast7Days)} />
            <StatCard label="Vendeurs actifs" value={String(stats.activeSellerCount)} />
            <StatCard label="KYB en attente" value={String(stats.pendingKybCount)} highlight={stats.pendingKybCount > 0} />
          </div>

          <div className="bg-charcoal border border-warm rounded-2xl p-6">
            <h2 className="font-semibold text-cream mb-4">Commandes par statut</h2>
            <div className="space-y-2">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-muted text-sm">{ORDER_STATUS_FR[status] ?? status}</span>
                  <span className="text-cream text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`bg-charcoal border rounded-2xl p-5 ${highlight ? 'border-warning/40' : 'border-warm'}`}>
      <p className="text-muted text-xs uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-warning' : 'text-cream'}`}>{value}</p>
    </div>
  );
}
