'use client';

import { useSellerContext } from '@/lib/seller-context';
import { useProducts } from '@/hooks/use-products';
import { useOrders } from '@/hooks/use-orders';
import { formatPrice } from '@/hooks/use-products';

export default function DashboardPage() {
  const { session } = useSellerContext();
  const { data: productsPage } = useProducts();
  const { data: orders } = useOrders();

  const activeProductCount = productsPage?.data.filter((p) => p.status === 'active').length ?? 0;
  const pendingOrderCount = orders?.filter((o) => o.status === 'paid').length ?? 0;
  const totalRevenueCents = orders
    ?.filter((o) => ['delivered', 'shipped', 'in_preparation', 'accepted'].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0) ?? 0;

  const sellerName = session?.sellerProfile?.displayName ?? 'Ma boutique';
  const kybStatus = session?.sellerProfile?.kybStatus ?? 'pending';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">{sellerName}</h1>
        <p className="text-muted text-sm mt-1">Vue d&apos;ensemble de votre boutique</p>
      </div>

      {/* KYB notice */}
      {kybStatus !== 'approved' && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl px-5 py-4 mb-6">
          <p className="text-warning text-sm font-medium">Vérification KYB en attente</p>
          <p className="text-muted text-sm mt-1">
            Votre boutique est en cours de vérification. Vos produits ne seront visibles qu&apos;après validation.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Produits actifs"
          value={String(activeProductCount)}
          description="dans le catalogue"
        />
        <StatCard
          label="Commandes à traiter"
          value={String(pendingOrderCount)}
          description="en attente d'acceptation"
          highlight={pendingOrderCount > 0}
        />
        <StatCard
          label="Chiffre d'affaires"
          value={formatPrice(totalRevenueCents)}
          description="commandes acceptées + livrées"
        />
      </div>

      {/* Commandes urgentes */}
      {pendingOrderCount > 0 && (
        <div className="bg-charcoal border border-warm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-cream">Commandes à accepter</h2>
            <a href="/dashboard/orders?status=paid" className="text-gold text-sm hover:underline">
              Voir toutes
            </a>
          </div>
          <p className="text-muted text-sm">
            {pendingOrderCount} commande{pendingOrderCount > 1 ? 's' : ''} attend{pendingOrderCount > 1 ? 'ent' : ''} votre confirmation.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  highlight = false,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-charcoal border rounded-2xl p-5 ${highlight ? 'border-warning/40' : 'border-warm'}`}>
      <p className="text-muted text-xs uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-2xl font-bold mb-1 ${highlight ? 'text-warning' : 'text-cream'}`}>{value}</p>
      <p className="text-muted text-xs">{description}</p>
    </div>
  );
}
