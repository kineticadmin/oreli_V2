import Redis from 'ioredis';

const REDIS_URL = process.env['REDIS_URL'];

if (!REDIS_URL) {
  throw new Error('Variable d\'environnement REDIS_URL manquante');
}

// Connexion principale — utilisée pour le cache et les opérations générales
// maxRetriesPerRequest: 0 — ne pas attendre la reconnexion pour les commandes ponctuelles
// retryStrategy: s'arrête après 5 tentatives pour ne pas bloquer les fonctions serverless
export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 0,
  retryStrategy: (attempt) => {
    if (attempt > 5) return null; // Arrête les reconnexions après 5 tentatives
    const maxDelayMs = 2000;
    return Math.min(attempt * 200, maxDelayMs);
  },
  lazyConnect: true,
  connectTimeout: 5000,
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
