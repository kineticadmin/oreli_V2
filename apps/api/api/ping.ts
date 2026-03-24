export const config = { runtime: 'nodejs' };

export default function handler(request: Request): Response {
  return new Response(JSON.stringify({ pong: true, ts: Date.now() }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
