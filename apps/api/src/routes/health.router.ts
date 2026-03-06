import { Hono } from 'hono';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

const healthRouter = new Hono();

healthRouter.get('/', async (context) => {
  // Vérification de la connectivité des dépendances critiques
  const [databaseStatus, redisStatus] = await Promise.allSettled([
    prisma.$queryRaw`SELECT 1`,
    redis.ping(),
  ]);

  const isHealthy =
    databaseStatus.status === 'fulfilled' &&
    redisStatus.status === 'fulfilled';

  const healthPayload = {
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env['npm_package_version'] ?? '0.0.1',
    dependencies: {
      database: databaseStatus.status === 'fulfilled' ? 'ok' : 'unreachable',
      redis: redisStatus.status === 'fulfilled' ? 'ok' : 'unreachable',
    },
  };

  return context.json(healthPayload, isHealthy ? 200 : 503);
});

export { healthRouter };
