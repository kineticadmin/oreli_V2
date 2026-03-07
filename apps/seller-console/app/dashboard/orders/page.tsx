'use client';

import { useState } from 'react';
import { useOrders, useAcceptOrder, useRejectOrder, useShipOrder, ORDER_STATUS_CONFIG } from '@/hooks/use-orders';
import { formatPrice } from '@/hooks/use-products';

const STATUS_FILTERS = [
  { value: undefined, label: 'Toutes' },
  { value: 'paid', label: 'À accepter' },
  { value: 'accepted', label: 'Acceptées' },
  { value: 'in_preparation', label: 'En préparation' },
  { value: 'shipped', label: 'Expédiées' },
  { value: 'delivered', label: 'Livrées' },
] as const;

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [rejectState, setRejectState] = useState<{ orderId: string; reason: string } | null>(null);
  const [shipState, setShipState] = useState<{ orderId: string; trackingCode: string } | null>(null);

  const { data: orders, isLoading, error } = useOrders(statusFilter);
  const acceptOrder = useAcceptOrder();
  const rejectOrder = useRejectOrder();
  const shipOrder = useShipOrder();

  function handleAccept(orderId: string) {
    if (!confirm('Accepter cette commande ?')) return;
    acceptOrder.mutate(orderId);
  }

  function handleRejectConfirm() {
    if (!rejectState || !rejectState.reason.trim()) return;
    rejectOrder.mutate(
      { orderId: rejectState.orderId, reason: rejectState.reason },
      { onSuccess: () => setRejectState(null) },
    );
  }

  function handleShipConfirm() {
    if (!shipState || !shipState.trackingCode.trim()) return;
    shipOrder.mutate(
      { orderId: shipState.orderId, trackingCode: shipState.trackingCode },
      { onSuccess: () => setShipState(null) },
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cream">Commandes</h1>
        <p className="text-muted text-sm mt-1">{orders?.length ?? 0} commande{(orders?.length ?? 0) !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              statusFilter === filter.value
                ? 'bg-gold text-obsidian font-medium'
                : 'bg-stone text-muted hover:text-cream'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl px-5 py-4 text-danger text-sm">
          Impossible de charger les commandes.
        </div>
      )}

      {!isLoading && !error && (!orders || orders.length === 0) && (
        <div className="text-center py-20">
          <p className="text-muted text-sm">Aucune commande</p>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status] ?? {
              label: order.status,
              color: 'text-muted',
              bgColor: 'bg-stone',
            };

            return (
              <div key={order.id} className="bg-charcoal border border-warm rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig.color} ${statusConfig.bgColor}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('fr-BE')}</span>
                    </div>

                    <p className="text-cream text-sm font-medium">{order.buyerFirstName}</p>

                    <div className="mt-2 space-y-0.5">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-muted text-xs">
                          {item.quantity}× {item.productTitle}
                        </p>
                      ))}
                    </div>

                    {order.giftMessage && (
                      <p className="text-muted text-xs mt-2 italic">&quot;{order.giftMessage}&quot;</p>
                    )}

                    {order.fulfillment?.trackingCode && (
                      <p className="text-muted text-xs mt-1">Suivi : <span className="text-cream">{order.fulfillment.trackingCode}</span></p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-cream font-semibold">{formatPrice(order.totalAmount, order.currency)}</p>

                    <div className="flex flex-col gap-2 mt-3">
                      {order.status === 'paid' && (
                        <>
                          <button
                            onClick={() => handleAccept(order.id)}
                            disabled={acceptOrder.isPending}
                            className="bg-success/10 text-success border border-success/30 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50"
                          >
                            Accepter
                          </button>
                          <button
                            onClick={() => setRejectState({ orderId: order.id, reason: '' })}
                            className="bg-danger/10 text-danger border border-danger/30 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-danger/20 transition-colors"
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {(order.status === 'accepted' || order.status === 'in_preparation') && (
                        <button
                          onClick={() => setShipState({ orderId: order.id, trackingCode: '' })}
                          className="bg-stone text-cream border border-warm text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-warm transition-colors"
                        >
                          Marquer expédiée
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal refus */}
      {rejectState && (
        <div className="fixed inset-0 bg-obsidian/80 flex items-center justify-center p-4 z-50">
          <div className="bg-charcoal border border-warm rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-cream mb-4">Motif du refus</h3>
            <textarea
              value={rejectState.reason}
              onChange={(e) => setRejectState({ ...rejectState, reason: e.target.value })}
              placeholder="Expliquez pourquoi vous refusez cette commande..."
              rows={3}
              className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-danger resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectState(null)}
                className="flex-1 bg-stone text-cream py-2.5 rounded-xl text-sm hover:bg-warm transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={!rejectState.reason.trim() || rejectOrder.isPending}
                className="flex-1 bg-danger text-cream py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 hover:bg-danger/80 transition-colors"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal expédition */}
      {shipState && (
        <div className="fixed inset-0 bg-obsidian/80 flex items-center justify-center p-4 z-50">
          <div className="bg-charcoal border border-warm rounded-2xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-cream mb-4">Numéro de suivi</h3>
            <input
              type="text"
              value={shipState.trackingCode}
              onChange={(e) => setShipState({ ...shipState, trackingCode: e.target.value })}
              placeholder="ex. BE123456789BE"
              className="w-full bg-stone border border-warm rounded-xl px-4 py-3 text-cream placeholder-muted text-sm focus:outline-none focus:border-gold"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShipState(null)}
                className="flex-1 bg-stone text-cream py-2.5 rounded-xl text-sm hover:bg-warm transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleShipConfirm}
                disabled={!shipState.trackingCode.trim() || shipOrder.isPending}
                className="flex-1 bg-gold text-obsidian py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-gold/90 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
