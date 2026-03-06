import Redis from 'ioredis';

const REDIS_URL = process.env['REDIS_URL'];

if (!REDIS_URL) {
  throw new Error('Variable d\'environnement REDIS_URL manquante');
}

// Connexion principale — utilisée pour le cache et les opérations générales
export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy: (attempt) => {
    const maxDelayMs = 3000;
    const delayMs = Math.min(attempt * 200, maxDelayMs);
    return delayMs;
  },
  lazyConnect: false,
});

redis.on('error', (error) => {
  console.error('[Redis] Erreur de connexion :', error);
});

redis.on('connect', () => {
  console.info('[Redis] Connecté');
});

// Connexion dédiée aux subscriptions SSE (ioredis impose une connexion séparée
// pour les clients en mode subscriber — ils ne peuvent plus exécuter d'autres commandes)
export const redisSseSubscriber = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null, // Retry infini pour les SSE — connexion longue
  lazyConnect: true,
});
