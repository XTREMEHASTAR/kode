import { Request, Response } from 'express';
import { DecisionIntelligenceService } from './decisionIntelligenceService.js';

export class DecisionController {
  /**
   * POST /api/v1/decisions/evaluate
   */
  public static async evaluateDecision(req: Request, res: Response): Promise<void> {
    try {
      const { jobId, simulationReport, creatorId } = req.body;
      if (!jobId || !simulationReport) {
        res.status(400).json({ success: false, error: 'Missing jobId or simulationReport parameter' });
        return;
      }

      const plan = await DecisionIntelligenceService.generateDecisionPlan({
        jobId,
        simulationReport,
        creatorId
      });

      res.json({
        success: true,
        data: plan
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/decisions/:jobId
   */
  public static async getPlan(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const plan = DecisionIntelligenceService.getDecisionPlan(jobId);
      if (!plan) {
        res.status(404).json({ success: false, error: 'Decision plan not found for jobId' });
        return;
      }

      res.json({
        success: true,
        data: plan
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
