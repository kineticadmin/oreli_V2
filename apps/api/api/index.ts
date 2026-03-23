import { handle } from 'hono/vercel';
import { buildApp } from '../src/app';

export const config = { runtime: 'nodejs20.x' };

export default handle(buildApp());
