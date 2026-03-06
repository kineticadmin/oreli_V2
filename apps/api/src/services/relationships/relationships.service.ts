import { prisma, type Prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError } from '../../lib/errors.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface RelationshipSummary {
  id: string;
  displayName: string;
  relationshipType: string;
  birthdate: Date | null;
  preferences: unknown;
  affinityScore: number;
  upcomingEvents: { id: string; eventType: string; eventDate: Date; daysUntil: number }[];
  createdAt: Date;
}

export interface CreateRelationshipInput {
  displayName: string;
  relationshipType: string;
  birthdate?: string | undefined; // ISO date YYYY-MM-DD
  preferences?: Record<string, unknown> | undefined;
}

export interface UpdateRelationshipInput {
  displayName?: string | undefined;
  relationshipType?: string | undefined;
  birthdate?: string | undefined;
  preferences?: Record<string, unknown> | undefined;
}

export interface GiftingEventSummary {
  id: string;
  eventType: string;
  eventDate: Date;
  isRecurring: boolean;
  notes: string | null;
  daysUntil: number;
}

export interface CreateGiftingEventInput {
  eventType: string;
  eventDate: string; // ISO date YYYY-MM-DD
  isRecurring?: boolean | undefined;
  notes?: string | undefined;
}

// ─── Relationships ─────────────────────────────────────────────────────────

export async function listRelationships(userId: string): Promise<RelationshipSummary[]> {
  const relationships = await prisma.relationship.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: {
      events: {
        orderBy: { eventDate: 'asc' },
        select: { id: true, eventType: true, eventDate: true },
      },
    },
  });

  const now = new Date();
  return relationships.map((relationship) => ({
    id: relationship.id,
    displayName: relationship.displayName,
    relationshipType: relationship.relationshipType,
    birthdate: relationship.birthdate ?? null,
    preferences: relationship.preferences,
    affinityScore: relationship.affinityScore,
    upcomingEvents: relationship.events
      .map((event) => ({
        id: event.id,
        eventType: event.eventType,
        eventDate: event.eventDate,
        daysUntil: computeDaysUntilNextOccurrence(event.eventDate, now),
      }))
      .filter((event) => event.daysUntil <= 90) // Seulement les 90 prochains jours
      .sort((a, b) => a.daysUntil - b.daysUntil),
    createdAt: relationship.createdAt,
  }));
}

export async function createRelationship(
  userId: string,
  input: CreateRelationshipInput,
): Promise<RelationshipSummary> {
  const newRelationship = await prisma.relationship.create({
    data: {
      userId,
      displayName: input.displayName,
      relationshipType: input.relationshipType as never,
      ...(input.birthdate !== undefined && { birthdate: new Date(input.birthdate) }),
      preferences: (input.preferences ?? {}) as Prisma.InputJsonObject,
    },
    include: { events: true },
  });

  return {
    id: newRelationship.id,
    displayName: newRelationship.displayName,
    relationshipType: newRelationship.relationshipType,
    birthdate: newRelationship.birthdate ?? null,
    preferences: newRelationship.preferences,
    affinityScore: newRelationship.affinityScore,
    upcomingEvents: [],
    createdAt: newRelationship.createdAt,
  };
}

export async function updateRelationship(
  userId: string,
  relationshipId: string,
  input: UpdateRelationshipInput,
): Promise<RelationshipSummary> {
  await assertRelationshipOwnership(userId, relationshipId);

  await prisma.relationship.update({
    where: { id: relationshipId },
    data: {
      ...(input.displayName !== undefined && { displayName: input.displayName }),
      ...(input.relationshipType !== undefined && {
        relationshipType: input.relationshipType as never,
      }),
      ...(input.birthdate !== undefined && { birthdate: new Date(input.birthdate) }),
      ...(input.preferences !== undefined && {
        preferences: input.preferences as Prisma.InputJsonObject,
      }),
    },
  });

  // Fetch séparé pour obtenir les events avec typage correct
  const updated = await prisma.relationship.findUniqueOrThrow({
    where: { id: relationshipId },
    include: { events: { select: { id: true, eventType: true, eventDate: true } } },
  });

  const now = new Date();
  return {
    id: updated.id,
    displayName: updated.displayName,
    relationshipType: updated.relationshipType,
    birthdate: updated.birthdate ?? null,
    preferences: updated.preferences,
    affinityScore: updated.affinityScore,
    upcomingEvents: updated.events
      .map((event) => ({
        id: event.id,
        eventType: event.eventType,
        eventDate: event.eventDate,
        daysUntil: computeDaysUntilNextOccurrence(event.eventDate, now),
      }))
      .filter((event) => event.daysUntil <= 90),
    createdAt: updated.createdAt,
  };
}

