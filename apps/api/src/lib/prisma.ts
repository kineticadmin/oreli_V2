import { PrismaClient } from '@oreli/prisma';

// Singleton Prisma — évite les connexions multiples en développement
// (le hot reload de tsx recréerait le client à chaque changement de fichier)
const globalForPrisma = globalThis as unknown as {
  prismaClient: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prismaClient ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development'
      ? ['query', 'warn', 'error']
      : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prismaClient = prisma;
}
