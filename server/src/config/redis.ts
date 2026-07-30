import IORedis from 'ioredis';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

// ──────────────────────────────────────────────
// Redis Client Singleton
// ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redis: any = null;
let isRedisReady = false;

export function isRedisAvailable(): boolean {
  return isRedisReady;
}

export function getRedis(): IORedis.default {
  if (!redis) {
    // ioredis exports a class as default in ESM
    const RedisClient = (IORedis as unknown as { default: new (...args: unknown[]) => IORedis.default }).default ?? IORedis;
    redis = new (RedisClient as new (url: string, opts: object) => IORedis.default)(
      config.REDIS_URL,
      {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        retryStrategy: () => null, // Stop retrying immediately if Redis is unavailable
        lazyConnect: true,
      },
    );

    redis.on('connect', () => {
      isRedisReady = true;
      logger.info('Redis connected');
    });

    redis.on('error', (_err: Error) => {
      isRedisReady = false;
      // Silence continuous ECONNREFUSED error spam when running without local Redis
    });

    redis.on('close', () => {
      isRedisReady = false;
    });
  }

  return redis;
}

export async function connectRedis(): Promise<void> {
  try {
    const client = getRedis();
    await client.connect();
    isRedisReady = true;
  } catch (error) {
    isRedisReady = false;
    logger.warn('Redis offline — operating in graceful degradation mode (fail-open rate limiting)');
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
    } catch {}
    redis = null;
    isRedisReady = false;
    logger.info('Redis client disconnected');
  }
}