export async function deleteRelationship(
  userId: string,
  relationshipId: string,
): Promise<void> {
  await assertRelationshipOwnership(userId, relationshipId);
  await prisma.relationship.delete({ where: { id: relationshipId } });
}

// ─── Gifting Events ────────────────────────────────────────────────────────

export async function listGiftingEvents(
  userId: string,
  relationshipId: string,
): Promise<GiftingEventSummary[]> {
  await assertRelationshipOwnership(userId, relationshipId);

  const events = await prisma.giftingEvent.findMany({
    where: { relationshipId },
    orderBy: { eventDate: 'asc' },
  });

  const now = new Date();
  return events.map((event) => ({
    id: event.id,
    eventType: event.eventType,
    eventDate: event.eventDate,
    isRecurring: event.isRecurring,
    notes: event.notes ?? null,
    daysUntil: computeDaysUntilNextOccurrence(event.eventDate, now),
  }));
}

export async function createGiftingEvent(
  userId: string,
  relationshipId: string,
  input: CreateGiftingEventInput,
): Promise<GiftingEventSummary> {
  await assertRelationshipOwnership(userId, relationshipId);

  const newEvent = await prisma.giftingEvent.create({
    data: {
      userId,
      relationshipId,
      eventType: input.eventType,
      eventDate: new Date(input.eventDate),
      isRecurring: input.isRecurring ?? true,
      notes: input.notes ?? null,
    },
  });

  const now = new Date();
  return {
    id: newEvent.id,
    eventType: newEvent.eventType,
    eventDate: newEvent.eventDate,
    isRecurring: newEvent.isRecurring,
    notes: newEvent.notes ?? null,
    daysUntil: computeDaysUntilNextOccurrence(newEvent.eventDate, now),
  };
}

export async function deleteGiftingEvent(
  userId: string,
  relationshipId: string,
  eventId: string,
): Promise<void> {
  await assertRelationshipOwnership(userId, relationshipId);

  const event = await prisma.giftingEvent.findUnique({ where: { id: eventId } });
  if (!event) throw new NotFoundError('Événement');
  if (event.relationshipId !== relationshipId) {
    throw new ForbiddenError('Accès refusé à cet événement');
  }

  await prisma.giftingEvent.delete({ where: { id: eventId } });
}

// ─── Helpers privés ───────────────────────────────────────────────────────

async function assertRelationshipOwnership(
  userId: string,
  relationshipId: string,
): Promise<void> {
  const relationship = await prisma.relationship.findUnique({
    where: { id: relationshipId },
    select: { userId: true },
  });

  if (!relationship) throw new NotFoundError('Proche');
  if (relationship.userId !== userId) throw new ForbiddenError('Accès refusé à ce proche');
}

/**
 * Calcule le nombre de jours jusqu'à la prochaine occurrence d'un événement.
 * Pour les événements récurrents annuels, projette à l'année suivante si déjà passé.
 */
function computeDaysUntilNextOccurrence(eventDate: Date, now: Date): number {
  const nextOccurrence = new Date(eventDate);
  nextOccurrence.setFullYear(now.getFullYear());

  // Si la date de cette année est déjà passée, on projette à l'année suivante
  if (nextOccurrence < now) {
    nextOccurrence.setFullYear(now.getFullYear() + 1);
  }

  const MILLISECONDS_PER_DAY = 86_400_000;
  return Math.ceil((nextOccurrence.getTime() - now.getTime()) / MILLISECONDS_PER_DAY);
}
