import type { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from './subscription.service.js';

// ──────────────────────────────────────────────
// Subscription Controller
// ──────────────────────────────────────────────

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  getSubscription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subscription = await this.subscriptionService.getSubscription(req.user!.userId);
      res.json({ success: true, data: subscription });
    } catch (error) {
      next(error);
    }
  };

  createCheckout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { plan } = req.body;
      const result = await this.subscriptionService.createCheckout(req.user!.userId, plan);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sessionId, paymentId, signature, provider } = req.body;
      const result = await this.subscriptionService.verifyPayment(req.user!.userId, {
        sessionId,
        paymentId,
        signature,
        provider
      });
      res.json({ success: result.success, data: result.subscription, error: result.error });
    } catch (error) {
      next(error);
    }
  };

  handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const signature = req.headers['stripe-signature'] as string || '';
      await this.subscriptionService.handleWebhook(req.body, signature);
      res.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  };

  cancel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.subscriptionService.cancel(req.user!.userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  resume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.subscriptionService.resume(req.user!.userId);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}
