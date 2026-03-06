import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationError, NotFoundError, ForbiddenError } from '../../lib/errors.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    $transaction: vi.fn(),
    order: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
    },
    inventory: {
      update: vi.fn(),
    },
    fulfillment: {
      create: vi.fn(),
      update: vi.fn(),
    },
    orderStatusEvent: {
      create: vi.fn(),
    },
    payment: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../lib/stripe.js', () => ({
  stripe: {
    paymentIntents: {
      create: vi.fn(),
      retrieve: vi.fn(),
    },
  },
  STRIPE_WEBHOOK_SECRET: 'whsec_test',
}));

vi.mock('./sse.service.js', () => ({
  publishOrderStatusEvent: vi.fn(),
}));

import { prisma } from '../../lib/prisma.js';
import { stripe } from '../../lib/stripe.js';
import {
  createOrder,
  getOrderDetail,
  listSellerOrders,
  acceptSellerOrder,
  rejectSellerOrder,
  shipSellerOrder,
} from './orders.service.js';

const mockPrisma = prisma as unknown as {
  $transaction: ReturnType<typeof vi.fn>;
  order: {
    findUnique: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  product: { findMany: ReturnType<typeof vi.fn> };
  inventory: { update: ReturnType<typeof vi.fn> };
};

const mockStripe = stripe as unknown as {
  paymentIntents: {
    create: ReturnType<typeof vi.fn>;
    retrieve: ReturnType<typeof vi.fn>;
  };
};

// ─── Fixtures ─────────────────────────────────────────────────────────────

const baseProduct = {
  id: 'prod-001',
  title: 'Bouquet premium',
  priceAmount: 5500,
  currency: 'EUR',
  status: 'active',
  sellerId: 'seller-001',
  seller: { id: 'seller-001', displayName: 'Fleuriste', status: 'active' },
  inventory: { stockQuantity: 10, reservedQuantity: 0 },
};

const baseOrder = {
  id: 'order-001',
  buyerUserId: 'user-001',
  status: 'paid',
  currency: 'EUR',
  itemsSubtotalAmount: 5500,
  serviceFeeAmount: 550,
  deliveryFeeAmount: 0,
  totalAmount: 6050,
  giftMessage: null,
  surpriseMode: 'manual',
  requestedDeliveryDate: new Date('2026-04-01'),
  deliveryAddressSnapshot: {},
  stripePaymentIntentId: 'pi_test_001',
  items: [{ id: 'item-001', productId: 'prod-001', quantity: 1, product: { sellerId: 'seller-001' } }],
  fulfillment: null,
  statusEvents: [],
  payment: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── createOrder ───────────────────────────────────────────────────────────

describe('createOrder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('crée une commande et retourne le client_secret Stripe', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseProduct]);
    mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
      return fn({
        inventory: { update: vi.fn() },
        order: { create: vi.fn().mockResolvedValue({ id: 'order-001' }) },
        orderStatusEvent: { create: vi.fn() },
      });
    });
    mockStripe.paymentIntents.create.mockResolvedValue({
      id: 'pi_test_001',
      client_secret: 'pi_test_001_secret',
    });
    mockPrisma.order.update = vi.fn().mockResolvedValue({});

    const result = await createOrder('user-001', {
      items: [{ productId: 'prod-001', quantity: 1 }],
      deliveryAddress: { name: 'Alice', line: 'Rue de la Loi 1', city: 'Bruxelles', postalCode: '1000', country: 'BE' },
      requestedDeliveryDate: '2026-04-01',
      surpriseMode: 'manual',
    });

    expect(result.orderId).toBe('order-001');
    expect(result.stripeClientSecret).toBe('pi_test_001_secret');
  });

  it('lance ValidationError quand un produit est indisponible', async () => {
    // Retourne moins de produits que demandés
    mockPrisma.product.findMany.mockResolvedValue([]);

    await expect(
      createOrder('user-001', {
        items: [{ productId: 'prod-inconnu', quantity: 1 }],
        deliveryAddress: { name: 'Alice', line: '...', city: 'BXL', postalCode: '1000', country: 'BE' },
        requestedDeliveryDate: '2026-04-01',
        surpriseMode: 'manual',
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('calcule correctement les montants (subtotal + 10% commission)', async () => {
    mockPrisma.product.findMany.mockResolvedValue([baseProduct]);

    let capturedOrderData: Record<string, unknown> = {};
    mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
      const fakeTx = {
        inventory: { update: vi.fn() },
        order: {
          create: vi.fn().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
            capturedOrderData = data;
            return { id: 'order-001' };
          }),
        },
        orderStatusEvent: { create: vi.fn() },
      };
      return fn(fakeTx);
    });
    mockStripe.paymentIntents.create.mockResolvedValue({ id: 'pi_1', client_secret: 'secret' });
    mockPrisma.order.update = vi.fn().mockResolvedValue({});

    await createOrder('user-001', {
      items: [{ productId: 'prod-001', quantity: 1 }],
      deliveryAddress: { name: 'Alice', line: '...', city: 'BXL', postalCode: '1000', country: 'BE' },
      requestedDeliveryDate: '2026-04-01',
      surpriseMode: 'manual',
    });

    // Prix 5500 + 10% = 550 → total 6050
    expect(capturedOrderData['itemsSubtotalAmount']).toBe(5500);
    expect(capturedOrderData['serviceFeeAmount']).toBe(550);
    expect(capturedOrderData['totalAmount']).toBe(6050);
  });
});

