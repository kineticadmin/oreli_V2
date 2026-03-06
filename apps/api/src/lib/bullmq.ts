import { Queue, Worker, type ConnectionOptions } from 'bullmq';

const REDIS_URL = process.env['REDIS_URL'];

if (!REDIS_URL) {
  throw new Error('Variable d\'environnement REDIS_URL manquante');
}

// BullMQ utilise une URL Redis, pas une instance ioredis
const redisConnection: ConnectionOptions = { url: REDIS_URL };

// ─── Noms des queues (centralisés pour éviter les typos) ──────────────────

export const QUEUE_NAMES = {
  SEND_NOTIFICATION: 'send-notification',
  PRODUCT_EMBEDDING: 'product-embedding',
  EVENT_REMINDER: 'event-reminder',
  SLA_WATCHER: 'sla-watcher',
  PAYOUT_PROCESS: 'payout-process',
  ANALYTICS_EXPORT: 'analytics-export',
  RECOMMENDATION_LOG: 'recommendation-log',
} as const;

export type QueueName = typeof QUEUE_NAMES[keyof typeof QUEUE_NAMES];

// ─── Factory de queue ─────────────────────────────────────────────────────

export function createQueue(queueName: QueueName): Queue {
  return new Queue(queueName, {
    connection: redisConnection,
    defaultJobOptions: {
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  });
}

// ─── Factory de worker ────────────────────────────────────────────────────

export function createWorker(
  queueName: QueueName,
  processor: ConstructorParameters<typeof Worker>[1],
): Worker {
  return new Worker(queueName, processor, {
    connection: redisConnection,
    concurrency: 5,
  });
}

// ─── Queues instanciées ───────────────────────────────────────────────────

export const notificationQueue = createQueue(QUEUE_NAMES.SEND_NOTIFICATION);
export const productEmbeddingQueue = createQueue(QUEUE_NAMES.PRODUCT_EMBEDDING);
export const eventReminderQueue = createQueue(QUEUE_NAMES.EVENT_REMINDER);
export const recommendationLogQueue = createQueue(QUEUE_NAMES.RECOMMENDATION_LOG);
