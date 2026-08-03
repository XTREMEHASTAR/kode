import { Request, Response } from 'express';
import { IntelligenceOperatingSystem } from './intelligenceOperatingSystem.js';
import { QueueManager } from '../../queues/queueManager.js';

export class IntelligenceOSController {
  /**
   * POST /api/v1/intelligence-os/execute
   */
  public static async executeOS(req: Request, res: Response): Promise<void> {
    try {
      const { userId, creatorId, platform, title, scriptText, personaTier } = req.body;
      if (!userId) {
        res.status(400).json({ success: false, error: 'Missing userId parameter' });
        return;
      }

      const osResult = await IntelligenceOperatingSystem.executeFullOSWorkflow({
        userId,
        creatorId,
        platform,
        title,
        scriptText,
        personaTier
      });

      res.json({
        success: true,
        data: osResult
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/intelligence-os/status/:jobId
   */
  public static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const job = QueueManager.getJob(jobId);

      res.json({
        success: true,
        data: {
          jobId,
          status: job ? job.status : 'completed',
          progressPct: job ? job.progressPct : 100,
          activeSubsystemsCount: 14,
          health: 100
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/intelligence-os/queue/telemetry
   */
  public static async getQueueTelemetry(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = QueueManager.getMetrics();
      res.json({
        success: true,
        data: metrics
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/intelligence-os/queue/cancel
   */
  public static async cancelQueueJob(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.body;
      if (!jobId) {
        res.status(400).json({ success: false, error: 'Missing jobId parameter' });
        return;
      }

      const cancelled = QueueManager.cancelJob(jobId);
      res.json({
        success: true,
        data: { jobId, cancelled }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
