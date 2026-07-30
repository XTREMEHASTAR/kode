import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

// ──────────────────────────────────────────────
// Prisma Client Singleton
// ──────────────────────────────────────────────

let prisma: PrismaClient;

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });

  // Forward Prisma logs to Pino
  client.$on('query', (e) => {
    logger.debug({ query: e.query, duration: e.duration }, 'prisma:query');
  });

  client.$on('error', (e) => {
    logger.error({ target: e.target, message: e.message }, 'prisma:error');
  });

  client.$on('warn', (e) => {
    logger.warn({ target: e.target, message: e.message }, 'prisma:warn');
  });

  return client;
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = createPrismaClient();
  }
  return prisma;
}

export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Prisma client disconnected');
  }
}
