import type { Request, Response, NextFunction } from 'express';
import { UsageService } from './usage.service.js';
import { resolvePlan, USAGE_PLANS } from './usage.plans.js';

// ──────────────────────────────────────────────
// Usage Controller — Source of Truth API Endpoint
// ──────────────────────────────────────────────

const usageService = new UsageService();

export class UsageController {
  /**
   * GET /api/usage — Current user usage snapshot from PostgreSQL source of truth.
   */
  getUsage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, role } = req.user!;
      const plan = resolvePlan(role);

      const snapshot = await usageService.getSnapshot(
        userId,
        plan.limits,
        plan.name,
      );

      res.json({
        success: true,
        data: {
          used: snapshot.used,
          limit: snapshot.limit,
          remaining: snapshot.remaining,
          resetAt: snapshot.resetsAt,
          isPro: snapshot.isPro,
          plan: snapshot.plan,
          usage: snapshot.usage,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/usage/plans — List available plans and their limits.
   */
  getPlans = (_req: Request, res: Response): void => {
    const plans = Object.entries(USAGE_PLANS).map(([id, plan]) => ({
      id,
      name: plan.name,
      limits: Object.entries(plan.limits).map(([action, limit]) => ({
        action,
        dailyLimit: limit === -1 ? 'unlimited' : limit,
      })),
    }));

    res.json({
      success: true,
      data: plans,
    });
  };
}
