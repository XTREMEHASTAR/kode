import { Request, Response } from 'express';
import { ExplainabilityEngineService } from './explainabilityEngineService.js';

export class ExplainabilityController {
  /**
   * GET /api/v1/explainability/:jobId
   */
  public static async getReport(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      if (!jobId) {
        res.status(400).json({ success: false, error: 'Missing jobId parameter' });
        return;
      }

      const report = ExplainabilityEngineService.getExplainabilityReport(jobId);
      if (!report) {
        res.status(404).json({ success: false, error: 'Explainability report not found for jobId' });
        return;
      }

      res.json({
        success: true,
        data: report
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
