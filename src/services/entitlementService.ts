import { User } from '../types/auth';
import {
  PlanType,
  FeatureKey,
  PlanFeatureConfig,
  Subscription,
  UsageMetric,
  EntitlementCheckResult
} from '../types/subscription';

export type { PlanType, FeatureKey, Subscription };

export const PLANS: Record<PlanType, PlanFeatureConfig> = {
  free: {
    name: 'Free Tier',
    description: 'For creators exploring KONTAGI creative intelligence.',
    priceMonthly: { inr: 0, usd: 0 },
    priceYearly: { inr: 0, usd: 0 },
    features: [
      'Script & Hook Intelligence',
      'Basic Creative Score (0-100)',
      'Hook & Body Script Review',
      'Limited AI Hook Improvements (3/day)',
      'Script Library (Up to 15 scripts)'
    ],
    entitlements: {
      script_analysis: true,
      hook_score: true,
      score_breakdown: true,
      script_review: true,
      ai_copilot_basic: true,
      predictive_retention: false,
      full_script_optimization: false,
      advanced_ai_optimization: false,
      version_comparison: false,
      premium_reports: false,
      export_data: false,
      unlimited_library: false
    },
    quotas: {
      dailyAnalyses: 3,
      dailyAiImprovements: 3,
      maxLibraryScripts: 15
    }
  },
  pro: {
    name: 'KONTAGI Pro',
    description: 'Complete creative intelligence engine for growth-focused creators.',
    priceMonthly: { inr: 1999, usd: 29 },
    priceYearly: { inr: 18999, usd: 279 }, // ~20% discount
    features: [
      'Everything in Free',
      'Predictive Retention Map (Second-by-Second)',
      'Full-Script AI Optimization & Rewrites',
      'Advanced AI Recommendations & Strategy',
      'Unlimited Script Analyses',
      'Unlimited AI Improvements',
      'Version Comparisons & Change Tracking',
      'Exportable Full Reports (.txt, .json)',
      'Priority AI Processing Queue'
    ],
    entitlements: {
      script_analysis: true,
      hook_score: true,
      score_breakdown: true,
      script_review: true,
      ai_copilot_basic: true,
      predictive_retention: true,
      full_script_optimization: true,
      advanced_ai_optimization: true,
      version_comparison: true,
      premium_reports: true,
      export_data: true,
      unlimited_library: true
    },
    quotas: {
      dailyAnalyses: -1,
      dailyAiImprovements: -1,
      maxLibraryScripts: -1
    }
  }
};

const USAGE_STORAGE_PREFIX = 'kontagi_usage_';
const SUBSCRIPTION_STORAGE_KEY = 'kontagi_active_sub';

