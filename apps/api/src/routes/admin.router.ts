import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAdmin } from '../middleware/admin.middleware.js';
import {
  getAdminStats,
  listAdminOrders,
  listAdminSellers,
  updateSellerKyb,
} from '../services/admin/admin.service.js';

export const adminRouter = new Hono();

// Toutes les routes admin exigent la clé API admin
adminRouter.use('*', requireAdmin);

// ─── Stats ────────────────────────────────────────────────────────────────

/** GET /admin/stats — KPIs globaux */
adminRouter.get('/stats', async (context) => {
  const stats = await getAdminStats();
  return context.json(stats, 200);
});

// ─── Commandes ────────────────────────────────────────────────────────────

const ordersQuerySchema = z.object({
  status: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

/** GET /admin/orders — Toutes les commandes (avec filtre optionnel) */
adminRouter.get('/orders', zValidator('query', ordersQuerySchema), async (context) => {
  const { status, limit } = context.req.valid('query');
  const orders = await listAdminOrders(status, limit ?? 50);
  return context.json(orders, 200);
});

// ─── Vendeurs ─────────────────────────────────────────────────────────────

const sellersQuerySchema = z.object({
  kybStatus: z.enum(['pending', 'submitted', 'approved', 'rejected']).optional(),
});

/** GET /admin/sellers — Liste des vendeurs (avec filtre KYB optionnel) */
adminRouter.get('/sellers', zValidator('query', sellersQuerySchema), async (context) => {
  const { kybStatus } = context.req.valid('query');
  const sellers = await listAdminSellers(kybStatus);
  return context.json(sellers, 200);
});

const kybUpdateSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  note: z.string().max(500).optional(),
});

/** PATCH /admin/sellers/:sellerId/kyb — Approuver ou rejeter un vendeur */
adminRouter.patch(
  '/sellers/:sellerId/kyb',
  zValidator('json', kybUpdateSchema),
  async (context) => {
    const { sellerId } = context.req.param();
    const { status, note } = context.req.valid('json');
    await updateSellerKyb(sellerId, status, note);
    return context.json({ success: true }, 200);
  },
);
