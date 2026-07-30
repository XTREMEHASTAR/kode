export type PlanType = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'expired';
export type PaymentProvider = 'razorpay' | 'stripe' | 'test' | 'none';
export type BillingInterval = 'monthly' | 'yearly';

export interface Subscription {
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  billingInterval: BillingInterval;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type FeatureKey =
  | 'script_analysis'
  | 'hook_score'
  | 'score_breakdown'
  | 'script_review'
  | 'ai_copilot_basic'
  | 'predictive_retention'
  | 'full_script_optimization'
  | 'advanced_ai_optimization'
  | 'version_comparison'
  | 'premium_reports'
  | 'export_data'
  | 'unlimited_library';

export interface PlanFeatureConfig {
  name: string;
  description: string;
  priceMonthly: {
    inr: number;
    usd: number;
  };
  priceYearly: {
    inr: number;
    usd: number;
  };
  features: string[];
  entitlements: Record<FeatureKey, boolean>;
  quotas: {
    dailyAnalyses: number; // -1 for unlimited
    dailyAiImprovements: number; // -1 for unlimited
    maxLibraryScripts: number; // -1 for unlimited
  };
}

export interface UsageMetric {
  action: 'script_analysis' | 'ai_improvement';
  used: number;
  limit: number; // -1 for unlimited
  resetAt: string; // ISO string
  allowed: boolean;
}

export interface EntitlementCheckResult {
  allowed: boolean;
  reason?: string;
  requiredPlan?: PlanType;
  remaining?: number;
  limit?: number;
}

export interface CheckoutSessionParams {
  plan: PlanType;
  interval: BillingInterval;
  source?: string;
}

export interface PaymentVerificationParams {
  sessionId: string;
  paymentId?: string;
  signature?: string;
  provider?: PaymentProvider;
}
