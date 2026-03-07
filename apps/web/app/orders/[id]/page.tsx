'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useBuyerOrder, formatOrderStatus } from '@/hooks/use-orders';
import { formatPrice } from '@/hooks/use-catalog';

const STATUS_STEPS = [
  'pending_payment',
  'paid',
  'accepted',
  'in_preparation',
  'shipped',
  'delivered',
] as const;

function OrderProgressBar({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus as typeof STATUS_STEPS[number]);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-danger/10 border border-danger/20 rounded-xl px-5 py-4 text-danger text-sm text-center">
        Commande annulée
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                isCompleted ? 'bg-gold' : 'bg-stone'
              } ${isCurrent ? 'ring-2 ring-gold/30' : ''}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useBuyerOrder(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <p className="text-muted text-sm mb-4">Commande introuvable.</p>
        <Link href="/orders" className="text-gold text-sm hover:underline">
          Mes commandes
        </Link>
      </div>
    );
  }

  const { label, color } = formatOrderStatus(order.status);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/orders" className="text-muted text-sm hover:text-cream transition-colors mb-8 inline-block">
        ← Mes commandes
      </Link>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-cream">
          Commande #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span className={`text-sm font-medium ${color}`}>{label}</span>
      </div>
      <p className="text-muted text-xs mb-6">
        Passée le{' '}
        {new Date(order.createdAt).toLocaleDateString('fr-BE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>

      {/* Barre de progression */}
      <div className="mb-8">
        <OrderProgressBar currentStatus={order.status} />
      </div>

      {/* Articles */}
      <div className="bg-charcoal border border-warm rounded-2xl p-5 mb-5">
        <h2 className="text-cream font-semibold mb-4 text-sm">Articles</h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-muted text-sm">
                {item.quantity}× {item.productTitle}
              </p>
              <p className="text-cream text-sm">
                {formatPrice(item.unitPriceAmount * item.quantity, order.currency)}
              </p>
            </div>
          ))}
          <div className="border-t border-warm pt-3 flex items-center justify-between">
            <p className="text-cream text-sm font-semibold">Total</p>
            <p className="text-gold font-bold">{formatPrice(order.totalAmount, order.currency)}</p>
          </div>
        </div>
      </div>

      {/* Livraison */}
      <div className="bg-charcoal border border-warm rounded-2xl p-5 mb-5">
        <h2 className="text-cream font-semibold mb-3 text-sm">Livraison</h2>
        <p className="text-muted text-sm">
          Date souhaitée :{' '}
          <span className="text-cream">
            {new Date(order.requestedDeliveryDate).toLocaleDateString('fr-BE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </p>
        {order.fulfillment?.trackingCode && (
          <p className="text-muted text-sm mt-2">
            Numéro de suivi :{' '}
            <span className="text-cream font-mono">{order.fulfillment.trackingCode}</span>
          </p>
        )}
      </div>

      {/* Message cadeau */}
      {order.giftMessage && (
        <div className="bg-charcoal border border-warm rounded-2xl p-5">
          <h2 className="text-cream font-semibold mb-2 text-sm">Message cadeau</h2>
          <p className="text-muted text-sm italic">"{order.giftMessage}"</p>
        </div>
      )}
    </div>
  );
}
