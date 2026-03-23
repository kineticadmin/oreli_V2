import { handle } from 'hono/vercel';
import { buildApp } from '../src/app';

// Runtime Node.js 20 (requis pour Prisma, BullMQ, ioredis)
export const config = { runtime: 'nodejs20.x' };

export default handle(buildApp());
