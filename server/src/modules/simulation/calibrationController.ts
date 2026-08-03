import { Request, Response } from 'express';
import { CalibrationRegistryService } from './calibrationRegistryService.js';

export class CalibrationController {
  /**
   * POST /api/v1/calibration/outcomes
   */
  public static async recordActuals(req: Request, res: Response): Promise<void> {
    try {
      const { jobId, creatorId, platform, publishedAt, realViews, realLikes, realShares, realRetention3s, realCompletionRate } = req.body;
      if (!jobId || !platform || realViews === undefined) {
        res.status(400).json({ success: false, error: 'Missing required jobId, platform, or realViews' });
        return;
      }

      const record = await CalibrationRegistryService.recordActualsAndCalibrate({
        jobId,
        creatorId,
        platform,
        publishedAt,
        realViews,
        realLikes,
        realShares,
        realRetention3s,
        realCompletionRate
      });

      res.json({
        success: true,
        data: record
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/calibration/stats
   */
  public static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const scope = req.query.scope as string | undefined;
      const stats = await CalibrationRegistryService.getCalibrationStats(scope);

      res.json({
        success: true,
        data: stats
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/calibration/weights
   */
  public static async getWeights(req: Request, res: Response): Promise<void> {
    try {
      const scope = (req.query.scope as any) || 'platform';
      const targetRefId = (req.query.targetRefId as string) || 'instagram';

      const weightSet = CalibrationRegistryService.getWeightSet(scope, targetRefId);
      res.json({
        success: true,
        data: weightSet
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