export const entitlementService = {
  /**
   * Get active subscription for user.
   * Checks local cache first, or falls back to backend.
   */
  getSubscription(user: User | null): Subscription {
    if (!user) {
      return {
        userId: 'anonymous',
        plan: 'free',
        status: 'active',
        provider: 'none',
        billingInterval: 'monthly',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Check user-specific subscription cache
    try {
      const userSubRaw = localStorage.getItem(`${SUBSCRIPTION_STORAGE_KEY}_${user.id}`);
      if (userSubRaw) {
        const sub: Subscription = JSON.parse(userSubRaw);
        if (sub.userId === user.id && (sub.status === 'active' || sub.status === 'trialing')) {
          return sub;
        }
      }
    } catch (e) {
      console.warn('Failed to parse subscription cache:', e);
    }

    // Fallback to user profile plan (defaults to free if not pro)
    const userPlan = user.plan || 'free';
    return {
      userId: user.id,
      plan: userPlan,
      status: 'active',
      provider: 'none',
      billingInterval: 'monthly',
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * Save or update subscription locally and update user object
   */
  setSubscription(user: User | null, subscription: Subscription): void {
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
      if (user) {
        localStorage.setItem(`${SUBSCRIPTION_STORAGE_KEY}_${user.id}`, JSON.stringify(subscription));
      }
      // Update session user plan
      const sessionRaw = localStorage.getItem('kontagi_auth_session');
      if (sessionRaw) {
        const session = JSON.parse(sessionRaw);
        session.user.plan = subscription.plan;
        localStorage.setItem('kontagi_auth_session', JSON.stringify(session));
      }
    } catch (e) {
      console.error('Failed to set subscription cache:', e);
    }
  },

  /**
   * Check whether a user has access to a specific feature flag
   */
  canAccessFeature(user: User | null, feature: FeatureKey): EntitlementCheckResult {
    const sub = this.getSubscription(user);
    const planConfig = PLANS[sub.plan];

    if (!planConfig) {
      return { allowed: false, reason: 'Invalid plan', requiredPlan: 'pro' };
    }

    const hasAccess = !!planConfig.entitlements[feature];
    if (hasAccess) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Feature '${feature}' requires an active Pro subscription.`,
      requiredPlan: 'pro'
    };
  },

  /**
   * Get quota metrics for a user action (daily reset at midnight UTC)
   */
  getUsageMetric(user: User | null, action: 'script_analysis' | 'ai_improvement'): UsageMetric {
    const sub = this.getSubscription(user);
    const planConfig = PLANS[sub.plan];
    const limit = action === 'script_analysis'
      ? planConfig.quotas.dailyAnalyses
      : planConfig.quotas.dailyAiImprovements;

    // Pro users have unlimited
    if (limit === -1) {
      return {
        action,
        used: 0,
        limit: -1,
        resetAt: new Date(Date.now() + 86400000).toISOString(),
        allowed: true
      };
    }

    const userId = user ? user.id : 'anon';
    const todayKey = new Date().toISOString().split('T')[0];
    const storageKey = `${USAGE_STORAGE_PREFIX}${userId}_${action}_${todayKey}`;

    let used = 0;
    try {
      const val = localStorage.getItem(storageKey);
      if (val) used = parseInt(val, 10) || 0;
    } catch {
      used = 0;
    }

    // Reset date calculation (midnight next day)
    const tom = new Date();
    tom.setHours(24, 0, 0, 0);

    return {
      action,
      used,
      limit,
      resetAt: tom.toISOString(),
      allowed: used < limit
    };
  },

  /**
   * Consume 1 unit of quota for an action
   */
  consumeUsage(user: User | null, action: 'script_analysis' | 'ai_improvement'): UsageMetric {
    const metric = this.getUsageMetric(user, action);
    if (metric.limit === -1) return metric;

    const userId = user ? user.id : 'anon';
    const todayKey = new Date().toISOString().split('T')[0];
    const storageKey = `${USAGE_STORAGE_PREFIX}${userId}_${action}_${todayKey}`;

    const newUsed = metric.used + 1;
    try {
      localStorage.setItem(storageKey, newUsed.toString());
    } catch (e) {
      console.warn('Failed to save quota usage:', e);
    }

    return {
      ...metric,
      used: newUsed,
      allowed: newUsed <= metric.limit
    };
  },

  /**
   * Compatibility helpers for legacy AI Copilot view calls
   */
  async fetchPlan(token?: string, userId?: string): Promise<{ plan: PlanType; fullScriptQuota: number }> {
    const userObj = userId ? { id: userId } as User : null;
    const sub = this.getSubscription(userObj);
    return {
      plan: sub.plan,
      fullScriptQuota: sub.plan === 'pro' ? 999 : 3
    };
  },

  async upgradeToPro(token?: string, userId?: string): Promise<Subscription> {
    const userObj = userId ? { id: userId } as User : null;
    const sub: Subscription = {
      userId: userId || 'user',
      plan: 'pro',
      status: 'active',
      provider: 'test',
      billingInterval: 'monthly',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (userObj) {
      this.setSubscription(userObj, sub);
    }
    return sub;
  }
};
