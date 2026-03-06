import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  createOrder,
  getOrderDetail,
} from '../services/orders/orders.service.js';
import {
  buildOrderChannelName,
  publishOrderStatusEvent,
  redisSseSubscriber,
} from '../services/orders/sse.service.js';

export const ordersRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
  deliveryAddress: z.object({
    name: z.string().min(1).max(200),
    line: z.string().min(1).max(500),
    city: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: z.string().length(2).default('BE'),
  }),
  requestedDeliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu: YYYY-MM-DD'),
  giftMessage: z.string().max(500).optional(),
  surpriseMode: z.enum(['total', 'controlled', 'manual']),
});

// ─── Routes ────────────────────────────────────────────────────────────────

/**
 * POST /orders
 * Crée une commande, réserve le stock, et crée un Stripe PaymentIntent.
 * Retourne le client_secret pour le PaymentSheet mobile.
 */
ordersRouter.post(
  '/',
  requireAuth,
  zValidator('json', createOrderSchema),
  async (context) => {
    const buyerUserId = context.get('authenticatedUserId');
    const input = context.req.valid('json');
    const result = await createOrder(buyerUserId, input);
    return context.json(result, 201);
  },
);

/**
 * GET /orders/:orderId
 * Détail d'une commande — accessible uniquement par l'acheteur.
 */
ordersRouter.get('/:orderId', requireAuth, async (context) => {
  const { orderId } = context.req.param();
  const buyerUserId = context.get('authenticatedUserId');
  const order = await getOrderDetail(orderId, buyerUserId);
  return context.json(order, 200);
});

/**
 * GET /orders/:orderId/track
 * SSE : flux temps réel des changements de statut de la commande.
 * Le client mobile maintient cette connexion ouverte pendant le suivi de livraison.
 */
ordersRouter.get('/:orderId/track', requireAuth, async (context) => {
  const { orderId } = context.req.param();
  const channelName = buildOrderChannelName(orderId);

  return streamSSE(context, async (stream) => {
    const messageHandler = (_channel: string, rawMessage: string) => {
      // streamSSE writeSSE est async — on fire-and-forget ici pour le handler Redis
      stream.writeSSE({ data: rawMessage, event: 'order-status' }).catch(() => {
        // Connexion client fermée — le cleanup s'en charge
      });
    };

    await redisSseSubscriber.subscribe(channelName);
    redisSseSubscriber.on('message', messageHandler);

    // Ping toutes les 25 secondes pour maintenir la connexion active
    // (les proxies ferment les connexions idle après ~30s)
    const PING_INTERVAL_MS = 25_000;
    let keepAlive = true;

    stream.onAbort(() => {
      keepAlive = false;
    });

    // Envoie l'état initial immédiatement à la connexion
    await stream.writeSSE({
      event: 'connected',
      data: JSON.stringify({ orderId, timestamp: new Date().toISOString() }),
    });

    while (keepAlive) {
      await stream.sleep(PING_INTERVAL_MS);
      if (!keepAlive) break;
      await stream.writeSSE({ event: 'ping', data: '' });
    }

    redisSseSubscriber.off('message', messageHandler);
    await redisSseSubscriber.unsubscribe(channelName);
  });
});

// Exposé pour les tests et le webhook Stripe
export { publishOrderStatusEvent };
