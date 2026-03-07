'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminRequest, type AdminOrder } from '@/lib/api';

const STATUS_FILTERS = [
  { value: undefined, label: 'Toutes' },
  { value: 'paid', label: 'Payées' },
  { value: 'accepted', label: 'Acceptées' },
  { value: 'in_preparation', label: 'En préparation' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
  { value: 'pending_payment', label: 'En attente paiement' },
] as const;

const STATUS_COLOR: Record<string, string> = {
  paid: 'text-warning', accepted: 'text-success', in_preparation: 'text-success',
  shipped: 'text-cream', delivered: 'text-muted', cancelled: 'text-danger', pending_payment: 'text-muted',
};

function formatPrice(cents: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-BE', { style: 'currency', currency }).format(cents / 100);
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data: orders, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ['admin-orders', statusFilter],
    queryFn: () => adminRequest<AdminOrder[]>(`/orders${statusFilter ? `?status=${statusFilter}` : ''}`),
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Commandes</h1>
        <p className="text-muted text-sm mt-1">{orders?.length ?? 0} commande{(orders?.length ?? 0) !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button key={f.label} onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${statusFilter === f.value ? 'bg-gold text-obsidian font-medium' : 'bg-stone text-muted hover:text-cream'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>}

      {!isLoading && orders && orders.length > 0 && (
        <div className="bg-charcoal border border-warm rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm">
                {['Commande', 'Acheteur', 'Produit / Vendeur', 'Montant', 'Statut', 'Date'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-warm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone/30 transition-colors">
                  <td className="px-5 py-3 text-muted text-xs font-mono">{order.id.slice(0, 8)}…</td>
                  <td className="px-5 py-3">
                    <p className="text-cream text-sm">{order.buyerFirstName}</p>
                    <p className="text-muted text-xs">{order.buyerEmail}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-cream text-sm truncate max-w-xs">{order.firstItemTitle}</p>
                    <p className="text-muted text-xs">{order.sellerDisplayName}</p>
                  </td>
                  <td className="px-5 py-3 text-cream text-sm">{formatPrice(order.totalAmount, order.currency)}</td>
                  <td className="px-5 py-3"><span className={`text-sm ${STATUS_COLOR[order.status] ?? 'text-muted'}`}>{order.status}</span></td>
                  <td className="px-5 py-3 text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('fr-BE')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && orders?.length === 0 && (
        <div className="text-center py-20"><p className="text-muted text-sm">Aucune commande</p></div>
      )}
    </div>
  );
}
