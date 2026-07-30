import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/authenticate.js';
import * as adminController from './admin.controller.js';

// ──────────────────────────────────────────────
// Admin Metrics Routes — Launch Command Center
//
// Protected by authenticate + requireAdmin middleware.
// Unauthenticated: 401 Unauthorized
// Non-admin user: 403 Forbidden
// ──────────────────────────────────────────────

export function createAdminRouter(): Router {
  const router = Router();

  // Enforce admin authentication across all /api/admin routes
  router.use(authenticate, requireAdmin);

  router.get('/overview', adminController.getOverview);
  router.get('/system', adminController.getSystemHealth);
  router.get('/users', adminController.getLiveUsers);
  router.get('/ai', adminController.getAiMetrics);
  router.get('/api', adminController.getApiMetrics);
  router.get('/database', adminController.getDatabaseMetrics);
  router.get('/redis', adminController.getRedisMetrics);
  router.get('/server', adminController.getServerMetrics);
  router.get('/quota', adminController.getQuotaMetrics);
  router.get('/events', adminController.getRecentEvents);
  router.get('/errors', adminController.getRecentErrors);

  return router;
}
