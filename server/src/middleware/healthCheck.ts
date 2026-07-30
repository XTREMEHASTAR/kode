import type { Request, Response } from 'express';
import { getPrisma } from '../config/database.js';
import { getRedis } from '../config/redis.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

// ──────────────────────────────────────────────
// Health & Readiness Probes
//
// /health (liveness) — is the process alive?
// /ready  (readiness) — can it serve traffic?
//
// Compatible with Kubernetes liveness/readiness
// probes, Docker HEALTHCHECK, and ALB targets.
// ──────────────────────────────────────────────

const startedAt = new Date().toISOString();

/**
 * Liveness probe — returns 200 if the process is running.
 * Does NOT check dependencies (that's readiness).
 */
export function healthHandler(_req: Request, res: Response): void {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      startedAt,
      environment: config.NODE_ENV,
      version: process.env.APP_VERSION || '1.0.0',
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1_048_576),       // MB
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1_048_576),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1_048_576),
      },
    },
  });
}

/**
 * Readiness probe — checks all critical dependencies.
 * Returns 503 if any dependency is down.
 */
export async function readinessHandler(_req: Request, res: Response): Promise<void> {
  const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};
  let allHealthy = true;

  // ── PostgreSQL ────────────────────────────────
  try {
    const start = Date.now();
    const prisma = getPrisma();
    await prisma.$queryRaw`SELECT 1`;
    checks.database = {
      status: 'connected',
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    allHealthy = false;
    checks.database = {
      status: 'disconnected',
      error: error instanceof Error ? error.message : String(error),
    };
    logger.error({ err: error }, 'Readiness check: database unhealthy');
  }

  // ── Redis ─────────────────────────────────────
  try {
    const start = Date.now();
    const redis = getRedis();
    await redis.ping();
    checks.redis = {
      status: 'connected',
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    allHealthy = false;
    checks.redis = {
      status: 'disconnected',
      error: error instanceof Error ? error.message : String(error),
    };
    logger.error({ err: error }, 'Readiness check: redis unhealthy');
  }

  const statusCode = allHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: allHealthy,
    data: {
      status: allHealthy ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString(),
      checks,
    },
  });
}
