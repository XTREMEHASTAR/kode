import { getPrisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import type { UsageAction } from './usage.plans.js';

// ──────────────────────────────────────────────
// Usage Service — PostgreSQL Database Source of Truth
//
// Authoritative persistent store using Prisma (user_usages table).
// Enforces 24-hour rolling / midnight UTC daily resets.
// Atomic transactions prevent race conditions across parallel requests.
// ──────────────────────────────────────────────

export interface UsageSnapshot {
  action: UsageAction;
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
  isPro: boolean;
}

export interface FullUsageSnapshot {
  plan: string;
  isPro: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
  usage: UsageSnapshot[];
}

export class UsageService {
  private prisma = getPrisma();

  /**
   * Atomically check if the user has quota in PostgreSQL, and if so, increment.
   */
  async checkAndIncrement(
    userId: string,
    action: UsageAction,
    limit: number,
  ): Promise<{ used: number; remaining: number; limit: number; isExceeded: boolean; resetsAt: string }> {
    const resetsAt = this.getResetTime();

    // Unlimited plan (-1 limit)
    if (limit < 0) {
      return { used: 0, remaining: 99999, limit: -1, isExceeded: false, resetsAt };
    }

    const todayStr = this.getTodayUtcString();

    try {
      // Execute inside a database transaction to prevent parallel race conditions
      const result = await this.prisma.$transaction(async (tx) => {
        let usageRecord = await tx.userUsage.findUnique({
          where: { userId },
        });

        // If no record exists or if the record date is from a previous UTC day, reset the record
        if (!usageRecord || usageRecord.date !== todayStr) {
          usageRecord = await tx.userUsage.upsert({
            where: { userId },
            create: {
              userId,
              date: todayStr,
              scriptOptimizationsUsed: 0,
              hookOptimizationsUsed: 0,
              lastResetAt: new Date(),
            },
            update: {
              date: todayStr,
              scriptOptimizationsUsed: 0,
              hookOptimizationsUsed: 0,
              lastResetAt: new Date(),
            },
          });
        }

        const used = usageRecord.scriptOptimizationsUsed;

        // Quota check: if limit reached, do NOT increment
        if (used >= limit) {
          return {
            used,
            remaining: 0,
            limit,
            isExceeded: true,
          };
        }

        // Increment usage count atomically
        const updated = await tx.userUsage.update({
          where: { userId },
          data: {
            scriptOptimizationsUsed: { increment: 1 },
            updatedAt: new Date(),
          },
        });

        const newUsed = updated.scriptOptimizationsUsed;
        const remaining = Math.max(0, limit - newUsed);

        return {
          used: newUsed,
          remaining,
          limit,
          isExceeded: false,
        };
      });

      logger.info(
        { userId, action, used: result.used, limit: result.limit, remaining: result.remaining },
        result.isExceeded ? 'Usage limit exceeded' : 'Usage incremented in PostgreSQL',
      );

      return {
        ...result,
        resetsAt,
      };
    } catch (err) {
      logger.error({ err, userId, action }, 'Failed to process usage check in database');
      throw err;
    }
  }

  /**
   * Get current count for a single action from PostgreSQL.
   */
  async getCount(userId: string, _action: UsageAction): Promise<number> {
    const todayStr = this.getTodayUtcString();
    try {
      const usageRecord = await this.prisma.userUsage.findUnique({
        where: { userId },
      });

      if (!usageRecord || usageRecord.date !== todayStr) {
        return 0;
      }

      return usageRecord.scriptOptimizationsUsed;
    } catch (err) {
      logger.error({ err, userId, action: _action }, 'Failed to fetch usage count from database');
      return 0;
    }
  }

  /**
   * Get full usage snapshot for a user.
   */
  async getSnapshot(
    userId: string,
    limits: Record<UsageAction, number>,
    planName: string,
  ): Promise<FullUsageSnapshot> {
    const actions: UsageAction[] = ['analyses', 'rewrites', 'chats', 'exports'];
    const resetsAt = this.getResetTime();
    const isPro = planName.toLowerCase().includes('pro') || limits['analyses'] < 0;

    const todayStr = this.getTodayUtcString();
    const usageRecord = await this.prisma.userUsage.findUnique({
      where: { userId },
    });

    const currentUsed = (!usageRecord || usageRecord.date !== todayStr)
      ? 0
      : usageRecord.scriptOptimizationsUsed;

    const defaultLimit = limits['analyses'] ?? 3;
    const remaining = isPro ? 99999 : Math.max(0, defaultLimit - currentUsed);

    const usageSnapshots = actions.map((action): UsageSnapshot => {
      const limit = limits[action] ?? 3;
      const rem = isPro ? 99999 : Math.max(0, limit - currentUsed);
      return {
        action,
        used: currentUsed,
        limit,
        remaining: rem,
        resetsAt,
        isPro,
      };
    });

    return {
      plan: planName,
      isPro,
      used: currentUsed,
      limit: defaultLimit,
      remaining,
      resetsAt,
      usage: usageSnapshots,
    };
  }

  /**
   * Build a single-action snapshot (for response headers/meta).
   */
  buildActionSnapshot(
    action: UsageAction,
    used: number,
    limit: number,
  ): UsageSnapshot {
    const isPro = limit < 0;
    return {
      action,
      used,
      limit,
      remaining: isPro ? 99999 : Math.max(0, limit - used),
      resetsAt: this.getResetTime(),
      isPro,
    };
  }

  // ── Internals ─────────────────────────────────

  private getTodayUtcString(): string {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD in UTC
  }

  private getResetTime(): string {
    const now = new Date();
    const tomorrow = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
    ));
    return tomorrow.toISOString();
  }
}
