import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env['STRIPE_SECRET_KEY'];

if (!STRIPE_SECRET_KEY) {
  throw new Error('Variable d\'environnement STRIPE_SECRET_KEY manquante');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env['STRIPE_WEBHOOK_SECRET'];
