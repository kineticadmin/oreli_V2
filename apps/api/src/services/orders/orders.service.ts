import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../../lib/errors.js';
import { publishOrderStatusEvent } from './sse.service.js';

// ─── Constantes ────────────────────────────────────────────────────────────

// Commission Oreli sur chaque transaction (10%)
const SERVICE_FEE_RATE = 0.10;
// Délai d'acceptation vendeur après paiement (2 heures en millisecondes)
const SELLER_ACCEPT_DEADLINE_MS = 2 * 60 * 60 * 1_000;

// ─── Types ────────────────────────────────────────────────────────────────

export interface CreateOrderInput {
  items: { productId: string; quantity: number }[];
  deliveryAddress: {
    name: string;
    line: string;
    city: string;
    postalCode: string;
    country: string;
  };
  requestedDeliveryDate: string; // ISO date (YYYY-MM-DD)
  giftMessage?: string | undefined;
  surpriseMode: 'total' | 'controlled' | 'manual';
}

export interface OrderDetail {
  id: string;
  status: string;
  currency: string;
  itemsSubtotalAmount: number;
  serviceFeeAmount: number;
  deliveryFeeAmount: number;
  totalAmount: number;
  giftMessage: string | null;
  surpriseMode: string;
  requestedDeliveryDate: Date;
  deliveryAddressSnapshot: unknown;
  stripeClientSecret: string | null;
  items: {
    id: string;
    productSnapshot: unknown;
    quantity: number;
    unitPriceAmount: number;
  }[];
  statusEvents: {
    toStatus: string;
    actorType: string;
    note: string | null;
    createdAt: Date;
  }[];
  createdAt: Date;
}

export interface SellerOrderSummary {
  id: string;
  status: string;
  buyerFirstName: string;
  requestedDeliveryDate: Date;
  totalAmount: number;
  currency: string;
  giftMessage: string | null;
  items: { productTitle: string; quantity: number; unitPriceAmount: number }[];
  fulfillment: {
    id: string;
    status: string;
    acceptDeadline: Date;
    trackingCode: string | null;
  } | null;
  createdAt: Date;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export async function createOrder(
  buyerUserId: string,
  input: CreateOrderInput,
): Promise<{ orderId: string; stripeClientSecret: string }> {
  const productIds = input.items.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      status: 'active',
      seller: { status: 'active' },
    },
    include: { seller: true, inventory: true },
  });

  if (products.length !== productIds.length) {
    throw new ValidationError('Un ou plusieurs produits sont indisponibles');
  }

  // Calculer les montants avant la transaction
  const orderItems = input.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPriceAmount: product.priceAmount,
      productSnapshot: {
        id: product.id,
        title: product.title,
        priceAmount: product.priceAmount,
        currency: product.currency,
        sellerId: product.sellerId,
        sellerDisplayName: product.seller.displayName,
      },
    };
  });

  const itemsSubtotalAmount = orderItems.reduce(
    (sum, item) => sum + item.unitPriceAmount * item.quantity,
    0,
  );
  const serviceFeeAmount = Math.round(itemsSubtotalAmount * SERVICE_FEE_RATE);
  const totalAmount = itemsSubtotalAmount + serviceFeeAmount;

  // ─── Transaction DB : réservation de stock + création commande ────────────

  const createdOrder = await prisma.$transaction(async (tx) => {
    // Verrouillage exclusif de chaque ligne inventory pour éviter les race conditions
    for (const item of input.items) {
      const product = products.find((p) => p.id === item.productId)!;
      const inventory = product.inventory;

      if (!inventory) {
        throw new ValidationError(`Inventory introuvable pour le produit ${item.productId}`);
      }

      const availableStock = inventory.stockQuantity - inventory.reservedQuantity;
      if (availableStock < item.quantity) {
        throw new ValidationError(
          `Stock insuffisant pour "${product.title}" (disponible: ${availableStock})`,
        );
      }

      await tx.inventory.update({
        where: { productId: item.productId },
        data: { reservedQuantity: { increment: item.quantity } },
      });
    }

    const deliveryAddressSnapshot = {
      ...input.deliveryAddress,
      snapshotAt: new Date().toISOString(),
    };

    return tx.order.create({
      data: {
        buyerUserId,
        status: 'pending_payment',
        currency: 'EUR',
        itemsSubtotalAmount,
        serviceFeeAmount,
        deliveryFeeAmount: 0,
        totalAmount,
        giftMessage: input.giftMessage ?? null,
        surpriseMode: input.surpriseMode,
        requestedDeliveryDate: new Date(input.requestedDeliveryDate),
        deliveryAddressSnapshot,
        items: {
          create: orderItems,
        },
        statusEvents: {
          create: {
            toStatus: 'pending_payment',
            actorType: 'system',
            note: 'Commande créée — en attente de paiement',
          },
        },
      },
    });
  });

  // ─── Stripe PaymentIntent ──────────────────────────────────────────────────

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'eur',
    metadata: { orderId: createdOrder.id, buyerUserId },
    // PaymentSheet Expo Stripe attend ces paramètres
    automatic_payment_methods: { enabled: true },
  });

  await prisma.order.update({
    where: { id: createdOrder.id },
    data: { stripePaymentIntentId: paymentIntent.id },
  });

  return {
    orderId: createdOrder.id,
    stripeClientSecret: paymentIntent.client_secret!,
  };
}

