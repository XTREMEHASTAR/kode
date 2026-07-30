import { Router } from 'express';
import { SubscriptionController } from './subscription.controller.js';
import { SubscriptionService } from './subscription.service.js';
import { authenticate } from '../../middleware/authenticate.js';

// ──────────────────────────────────────────────
// Subscription Routes
// ──────────────────────────────────────────────

export function createSubscriptionRouter(): Router {
  const router = Router();

  const subscriptionService = new SubscriptionService();
  const subscriptionController = new SubscriptionController(subscriptionService);

  // Webhook (no auth — verified by signature)
  router.post('/webhook', subscriptionController.handleWebhook);

  // Protected routes
  router.use(authenticate);

  router.get('/', subscriptionController.getSubscription);
  router.post('/checkout', subscriptionController.createCheckout);
  router.post('/verify', subscriptionController.verifyPayment);
  router.post('/cancel', subscriptionController.cancel);
  router.post('/resume', subscriptionController.resume);

  return router;
}
