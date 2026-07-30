// ──────────────────────────────────────────────
// Usage Plans — Quota Definitions
//
// Add new plans here without changing any other
// code. The system resolves plan by user role or
// subscription tier.
// ──────────────────────────────────────────────

export type UsageAction = 'analyses' | 'rewrites' | 'chats' | 'exports';

export interface UsagePlan {
  name: string;
  limits: Record<UsageAction, number>;
}

/**
 * Plan registry. To add Pro/Enterprise, add entries here.
 * The rest of the system adapts automatically.
 */
export const USAGE_PLANS: Record<string, UsagePlan> = {
  free: {
    name: 'Free',
    limits: {
      analyses: 3,
      rewrites: 3,
      chats: 10,
      exports: 3,
    },
  },

  pro: {
    name: 'Pro',
    limits: {
      analyses: 100,
      rewrites: 50,
      chats: 500,
      exports: 50,
    },
  },

  enterprise: {
    name: 'Enterprise',
    limits: {
      analyses: -1,   // -1 = unlimited
      rewrites: -1,
      chats: -1,
      exports: -1,
    },
  },
} as const;

/**
 * Resolve a user's plan. Currently based on role;
 * swap this out for subscription lookup when ready.
 */
export function resolvePlan(userRole: string, _subscriptionTier?: string): UsagePlan {
  // Future: check subscriptionTier first
  // if (subscriptionTier && USAGE_PLANS[subscriptionTier]) {
  //   return USAGE_PLANS[subscriptionTier];
  // }

  if (userRole === 'ADMIN') {
    return USAGE_PLANS.enterprise;
  }

  return USAGE_PLANS.free;
}