export async function getOrderDetail(
  orderId: string,
  buyerUserId: string,
): Promise<OrderDetail> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      statusEvents: { orderBy: { createdAt: 'asc' } },
      payment: true,
    },
  });

  if (!order) throw new NotFoundError('Commande');

  if (order.buyerUserId !== buyerUserId) {
    throw new ForbiddenError('Accès refusé à cette commande');
  }

  const stripeClientSecret = order.stripePaymentIntentId
    ? await fetchStripeClientSecret(order.stripePaymentIntentId)
    : null;

  return {
    id: order.id,
    status: order.status,
    currency: order.currency,
    itemsSubtotalAmount: order.itemsSubtotalAmount,
    serviceFeeAmount: order.serviceFeeAmount,
    deliveryFeeAmount: order.deliveryFeeAmount,
    totalAmount: order.totalAmount,
    giftMessage: order.giftMessage ?? null,
    surpriseMode: order.surpriseMode,
    requestedDeliveryDate: order.requestedDeliveryDate,
    deliveryAddressSnapshot: order.deliveryAddressSnapshot,
    stripeClientSecret,
    items: order.items.map((item) => ({
      id: item.id,
      productSnapshot: item.productSnapshot,
      quantity: item.quantity,
      unitPriceAmount: item.unitPriceAmount,
    })),
    statusEvents: order.statusEvents.map((event) => ({
      toStatus: event.toStatus,
      actorType: event.actorType,
      note: event.note ?? null,
      createdAt: event.createdAt,
    })),
    createdAt: order.createdAt,
  };
}

export interface BuyerOrderSummary {
  id: string;
  status: string;
  currency: string;
  totalAmount: number;
  giftMessage: string | null;
  firstItemTitle: string;
  firstItemSellerName: string;
  createdAt: Date;
}

