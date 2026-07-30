import type { Request, Response, NextFunction } from 'express';
import { getRedis, isRedisAvailable } from '../config/redis.js';
import { TooManyRequestsError } from '../utils/apiError.js';

// ──────────────────────────────────────────────
// Redis-Backed Sliding Window Rate Limiter
// ──────────────────────────────────────────────

interface RateLimitOptions {
  /** Window size in milliseconds */
  windowMs: number;
  /** Maximum requests per window */
  maxRequests: number;
  /** Key prefix for Redis */
  keyPrefix?: string;
  /** Custom key extractor (default: IP address) */
  keyExtractor?: (req: Request) => string;
}

export function rateLimiter(options: RateLimitOptions) {
  const {
    windowMs,
    maxRequests,
    keyPrefix = 'rl',
    keyExtractor = (req) => req.ip ?? 'unknown',
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isRedisAvailable()) {
      next();
      return;
    }

    try {
      const redis = getRedis();
      const key = `${keyPrefix}:${keyExtractor(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Atomic sliding window using sorted set
      const pipeline = redis.pipeline();
      pipeline.zremrangebyscore(key, '-inf', windowStart);
      pipeline.zadd(key, now, `${now}:${Math.random().toString(36).slice(2, 8)}`);
      pipeline.zcard(key);
      pipeline.pexpire(key, windowMs);

      const results = await pipeline.exec();

      if (!results) {
        next();
        return;
      }

      const requestCount = results[2]?.[1] as number;

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestCount));
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

      if (requestCount > maxRequests) {
        throw new TooManyRequestsError('Rate limit exceeded. Please try again later.');
      }

      next();
    } catch (error) {
      if (error instanceof TooManyRequestsError) {
        next(error);
        return;
      }
      // If Redis is down, allow the request through (fail open)
      next();
    }
  };
}
