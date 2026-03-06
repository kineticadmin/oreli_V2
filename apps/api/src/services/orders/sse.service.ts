import { redis, redisSseSubscriber } from '../../lib/redis.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface OrderStatusEvent {
  orderId: string;
  status: string;
  timestamp: string;
  note?: string | undefined;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

/**
 * Publie un événement de changement de statut sur le canal Redis de la commande.
 * Le canal SSE ouvert par l'acheteur reçoit cet événement en temps réel.
 */
export async function publishOrderStatusEvent(event: OrderStatusEvent): Promise<void> {
  const channelName = buildOrderChannelName(event.orderId);
  await redis.publish(channelName, JSON.stringify(event));
}

export function buildOrderChannelName(orderId: string): string {
  return `order:${orderId}:status`;
}

export { redisSseSubscriber };