export async function listBuyerOrders(buyerUserId: string): Promise<BuyerOrderSummary[]> {
  const orders = await prisma.order.findMany({
    where: { buyerUserId },
    include: { items: { take: 1 } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return orders.map((order) => {
    const firstItem = order.items[0];
    const snapshot = firstItem?.productSnapshot as {
      title?: string;
      sellerDisplayName?: string;
    } | null;

    return {
      id: order.id,
      status: order.status,
      currency: order.currency,
      totalAmount: order.totalAmount,
      giftMessage: order.giftMessage ?? null,
      firstItemTitle: snapshot?.title ?? 'Cadeau Oreli',
      firstItemSellerName: snapshot?.sellerDisplayName ?? '',
      createdAt: order.createdAt,
    };
  });
}

export async function listSellerOrders(
  sellerId: string,
  statusFilter?: string | undefined,
): Promise<SellerOrderSummary[]> {
  const orders = await prisma.order.findMany({
    where: {
      items: { some: { product: { sellerId } } },
      ...(statusFilter !== undefined ? { status: statusFilter as never } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      buyer: { select: { firstName: true } },
      items: {
        where: { product: { sellerId } },
        include: { product: { select: { title: true } } },
      },
      fulfillment: true,
    },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    buyerFirstName: order.buyer.firstName,
    requestedDeliveryDate: order.requestedDeliveryDate,
    totalAmount: order.totalAmount,
    currency: order.currency,
    giftMessage: order.giftMessage ?? null,
    items: order.items.map((item) => ({
      productTitle: item.product.title,
      quantity: item.quantity,
      unitPriceAmount: item.unitPriceAmount,
    })),
    fulfillment: order.fulfillment
      ? {
          id: order.fulfillment.id,
          status: order.fulfillment.status,
          acceptDeadline: order.fulfillment.acceptDeadline,
          trackingCode: order.fulfillment.trackingCode ?? null,
        }
      : null,
    createdAt: order.createdAt,
  }));
}

export async function acceptSellerOrder(
  sellerId: string,
  orderId: string,
): Promise<void> {
  const order = await findOrderForSeller(orderId, sellerId);

  if (order.status !== 'paid') {
    throw new ValidationError('Seules les commandes payées peuvent être acceptées');
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'accepted' },
    });

    await tx.fulfillment.create({
      data: {
        orderId,
        sellerId,
        status: 'accepted',
        acceptDeadline: new Date(Date.now() + SELLER_ACCEPT_DEADLINE_MS),
      },
    });

    await tx.orderStatusEvent.create({
      data: {
        orderId,
        fromStatus: 'paid',
        toStatus: 'accepted',
        actorType: 'seller',
        actorId: sellerId,
      },
    });
  });

  await publishOrderStatusEvent({
    orderId,
    status: 'accepted',
    timestamp: new Date().toISOString(),
  });
}

export async function rejectSellerOrder(
  sellerId: string,
  orderId: string,
  reason: string,
): Promise<void> {
  const order = await findOrderForSeller(orderId, sellerId);

  if (order.status !== 'paid') {
    throw new ValidationError('Seules les commandes payées peuvent être rejetées');
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
    });

    // Libérer le stock réservé
    for (const item of order.items) {
      await tx.inventory.update({
        where: { productId: item.productId },
        data: { reservedQuantity: { decrement: item.quantity } },
      });
    }

    await tx.orderStatusEvent.create({
      data: {
        orderId,
        fromStatus: 'paid',
        toStatus: 'cancelled',
        actorType: 'seller',
        actorId: sellerId,
        note: reason,
      },
    });
  });

  await publishOrderStatusEvent({
    orderId,
    status: 'cancelled',
    timestamp: new Date().toISOString(),
    note: reason,
  });
}

export async function shipSellerOrder(
  sellerId: string,
  orderId: string,
  trackingCode: string,
): Promise<void> {
  const order = await findOrderForSeller(orderId, sellerId);

  if (order.status !== 'accepted' && order.status !== 'in_preparation') {
    throw new ValidationError('La commande doit être acceptée avant d\'être expédiée');
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'shipped' },
    });

    if (order.fulfillment) {
      await tx.fulfillment.update({
        where: { id: order.fulfillment.id },
        data: { status: 'shipped', trackingCode, shippedAt: new Date() },
      });
    }

    await tx.orderStatusEvent.create({
      data: {
        orderId,
        fromStatus: order.status as never,
        toStatus: 'shipped',
        actorType: 'seller',
        actorId: sellerId,
        note: `Numéro de suivi : ${trackingCode}`,
      },
    });
  });

  await publishOrderStatusEvent({
    orderId,
    status: 'shipped',
    timestamp: new Date().toISOString(),
    note: `Numéro de suivi : ${trackingCode}`,
  });
}

// ─── Helpers privés ───────────────────────────────────────────────────────

async function findOrderForSeller(orderId: string, sellerId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: { select: { sellerId: true } } } },
      fulfillment: true,
    },
  });

  if (!order) throw new NotFoundError('Commande');

  const belongsToSeller = order.items.some((item) => item.product.sellerId === sellerId);
  if (!belongsToSeller) {
    throw new ForbiddenError('Cette commande ne contient pas de produits de cette boutique');
  }

  return order;
}

async function fetchStripeClientSecret(
  paymentIntentId: string,
): Promise<string | null> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.client_secret;
  } catch {
    return null;
  }
}
