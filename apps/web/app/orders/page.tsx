'use client';

import Link from 'next/link';
import { useBuyerOrders, formatOrderStatus } from '@/hooks/use-orders';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/hooks/use-catalog';

export default function OrdersPage() {
  const { session } = useAuth();
  const { data: orders, isLoading, error } = useBuyerOrders();

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-muted text-sm mb-4">Connectez-vous pour voir vos commandes.</p>
        <Link href="/auth" className="text-gold text-sm hover:underline">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-cream mb-8">Mes commandes</h1>

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
          <p className="text-muted text-sm mb-4">Aucune commande pour le moment.</p>
          <Link href="/catalog" className="text-gold text-sm hover:underline">
            Découvrir le catalogue
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const { label, color } = formatOrderStatus(order.status);
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-charcoal border border-warm rounded-2xl p-5 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-cream text-sm font-medium">
                      Commande #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-muted text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('fr-BE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-semibold text-sm">
                      {formatPrice(order.totalAmount, order.currency)}
                    </p>
                    <p className={`text-xs mt-0.5 ${color}`}>{label}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <p key={index} className="text-muted text-xs">
                      {item.quantity}× {item.productTitle}
                    </p>
                  ))}
                </div>

                {order.fulfillment?.trackingCode && (
                  <p className="text-muted text-xs mt-2">
                    Suivi : <span className="text-cream">{order.fulfillment.trackingCode}</span>
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
