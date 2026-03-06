import { prisma } from '../../lib/prisma.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../lib/errors.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  locale: string;
  marketingConsent: boolean;
  createdAt: Date;
}

export interface UpdateProfileInput {
  firstName?: string | undefined;
  lastName?: string | undefined;
  phone?: string | undefined;
  locale?: string | undefined;
  marketingConsent?: boolean | undefined;
}

export interface UserAddress {
  id: string;
  label: string;
  name: string;
  line: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressInput {
  label?: string | undefined;
  name: string;
  line: string;
  city: string;
  postalCode: string;
  country?: string | undefined;
  isDefault?: boolean | undefined;
}

// ─── Profil utilisateur ───────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      locale: true,
      marketingConsent: true,
      createdAt: true,
    },
  });

  if (!user) throw new NotFoundError('Utilisateur');
  return user;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName !== undefined && { firstName: input.firstName }),
      ...(input.lastName !== undefined && { lastName: input.lastName }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.locale !== undefined && { locale: input.locale }),
      ...(input.marketingConsent !== undefined && { marketingConsent: input.marketingConsent }),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      locale: true,
      marketingConsent: true,
      createdAt: true,
    },
  });

  return updatedUser;
}

// ─── Adresses ─────────────────────────────────────────────────────────────

export async function listUserAddresses(userId: string): Promise<UserAddress[]> {
  return prisma.userAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      label: true,
      name: true,
      line: true,
      city: true,
      postalCode: true,
      country: true,
      isDefault: true,
    },
  });
}

export async function createUserAddress(
  userId: string,
  input: CreateAddressInput,
): Promise<UserAddress> {
  const shouldBeDefault = input.isDefault ?? false;

  return prisma.$transaction(async (tx) => {
    // Si la nouvelle adresse est par défaut, retirer le flag des autres
    if (shouldBeDefault) {
      await tx.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return tx.userAddress.create({
      data: {
        userId,
        label: input.label ?? 'Domicile',
        name: input.name,
        line: input.line,
        city: input.city,
        postalCode: input.postalCode,
        country: input.country ?? 'BE',
        isDefault: shouldBeDefault,
      },
      select: {
        id: true, label: true, name: true, line: true,
        city: true, postalCode: true, country: true, isDefault: true,
      },
    });
  });
}

export async function deleteUserAddress(
  userId: string,
  addressId: string,
): Promise<void> {
  const address = await prisma.userAddress.findUnique({ where: { id: addressId } });

  if (!address) throw new NotFoundError('Adresse');
  if (address.userId !== userId) throw new ForbiddenError('Accès refusé à cette adresse');

  await prisma.userAddress.delete({ where: { id: addressId } });
}

export async function setDefaultAddress(
  userId: string,
  addressId: string,
): Promise<void> {
  const address = await prisma.userAddress.findUnique({ where: { id: addressId } });

  if (!address) throw new NotFoundError('Adresse');
  if (address.userId !== userId) throw new ForbiddenError('Accès refusé à cette adresse');

  await prisma.$transaction(async (tx) => {
    await tx.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
    await tx.userAddress.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  });
}
