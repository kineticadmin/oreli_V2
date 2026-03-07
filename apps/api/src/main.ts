import 'dotenv/config';
import { serve } from '@hono/node-server';
import { buildApp } from './app.js';

const PORT = parseInt(process.env['PORT'] ?? '8080', 10);

const app = buildApp();

serve(
  { fetch: app.fetch, port: PORT },
  () => console.info(`[API] Oreli API démarrée sur http://localhost:${PORT}/api/v1`),
);