// ─── getOrderDetail ────────────────────────────────────────────────────────

describe('getOrderDetail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne le détail d\'une commande pour son acheteur', async () => {
    mockPrisma.order.findUnique.mockResolvedValue({
      ...baseOrder,
      items: [{ id: 'item-001', productSnapshot: {}, quantity: 1, unitPriceAmount: 5500 }],
    });
    mockStripe.paymentIntents.retrieve.mockResolvedValue({ client_secret: 'pi_secret' });

    const result = await getOrderDetail('order-001', 'user-001');

    expect(result.id).toBe('order-001');
    expect(result.totalAmount).toBe(6050);
  });

  it('lance NotFoundError quand la commande n\'existe pas', async () => {
    mockPrisma.order.findUnique.mockResolvedValue(null);

    await expect(getOrderDetail('order-inconnu', 'user-001')).rejects.toThrow(NotFoundError);
  });

  it('lance ForbiddenError quand l\'acheteur ne correspond pas', async () => {
    mockPrisma.order.findUnique.mockResolvedValue(baseOrder);

    await expect(getOrderDetail('order-001', 'autre-user')).rejects.toThrow(ForbiddenError);
  });
});

// ─── acceptSellerOrder ─────────────────────────────────────────────────────

describe('acceptSellerOrder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('accepte une commande au statut paid', async () => {
    mockPrisma.order.findUnique.mockResolvedValue(baseOrder);
    mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
      return fn({
        order: { update: vi.fn() },
        fulfillment: { create: vi.fn() },
        orderStatusEvent: { create: vi.fn() },
      });
    });

    await expect(acceptSellerOrder('seller-001', 'order-001')).resolves.toBeUndefined();
  });

  it('lance ValidationError si la commande n\'est pas payée', async () => {
    mockPrisma.order.findUnique.mockResolvedValue({ ...baseOrder, status: 'pending_payment' });

    await expect(acceptSellerOrder('seller-001', 'order-001')).rejects.toThrow(ValidationError);
  });

  it('lance ForbiddenError si la commande n\'appartient pas à ce vendeur', async () => {
    mockPrisma.order.findUnique.mockResolvedValue({
      ...baseOrder,
      items: [{ ...baseOrder.items[0], product: { sellerId: 'autre-seller' } }],
    });

    await expect(acceptSellerOrder('seller-001', 'order-001')).rejects.toThrow(ForbiddenError);
  });
});

// ─── rejectSellerOrder ─────────────────────────────────────────────────────

describe('rejectSellerOrder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejette une commande et libère le stock', async () => {
    mockPrisma.order.findUnique.mockResolvedValue(baseOrder);
    const inventoryUpdate = vi.fn();
    mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
      return fn({
        order: { update: vi.fn() },
        inventory: { update: inventoryUpdate },
        orderStatusEvent: { create: vi.fn() },
      });
    });

    await rejectSellerOrder('seller-001', 'order-001', 'Rupture de stock imprévue');

    expect(inventoryUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ data: { reservedQuantity: { decrement: 1 } } }),
    );
  });
});

// ─── shipSellerOrder ───────────────────────────────────────────────────────

describe('shipSellerOrder', () => {
  beforeEach(() => vi.clearAllMocks());

  it('expédie une commande avec un numéro de suivi', async () => {
    mockPrisma.order.findUnique.mockResolvedValue({ ...baseOrder, status: 'accepted' });
    mockPrisma.$transaction.mockImplementation(async (fn: Function) => {
      return fn({
        order: { update: vi.fn() },
        fulfillment: { update: vi.fn() },
        orderStatusEvent: { create: vi.fn() },
      });
    });

    await expect(shipSellerOrder('seller-001', 'order-001', 'BX123456')).resolves.toBeUndefined();
  });

  it('lance ValidationError si la commande n\'est pas acceptée', async () => {
    mockPrisma.order.findUnique.mockResolvedValue({ ...baseOrder, status: 'pending_payment' });

    await expect(shipSellerOrder('seller-001', 'order-001', 'BX123456')).rejects.toThrow(ValidationError);
  });
});
