import { prisma } from '../../lib/prisma.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRevenueCents: number;
  ordersByStatus: Record<string, number>;
  activeSellerCount: number;
  pendingKybCount: number;
  ordersLast7Days: number;
}

export interface AdminOrderSummary {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  buyerEmail: string;
  buyerFirstName: string;
  firstItemTitle: string;
  sellerDisplayName: string;
  createdAt: Date;
}

export interface AdminSellerSummary {
  id: string;
  displayName: string;
  legalName: string | null;
  vatNumber: string | null;
  status: string;
  kybStatus: string;
  reliabilityScore: number;
  productCount: number;
  orderCount: number;
  ownerEmail: string | null;
  createdAt: Date;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    totalOrders,
    revenueResult,
    ordersByStatusRaw,
    activeSellerCount,
    pendingKybCount,
    ordersLast7Days,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['paid', 'accepted', 'in_preparation', 'shipped', 'delivered'] } },
    }),
    prisma.order.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.seller.count({ where: { status: 'active' } }),
    prisma.seller.count({ where: { kybStatus: { in: ['pending', 'submitted'] } } }),
    prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
  ]);

  const ordersByStatus: Record<string, number> = {};
  for (const row of ordersByStatusRaw) {
    ordersByStatus[row.status] = row._count.id;
  }

  return {
    totalOrders,
    totalRevenueCents: revenueResult._sum.totalAmount ?? 0,
    ordersByStatus,
    activeSellerCount,
    pendingKybCount,
    ordersLast7Days,
  };
}

export async function listAdminOrders(
  statusFilter?: string | undefined,
  limit = 50,
): Promise<AdminOrderSummary[]> {
  const orders = await prisma.order.findMany({
    ...(statusFilter !== undefined ? { where: { status: statusFilter as never } } : {}),
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      buyer: { select: { email: true, firstName: true } },
      items: {
        take: 1,
        include: { product: { select: { title: true, seller: { select: { displayName: true } } } } },
      },
    },
  });

  return orders.map((order) => {
    const firstItem = order.items[0];
    return {
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      currency: order.currency,
      buyerEmail: order.buyer.email,
      buyerFirstName: order.buyer.firstName,
      firstItemTitle: firstItem?.product.title ?? 'Cadeau Oreli',
      sellerDisplayName: firstItem?.product.seller.displayName ?? '—',
      createdAt: order.createdAt,
    };
  });
}

export async function listAdminSellers(
  kybStatusFilter?: string | undefined,
): Promise<AdminSellerSummary[]> {
  const sellers = await prisma.seller.findMany({
    ...(kybStatusFilter !== undefined ? { where: { kybStatus: kybStatusFilter as never } } : {}),
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { products: true } },
      users: { select: { userId: true }, take: 1 },
    },
  });

  // Récupérer les emails des owners (SellerUser n'a pas de relation user dans le schéma)
  const ownerUserIds = sellers
    .map((s) => s.users[0]?.userId)
    .filter((id): id is string => id !== undefined);

  const ownerUsers = ownerUserIds.length > 0
    ? await prisma.user.findMany({
        where: { id: { in: ownerUserIds } },
        select: { id: true, email: true },
      })
    : [];

  const emailByUserId = Object.fromEntries(ownerUsers.map((u) => [u.id, u.email]));

  // Compter les commandes par vendeur
  const orderCountRows = await prisma.order.groupBy({
    by: ['buyerUserId'],
    _count: { id: true },
    where: { items: { some: { product: { sellerId: { in: sellers.map((s) => s.id) } } } } },
  });

  // Approche simplifiee : compter directement via produits
  const sellerOrderCounts = await Promise.all(
    sellers.map((seller) =>
      prisma.orderItem.count({ where: { product: { sellerId: seller.id } } }),
    ),
  );

  // Supprimer l'avertissement unused
  void orderCountRows;

  return sellers.map((seller, index) => ({
    id: seller.id,
    displayName: seller.displayName,
    legalName: seller.legalName ?? null,
    vatNumber: seller.vatNumber ?? null,
    status: seller.status,
    kybStatus: seller.kybStatus,
    reliabilityScore: seller.reliabilityScore,
    productCount: seller._count.products,
    orderCount: sellerOrderCounts[index] ?? 0,
    ownerEmail: emailByUserId[seller.users[0]?.userId ?? ''] ?? null,
    createdAt: seller.createdAt,
  }));
}

export async function updateSellerKyb(
  sellerId: string,
  newKybStatus: 'approved' | 'rejected',
  note?: string | undefined,
): Promise<void> {
  await prisma.seller.update({
    where: { id: sellerId },
    data: {
      kybStatus: newKybStatus,
      ...(newKybStatus === 'approved' ? { status: 'active' } : {}),
    },
  });

  console.info(`[admin] KYB ${newKybStatus} pour seller ${sellerId}${note ? ` — ${note}` : ''}`);
}
