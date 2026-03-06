import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError, ForbiddenError } from '../../lib/errors.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    relationship: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    giftingEvent: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from '../../lib/prisma.js';
import {
  listRelationships,
  createRelationship,
  deleteRelationship,
  createGiftingEvent,
  deleteGiftingEvent,
} from './relationships.service.js';

const mockPrisma = prisma as unknown as {
  relationship: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  giftingEvent: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const now = new Date();
const futureDate = new Date(now.getTime() + 10 * 86_400_000); // dans 10 jours

const baseRelationship = {
  id: 'rel-001',
  userId: 'user-001',
  displayName: 'Marie',
  relationshipType: 'friend',
  birthdate: null,
  preferences: {},
  affinityScore: 0.5,
  events: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

const baseEvent = {
  id: 'event-001',
  relationshipId: 'rel-001',
  userId: 'user-001',
  eventType: 'birthday',
  eventDate: futureDate,
  isRecurring: true,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── listRelationships ─────────────────────────────────────────────────────

describe('listRelationships', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne les proches de l\'utilisateur', async () => {
    mockPrisma.relationship.findMany.mockResolvedValue([baseRelationship]);
    const result = await listRelationships('user-001');
    expect(result).toHaveLength(1);
    expect(result[0]?.displayName).toBe('Marie');
  });

  it('inclut les événements dans les 90 prochains jours', async () => {
    mockPrisma.relationship.findMany.mockResolvedValue([
      { ...baseRelationship, events: [{ id: 'event-001', eventType: 'birthday', eventDate: futureDate }] },
    ]);

    const result = await listRelationships('user-001');
    expect(result[0]?.upcomingEvents).toHaveLength(1);
    expect(result[0]?.upcomingEvents[0]?.daysUntil).toBeGreaterThan(0);
    expect(result[0]?.upcomingEvents[0]?.daysUntil).toBeLessThanOrEqual(90);
  });

  it('exclut les événements à plus de 90 jours', async () => {
    const farFutureDate = new Date(now.getTime() + 200 * 86_400_000);
    // Repositionner à la même date mais l'an prochain pour simuler plus de 90 jours
    farFutureDate.setFullYear(now.getFullYear() + 1);

    mockPrisma.relationship.findMany.mockResolvedValue([
      { ...baseRelationship, events: [{ id: 'event-002', eventType: 'birthday', eventDate: farFutureDate }] },
    ]);

    const result = await listRelationships('user-001');
    // Les événements à plus de 90 jours sont filtrés
    expect(result[0]?.upcomingEvents).toHaveLength(0);
  });
});

// ─── createRelationship ────────────────────────────────────────────────────

describe('createRelationship', () => {
  beforeEach(() => vi.clearAllMocks());

  it('crée un proche et retourne son profil', async () => {
    mockPrisma.relationship.create.mockResolvedValue({ ...baseRelationship, events: [] });

    const result = await createRelationship('user-001', {
      displayName: 'Marie',
      relationshipType: 'friend',
    });

    expect(result.displayName).toBe('Marie');
    expect(result.upcomingEvents).toHaveLength(0);
  });
});

// ─── deleteRelationship ────────────────────────────────────────────────────

describe('deleteRelationship', () => {
  beforeEach(() => vi.clearAllMocks());

  it('supprime un proche appartenant à l\'utilisateur', async () => {
    mockPrisma.relationship.findUnique.mockResolvedValue({ userId: 'user-001' });
    mockPrisma.relationship.delete.mockResolvedValue({});

    await expect(deleteRelationship('user-001', 'rel-001')).resolves.toBeUndefined();
  });

  it('lance NotFoundError si le proche n\'existe pas', async () => {
    mockPrisma.relationship.findUnique.mockResolvedValue(null);
    await expect(deleteRelationship('user-001', 'rel-inconnu')).rejects.toThrow(NotFoundError);
  });

  it('lance ForbiddenError si le proche appartient à un autre utilisateur', async () => {
    mockPrisma.relationship.findUnique.mockResolvedValue({ userId: 'autre-user' });
    await expect(deleteRelationship('user-001', 'rel-001')).rejects.toThrow(ForbiddenError);
  });
});

// ─── createGiftingEvent ────────────────────────────────────────────────────

describe('createGiftingEvent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('crée un événement pour un proche existant', async () => {
    mockPrisma.relationship.findUnique.mockResolvedValue({ userId: 'user-001' });
    mockPrisma.giftingEvent.create.mockResolvedValue(baseEvent);

    const result = await createGiftingEvent('user-001', 'rel-001', {
      eventType: 'birthday',
      eventDate: futureDate.toISOString().split('T')[0]!,
    });

    expect(result.eventType).toBe('birthday');
    expect(result.daysUntil).toBeGreaterThan(0);
  });
});

// ─── deleteGiftingEvent ────────────────────────────────────────────────────

describe('deleteGiftingEvent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('supprime un événement appartenant au bon proche', async () => {
    mockPrisma.relationship.findUnique.mockResolvedValue({ userId: 'user-001' });
    mockPrisma.giftingEvent.findUnique.mockResolvedValue(baseEvent);
    mockPrisma.giftingEvent.delete.mockResolvedValue({});

    await expect(deleteGiftingEvent('user-001', 'rel-001', 'event-001')).resolves.toBeUndefined();
  });

  it('lance ForbiddenError si l\'événement appartient à un autre proche', async () => {
    mockPrisma.relationship.findUnique.mockResolvedValue({ userId: 'user-001' });
    mockPrisma.giftingEvent.findUnique.mockResolvedValue({
      ...baseEvent,
      relationshipId: 'autre-rel',
    });

    await expect(
      deleteGiftingEvent('user-001', 'rel-001', 'event-001'),
    ).rejects.toThrow(ForbiddenError);
  });
});
