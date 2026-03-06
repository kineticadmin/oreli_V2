import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  getUserProfile,
  updateUserProfile,
  listUserAddresses,
  createUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from '../services/users/users.service.js';

export const usersRouter = new Hono();

// ─── Schémas de validation ─────────────────────────────────────────────────

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().max(20).optional(),
  locale: z.enum(['fr', 'nl', 'en']).optional(),
  marketingConsent: z.boolean().optional(),
});

const createAddressSchema = z.object({
  label: z.string().max(50).optional(),
  name: z.string().min(1).max(200),
  line: z.string().min(1).max(500),
  city: z.string().min(1).max(100),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2).optional(),
  isDefault: z.boolean().optional(),
});

// ─── Routes (toutes authentifiées) ────────────────────────────────────────

usersRouter.use('*', requireAuth);

/** GET /users/me — Profil de l'utilisateur connecté */
usersRouter.get('/me', async (context) => {
  const userId = context.get('authenticatedUserId');
  const profile = await getUserProfile(userId);
  return context.json(profile, 200);
});

/** PATCH /users/me — Mise à jour partielle du profil */
usersRouter.patch('/me', zValidator('json', updateProfileSchema), async (context) => {
  const userId = context.get('authenticatedUserId');
  const input = context.req.valid('json');
  const profile = await updateUserProfile(userId, input);
  return context.json(profile, 200);
});

/** GET /users/me/addresses — Liste des adresses */
usersRouter.get('/me/addresses', async (context) => {
  const userId = context.get('authenticatedUserId');
  const addresses = await listUserAddresses(userId);
  return context.json(addresses, 200);
});

/** POST /users/me/addresses — Ajout d'une adresse */
usersRouter.post(
  '/me/addresses',
  zValidator('json', createAddressSchema),
  async (context) => {
    const userId = context.get('authenticatedUserId');
    const input = context.req.valid('json');
    const address = await createUserAddress(userId, input);
    return context.json(address, 201);
  },
);

/** PATCH /users/me/addresses/:addressId/default — Définir comme adresse par défaut */
usersRouter.patch('/me/addresses/:addressId/default', async (context) => {
  const userId = context.get('authenticatedUserId');
  const { addressId } = context.req.param();
  await setDefaultAddress(userId, addressId);
  return context.json({ success: true }, 200);
});

/** DELETE /users/me/addresses/:addressId — Suppression d'une adresse */
usersRouter.delete('/me/addresses/:addressId', async (context) => {
  const userId = context.get('authenticatedUserId');
  const { addressId } = context.req.param();
  await deleteUserAddress(userId, addressId);
  return context.body(null, 204);
});
