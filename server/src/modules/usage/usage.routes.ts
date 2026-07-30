import { Router } from 'express';
import { UsageController } from './usage.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

// ──────────────────────────────────────────────
// Usage Routes
// ──────────────────────────────────────────────

export function createUsageRouter(): Router {
  const router = Router();
  const usageController = new UsageController();

  // Current user's usage snapshot
  router.get('/', authenticate, usageController.getUsage);

  // List all available plans (public)
  router.get('/plans', usageController.getPlans);

  return router;
}
