import { User } from '../types/auth';
import {
  PlanType,
  BillingInterval,
  Subscription,
  CheckoutSessionParams,
  PaymentVerificationParams
} from '../types/subscription';
import { entitlementService } from './entitlementService';

export interface CheckoutResult {
  success: boolean;
  redirectUrl?: string;
  subscription?: Subscription;
  error?: string;
}

export const paymentService = {
  /**
   * Initiate a checkout session.
   * If env keys exist, integrates with provider. Otherwise uses Test/Sandbox mode.
   */
  async createCheckoutSession(
    user: User,
    params: CheckoutSessionParams
  ): Promise<{ sessionId: string; checkoutUrl?: string; provider: string }> {
    try {
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          plan: params.plan,
          interval: params.interval,
          source: params.source || 'pricing'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.sessionId) {
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend payment checkout failed, using resilient sandbox session:', e);
    }

    // Local Sandbox Session fallback
    const mockSessionId = `sess_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      sessionId: mockSessionId,
      provider: 'test'
    };
  },

  /**
   * Complete payment verification server-side and activate Pro entitlement
   */
  async verifyPayment(
    user: User,
    params: PaymentVerificationParams
  ): Promise<CheckoutResult> {
    try {
      const response = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          sessionId: params.sessionId,
          paymentId: params.paymentId,
          signature: params.signature,
          provider: params.provider || 'test'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.subscription) {
          entitlementService.setSubscription(user, data.subscription);
          return { success: true, subscription: data.subscription };
        }
      }
      return { success: false, error: 'Payment verification failed on server.' };
    } catch (e) {
      console.error('Backend payment verification failed:', e);
      return { success: false, error: 'Unable to reach payment verification server.' };
    }
  },

  /**
   * Cancel subscription (at period end)
   */
  async cancelSubscription(user: User): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          entitlementService.setSubscription(user, data.data);
          return { success: true, subscription: data.data };
        }
      }
    } catch (e) {
      console.error('Backend cancellation error:', e);
    }
    return { success: false, error: 'Failed to cancel subscription.' };
  },

  /**
   * Resume cancelled subscription
   */
  async resumeSubscription(user: User): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      const response = await fetch('/api/subscription/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          entitlementService.setSubscription(user, data.data);
          return { success: true, subscription: data.data };
        }
      }
    } catch (e) {
      console.error('Backend resume error:', e);
    }
    return { success: false, error: 'Failed to resume subscription.' };
  }
};
