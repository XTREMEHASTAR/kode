import { createApp } from './app.js';
import { config } from './config/index.js';
import { getPrisma, disconnectPrisma } from './config/database.js';
import { connectRedis, disconnectRedis } from './config/redis.js';
import { initSentry } from './utils/sentry.js';
import { logger } from './utils/logger.js';

// ──────────────────────────────────────────────
// Kontagi Server — Entry Point
//
// Startup sequence:
//   1. Validate env (Zod — immediate crash if invalid)
//   2. Init Sentry
//   3. Connect PostgreSQL
//   4. Connect Redis
//   5. Create Express app
//   6. Listen
//
// Shutdown sequence:
//   1. Stop accepting new connections
//   2. Wait for in-flight requests to drain
//   3. Close database connections
//   4. Exit cleanly
// ──────────────────────────────────────────────

async function main(): Promise<void> {
  // 1. Validate environment (config/index.ts Zod parse already did this at import time)
  logger.info(
    { env: config.NODE_ENV, port: config.PORT },
    'Environment validated',
  );

  // 2. Init Sentry (no-op if DSN not set)
  initSentry();

  // 3. Connect to PostgreSQL via Prisma
  try {
    const prisma = getPrisma();
    await prisma.$connect();
    logger.info('PostgreSQL connected via Prisma');
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to connect to PostgreSQL');
    process.exit(1);
  }

  // 4. Connect to Redis
  try {
    await connectRedis();
  } catch (error) {
    logger.warn(
      { err: error },
      'Redis connection failed — rate limiting and token rotation will be degraded',
    );
  }

  // 5. Create and start Express app
  const app = createApp();

  const server = app.listen(config.PORT, () => {
    logger.info(
      {
        port: config.PORT,
        env: config.NODE_ENV,
        prefix: config.API_PREFIX,
        pid: process.pid,
        nodeVersion: process.version,
      },
      `🚀 Kontagi server listening on port ${config.PORT}`,
    );
  });

  // Configure server timeouts
  server.keepAliveTimeout = 65_000;     // Slightly above ALB's 60s default
  server.headersTimeout = 66_000;       // Must be > keepAliveTimeout
  server.requestTimeout = 120_000;      // 2 minutes for long AI requests

  // 6. Graceful Shutdown
  let isShuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) return; // Prevent double-shutdown
    isShuttingDown = true;

    logger.info({ signal }, 'Shutdown signal received — draining connections');

    // Stop accepting new connections, wait for in-flight to finish
    server.close(async () => {
      logger.info('HTTP server drained and closed');

      try {
        await Promise.allSettled([
          disconnectPrisma(),
          disconnectRedis(),
        ]);
        logger.info('All connections closed — clean exit');
        process.exit(0);
      } catch (error) {
        logger.error({ err: error }, 'Error during cleanup');
        process.exit(1);
      }
    });

    // Force exit after 15 seconds if drain doesn't complete
    const forceTimer = setTimeout(() => {
      logger.error('Forced shutdown — drain timeout exceeded (15s)');
      process.exit(1);
    }, 15_000);
    forceTimer.unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled errors — log and exit
  process.on('unhandledRejection', (reason) => {
    logger.fatal({ err: reason }, 'Unhandled promise rejection');
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    logger.fatal({ err: error }, 'Uncaught exception');
    process.exit(1);
  });
}

main().catch((error) => {
  console.error('Fatal startup error:', error);
  process.exit(1);
});
