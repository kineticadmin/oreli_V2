import { Hono } from 'hono';
import { stripe, STRIPE_WEBHOOK_SECRET } from '../lib/stripe.js';
import { prisma } from '../lib/prisma.js';
import { publishOrderStatusEvent } from '../services/orders/sse.service.js';
import type Stripe from 'stripe';

export const webhooksRouter = new Hono();

/**
 * POST /webhooks/stripe
 * Réception et vérification des événements Stripe.
 * La vérification de signature garantit que les événements viennent bien de Stripe.
 *
 * IMPORTANT : ce endpoint doit recevoir le body raw (non parsé par Hono)
 * pour que la vérification de signature fonctionne.
 */
webhooksRouter.post('/stripe', async (context) => {
  if (!STRIPE_WEBHOOK_SECRET) {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET manquant');
    return context.json({ error: 'Configuration manquante' }, 500);
  }

  const signature = context.req.header('stripe-signature');
  if (!signature) {
    return context.json({ error: 'Signature manquante' }, 400);
  }

  const rawBody = await context.req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return context.json({ error: 'Signature invalide' }, 400);
  }

  try {
    await handleStripeEvent(event);
  } catch (error) {
    // On log mais on répond 200 pour éviter que Stripe ne re-tente indéfiniment
    console.error(`[webhook] Erreur traitement événement ${event.type}:`, error);
  }

  return context.json({ received: true }, 200);
});

// ─── Handlers Stripe ──────────────────────────────────────────────────────

async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;

    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;

    default:
      // Événements non gérés — Stripe en envoie beaucoup, on ignore silencieusement
      break;
  }
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const orderId = paymentIntent.metadata['orderId'];
  if (!orderId) return;

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.status !== 'pending_payment') return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'paid' },
    });

    await tx.payment.create({
      data: {
        orderId,
        stripePaymentIntentId: paymentIntent.id,
        status: 'succeeded',
        amountCents: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        paidAt: new Date(),
      },
    });

    await tx.orderStatusEvent.create({
      data: {
        orderId,
        fromStatus: 'pending_payment',
        toStatus: 'paid',
        actorType: 'system',
        note: `Paiement Stripe confirmé (${paymentIntent.id})`,
      },
    });
  });

  await publishOrderStatusEvent({
    orderId,
    status: 'paid',
    timestamp: new Date().toISOString(),
  });
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
): Promise<void> {
  const orderId = paymentIntent.metadata['orderId'];
  if (!orderId) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order || order.status !== 'pending_payment') return;

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    // Libérer le stock réservé lors du paiement raté
    for (const item of order.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: { reservedQuantity: { decrement: item.quantity } },
      });
    }

    await tx.orderStatusEvent.create({
      data: {
        orderId,
        fromStatus: 'pending_payment',
        toStatus: 'cancelled',
        actorType: 'system',
        note: 'Paiement Stripe échoué',
      },
    });
  });

  await publishOrderStatusEvent({
    orderId,
    status: 'cancelled',
    timestamp: new Date().toISOString(),
    note: 'Paiement échoué',
  });
}
