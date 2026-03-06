import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundError, ForbiddenError } from '../../lib/errors.js';

vi.mock('../../lib/prisma.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    userAddress: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { prisma } from '../../lib/prisma.js';
import {
  getUserProfile,
  updateUserProfile,
  listUserAddresses,
  deleteUserAddress,
} from './users.service.js';

const mockPrisma = prisma as unknown as {
  user: { findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  userAddress: {
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  $transaction: ReturnType<typeof vi.fn>;
};

const baseUser = {
  id: 'user-001',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Dupont',
  phone: null,
  locale: 'fr',
  marketingConsent: false,
  createdAt: new Date('2026-01-01'),
};

const baseAddress = {
  id: 'addr-001',
  userId: 'user-001',
  label: 'Domicile',
  name: 'Alice Dupont',
  line: 'Rue de la Loi 1',
  city: 'Bruxelles',
  postalCode: '1000',
  country: 'BE',
  isDefault: true,
};

describe('getUserProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne le profil d\'un utilisateur existant', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(baseUser);
    const result = await getUserProfile('user-001');
    expect(result.email).toBe('alice@example.com');
    expect(result.firstName).toBe('Alice');
  });

  it('lance NotFoundError quand l\'utilisateur n\'existe pas', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(getUserProfile('user-inconnu')).rejects.toThrow(NotFoundError);
  });
});

describe('updateUserProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('met à jour seulement les champs fournis', async () => {
    mockPrisma.user.update.mockResolvedValue({ ...baseUser, firstName: 'Alicia' });
    const result = await updateUserProfile('user-001', { firstName: 'Alicia' });
    expect(result.firstName).toBe('Alicia');
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { firstName: 'Alicia' } }),
    );
  });
});

describe('listUserAddresses', () => {
  beforeEach(() => vi.clearAllMocks());

  it('retourne les adresses de l\'utilisateur', async () => {
    mockPrisma.userAddress.findMany.mockResolvedValue([baseAddress]);
    const result = await listUserAddresses('user-001');
    expect(result).toHaveLength(1);
    expect(result[0]?.city).toBe('Bruxelles');
  });
});

describe('deleteUserAddress', () => {
  beforeEach(() => vi.clearAllMocks());

  it('supprime une adresse appartenant à l\'utilisateur', async () => {
    mockPrisma.userAddress.findUnique.mockResolvedValue(baseAddress);
    mockPrisma.userAddress.delete = vi.fn().mockResolvedValue({});
    await expect(deleteUserAddress('user-001', 'addr-001')).resolves.toBeUndefined();
  });

  it('lance NotFoundError si l\'adresse n\'existe pas', async () => {
    mockPrisma.userAddress.findUnique.mockResolvedValue(null);
    await expect(deleteUserAddress('user-001', 'addr-inconnu')).rejects.toThrow(NotFoundError);
  });

  it('lance ForbiddenError si l\'adresse appartient à un autre utilisateur', async () => {
    mockPrisma.userAddress.findUnique.mockResolvedValue({ ...baseAddress, userId: 'autre-user' });
    await expect(deleteUserAddress('user-001', 'addr-001')).rejects.toThrow(ForbiddenError);
  });
});
