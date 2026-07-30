import type { Request, Response, NextFunction } from 'express';
import { UsageService } from './usage.service.js';
import { resolvePlan, type UsageAction } from './usage.plans.js';

// ──────────────────────────────────────────────
// Usage Limit Middleware — PostgreSQL Backed
//
// Drops into any route to enforce daily limits.
// Checks and atomically increments PostgreSQL database usage.
// Responds with HTTP 429 when quota is exhausted.
// ──────────────────────────────────────────────

const usageService = new UsageService();

export function enforceUsageLimit(action: UsageAction) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Unauthenticated requests pass through to controller/rate-limiter
    if (!req.user) {
      return next();
    }

    const { userId, role } = req.user;
    const plan = resolvePlan(role);
    const limit = plan.limits[action] ?? 3;

    // Unlimited plan — skip enforcement
    if (limit < 0) {
      res.setHeader('X-Usage-Limit', '-1');
      res.setHeader('X-Usage-Remaining', '99999');
      return next();
    }

    try {
      const { used, remaining, isExceeded, resetsAt } = await usageService.checkAndIncrement(userId, action, limit);

      // Quota exhausted -> HTTP 429
      if (isExceeded) {
        res.setHeader('X-Usage-Limit', String(limit));
        res.setHeader('X-Usage-Remaining', '0');
        res.setHeader('X-Usage-Reset', resetsAt);

        res.status(429).json({
          success: false,
          code: 'FREE_TIER_LIMIT_REACHED',
          message: `Daily free ${action} limit reached (${limit}/${limit}). Resets at midnight UTC.`,
          used,
          limit,
          remaining: 0,
          resetAt: resetsAt,
          reason: 'Daily free quota exhausted',
          data: {
            used,
            limit,
            remaining: 0,
            resetAt: resetsAt,
            isPro: false,
            reason: 'Daily free quota exhausted',
          },
        });
        return;
      }

      // Quota available -> set headers & proceed
      res.setHeader('X-Usage-Limit', String(limit));
      res.setHeader('X-Usage-Remaining', String(remaining));
      res.setHeader('X-Usage-Reset', resetsAt);

      res.locals.usage = { used, remaining, limit, resetAt: resetsAt };
      next();
    } catch (err) {
      next(err);
    }
  };
}
