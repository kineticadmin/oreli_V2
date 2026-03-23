import { createMiddleware } from 'hono/factory';

export const requestLogger = createMiddleware(async (context, next) => {
  const startTime = Date.now();
  const { method, url } = context.req;

  await next();

  const durationMs = Date.now() - startTime;
  const statusCode = (context.res as { status?: number }).status ?? 200;

  console.log(`${method} ${url} → ${statusCode} (${durationMs}ms)`);
});
