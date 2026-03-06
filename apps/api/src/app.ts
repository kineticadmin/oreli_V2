import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { requestLogger } from './middleware/logger.js';
import { handleError } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.router.js';

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

  // Les routers suivants sont ajoutés au fil des phases :
  // app.route('/auth', authRouter);
  // app.route('/catalog', catalogRouter);
  // app.route('/gift', giftRouter);
  // app.route('/orders', ordersRouter);
  // app.route('/users', usersRouter);
  // app.route('/relationships', relationshipsRouter);
  // app.route('/seller', sellerRouter);
  // app.route('/webhooks', webhooksRouter);

  // ─── Gestion d'erreurs globale ─────────────────────────────────────────

  app.onError((error, context) => handleError(error, context));

  app.notFound((context) =>
    context.json({ code: 'NOT_FOUND', message: 'Route introuvable' }, 404),
  );

  return app;
}
