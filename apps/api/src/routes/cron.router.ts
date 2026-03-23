import { Hono } from 'hono';
import { redis } from '../lib/redis.js';

export const cronRouter = new Hono();

// Appelé une fois par jour par Vercel Cron pour garder Redis actif
cronRouter.get('/keepalive', async (context) => {
  await redis.ping();
  return context.json({ status: 'ok' });
});
