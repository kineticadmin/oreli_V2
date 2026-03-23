import 'dotenv/config';
import { serve } from '@hono/node-server';
import { schedule } from 'node-cron';
import { buildApp } from './app.js';
import { redis } from './lib/redis.js';

const PORT = parseInt(process.env['PORT'] ?? '8080', 10);

const app = buildApp();

serve(
  { fetch: app.fetch, port: PORT },
  () => console.info(`[API] Oreli API démarrée sur http://localhost:${PORT}/api/v1`),
);

// Keepalive Redis — ping quotidien à 08h00 UTC pour éviter l'archivage Upstash
schedule('0 8 * * *', async () => {
  await redis.ping();
  console.info('[Cron] Redis keepalive OK');
});
