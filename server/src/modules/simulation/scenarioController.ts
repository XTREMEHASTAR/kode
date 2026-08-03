import { Request, Response } from 'express';
import { ScenarioEngineService } from './scenarioEngineService.js';

export class ScenarioController {
  /**
   * POST /api/v1/scenarios/session
   */
  public static async createSession(req: Request, res: Response): Promise<void> {
    try {
      const { sessionName, creatorId, baseContentRefId, baselineName, baselineScores } = req.body;
      if (!sessionName || !baseContentRefId) {
        res.status(400).json({ success: false, error: 'Missing sessionName or baseContentRefId parameter' });
        return;
      }

      const session = await ScenarioEngineService.createComparisonSession({
        sessionName,
        creatorId,
        baseContentRefId,
        baselineName,
        baselineScores
      });

      res.json({
        success: true,
        data: session
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/scenarios/variant
   */
  public static async addVariant(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, variantName, modifications, overrideScores } = req.body;
      if (!sessionId || !variantName) {
        res.status(400).json({ success: false, error: 'Missing sessionId or variantName parameter' });
        return;
      }

      const variant = await ScenarioEngineService.addScenarioVariant({
        sessionId,
        variantName,
        modifications: modifications || {},
        overrideScores
      });

      res.json({
        success: true,
        data: variant
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/scenarios/session/:sessionId
   */
  public static async getSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req.params.sessionId as string;
      const session = ScenarioEngineService.getComparisonSession(sessionId);
      if (!session) {
        res.status(404).json({ success: false, error: 'Scenario comparison session not found' });
        return;
      }

      res.json({
        success: true,
        data: session
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
