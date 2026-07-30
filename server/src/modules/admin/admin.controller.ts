import type { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service.js';

// ──────────────────────────────────────────────
// Admin Metrics Controller
// ──────────────────────────────────────────────

export async function getOverview(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getOverview();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getSystemHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getSystemHealth();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getLiveUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getLiveUsers();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getAiMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getAiMetrics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getApiMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getApiMetrics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getDatabaseMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getDatabaseMetrics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getRedisMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getRedisMetrics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getServerMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getServerMetrics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getQuotaMetrics(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getQuotaMetrics();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getRecentEvents(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getRecentEvents();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getRecentErrors(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await adminService.getRecentErrors();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
