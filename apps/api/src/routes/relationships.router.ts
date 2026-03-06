import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  listRelationships,
  createRelationship,
  updateRelationship,
  deleteRelationship,
  listGiftingEvents,
  createGiftingEvent,
  deleteGiftingEvent,
} from '../services/relationships/relationships.service.js';

export const relationshipsRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const VALID_RELATIONSHIP_TYPES = [
  'partner', 'friend', 'parent', 'child', 'colleague', 'other',
] as const;

const createRelationshipSchema = z.object({
  displayName: z.string().min(1).max(100),
  relationshipType: z.enum(VALID_RELATIONSHIP_TYPES),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  preferences: z.record(z.unknown()).optional(),
});

const updateRelationshipSchema = createRelationshipSchema.partial();

const createGiftingEventSchema = z.object({
  eventType: z.string().min(1).max(50),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format attendu : YYYY-MM-DD'),
  isRecurring: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

// ─── Routes (toutes authentifiées) ────────────────────────────────────────

relationshipsRouter.use('*', requireAuth);

/** GET /relationships — Liste tous les proches avec leurs événements à venir */
relationshipsRouter.get('/', async (context) => {
  const userId = context.get('authenticatedUserId');
  const relationships = await listRelationships(userId);
  return context.json(relationships, 200);
});

/** POST /relationships — Ajouter un proche */
relationshipsRouter.post(
  '/',
  zValidator('json', createRelationshipSchema),
  async (context) => {
    const userId = context.get('authenticatedUserId');
    const input = context.req.valid('json');
    const relationship = await createRelationship(userId, input);
    return context.json(relationship, 201);
  },
);

/** PATCH /relationships/:id — Mettre à jour un proche */
relationshipsRouter.patch(
  '/:relationshipId',
  zValidator('json', updateRelationshipSchema),
  async (context) => {
    const userId = context.get('authenticatedUserId');
    const { relationshipId } = context.req.param();
    const input = context.req.valid('json');
    const relationship = await updateRelationship(userId, relationshipId, input);
    return context.json(relationship, 200);
  },
);

/** DELETE /relationships/:id — Supprimer un proche (cascade events) */
relationshipsRouter.delete('/:relationshipId', async (context) => {
  const userId = context.get('authenticatedUserId');
  const { relationshipId } = context.req.param();
  await deleteRelationship(userId, relationshipId);
  return context.body(null, 204);
});

/** GET /relationships/:id/events — Événements d'un proche */
relationshipsRouter.get('/:relationshipId/events', async (context) => {
  const userId = context.get('authenticatedUserId');
  const { relationshipId } = context.req.param();
  const events = await listGiftingEvents(userId, relationshipId);
  return context.json(events, 200);
});

/** POST /relationships/:id/events — Ajouter un événement */
relationshipsRouter.post(
  '/:relationshipId/events',
  zValidator('json', createGiftingEventSchema),
  async (context) => {
    const userId = context.get('authenticatedUserId');
    const { relationshipId } = context.req.param();
    const input = context.req.valid('json');
    const event = await createGiftingEvent(userId, relationshipId, input);
    return context.json(event, 201);
  },
);

/** DELETE /relationships/:id/events/:eventId — Supprimer un événement */
relationshipsRouter.delete('/:relationshipId/events/:eventId', async (context) => {
  const userId = context.get('authenticatedUserId');
  const { relationshipId, eventId } = context.req.param();
  await deleteGiftingEvent(userId, relationshipId, eventId);
  return context.body(null, 204);
});
