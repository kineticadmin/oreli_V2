import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestLogger } from './middleware/logger.js';
import { handleError } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.router.js';
import { authRouter } from './routes/auth.router.js';
import { catalogRouter } from './routes/catalog.router.js';
import { sellerRouter } from './routes/seller.router.js';
import { giftRouter } from './routes/gift.router.js';
import { ordersRouter } from './routes/orders.router.js';
import { webhooksRouter } from './routes/webhooks.router.js';
import { usersRouter } from './routes/users.router.js';
import { relationshipsRouter } from './routes/relationships.router.js';
import { adminRouter } from './routes/admin.router.js';

const ALLOWED_ORIGINS = (process.env['ALLOWED_ORIGINS'] ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export function buildApp(): Hono {
  const app = new Hono().basePath('/api/v1');

  // ─── Middlewares globaux ───────────────────────────────────────────────

  app.use('*', cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['X-Request-Id'],
    credentials: true,
  }));

  app.use('*', requestLogger);

  // ─── Routes ───────────────────────────────────────────────────────────

  app.route('/health', healthRouter);
  app.route('/auth', authRouter);
  app.route('/catalog', catalogRouter);
  app.route('/sellers', sellerRouter);
  app.route('/gift', giftRouter);
  app.route('/orders', ordersRouter);
  app.route('/webhooks', webhooksRouter);
  app.route('/users', usersRouter);
  app.route('/relationships', relationshipsRouter);
  app.route('/admin', adminRouter);

  // ─── Gestion d'erreurs globale ─────────────────────────────────────────

  app.onError((error, context) => handleError(error, context));

  app.notFound((context) =>
    context.json({ code: 'NOT_FOUND', message: 'Route introuvable' }, 404),
  );

  return app;
}
