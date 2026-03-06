import { productEmbeddingQueue } from '../lib/bullmq.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ProductEmbeddingJobData {
  productId: string;
  title: string;
  description: string;
}

// ─── Fonctions publiques ──────────────────────────────────────────────────

/**
 * Enfile un job asynchrone pour générer l'embedding pgvector d'un produit.
 * Le worker Vertex AI text-embedding-004 consommera ce job (implémenté en Phase 5+).
 * L'embedding est utilisé pour la recherche sémantique dans le moteur de recommandation.
 */
export async function enqueueProductEmbeddingJob(
  productId: string,
  title: string,
  description: string,
): Promise<void> {
  const jobData: ProductEmbeddingJobData = { productId, title, description };

  await productEmbeddingQueue.add('generate-embedding', jobData, {
    jobId: `embedding:${productId}`, // Idempotent — remplace le job précédent si en attente
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
  });
}
