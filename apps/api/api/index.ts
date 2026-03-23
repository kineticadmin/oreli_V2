import { handle } from 'hono/vercel';
import { buildApp } from '../src/app';

export const config = { runtime: 'nodejs' };

export default handle(buildApp());
