import { Request, Response } from 'express';
import { BenchmarkIntelligenceService } from './benchmarkIntelligenceService.js';

export class BenchmarkController {
  /**
   * POST /api/v1/benchmarks/evaluate
   */
  public static async evaluateBenchmark(req: Request, res: Response): Promise<void> {
    try {
      const { contentRefId, platform, category, country, rawScores } = req.body;
      if (!contentRefId) {
        res.status(400).json({ success: false, error: 'Missing contentRefId parameter' });
        return;
      }

      const result = await BenchmarkIntelligenceService.evaluateAssetBenchmark({
        contentRefId,
        platform,
        category,
        country,
        rawScores
      });

      res.json({
        success: true,
        data: result
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/benchmarks/distributions
   */
  public static async getDistributions(_req: Request, res: Response): Promise<void> {
    try {
      const distributions = BenchmarkIntelligenceService.getDistributions();
      res.json({
        success: true,
        data: distributions
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/benchmarks/history/:contentRefId
   */
  public static async getHistory(req: Request, res: Response): Promise<void> {
    try {
      const contentRefId = req.params.contentRefId as string;
      const record = BenchmarkIntelligenceService.getEvaluationRecord(contentRefId);
      if (!record) {
        res.status(404).json({ success: false, error: 'Benchmark evaluation record not found' });
        return;
      }

      res.json({
        success: true,
        data: record
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
