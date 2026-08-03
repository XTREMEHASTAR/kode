import { Request, Response } from 'express';
import { CreatorTwinEngineService } from './creatorTwinEngineService.js';

export class CreatorTwinController {
  /**
   * POST /api/v1/creator-twin/initialize
   */
  public static async initializeTwin(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId, handle, twinName, nicheCategory } = req.body;
      if (!creatorId) {
        res.status(400).json({ success: false, error: 'Missing creatorId parameter' });
        return;
      }

      const twin = await CreatorTwinEngineService.getOrCreateTwin({
        creatorId,
        handle,
        twinName,
        nicheCategory
      });

      res.json({
        success: true,
        data: twin
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/creator-twin/learn
   */
  public static async learnFromSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { creatorId, simulationReport } = req.body;
      if (!creatorId || !simulationReport) {
        res.status(400).json({ success: false, error: 'Missing creatorId or simulationReport parameter' });
        return;
      }

      const twin = await CreatorTwinEngineService.learnFromSimulation(creatorId, simulationReport);

      res.json({
        success: true,
        data: twin
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/creator-twin/:creatorId
   */
  public static async getTwin(req: Request, res: Response): Promise<void> {
    try {
      const creatorId = req.params.creatorId as string;
      const twin = CreatorTwinEngineService.getTwin(creatorId);
      if (!twin) {
        res.status(404).json({ success: false, error: 'Creator Twin not found' });
        return;
      }

      res.json({
        success: true,
        data: twin
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/creator-twin/:creatorId/forecast
   */
  public static async getForecast(req: Request, res: Response): Promise<void> {
    try {
      const creatorId = req.params.creatorId as string;
      const forecast = await CreatorTwinEngineService.generateGrowthForecast(creatorId);

      res.json({
        success: true,
        data: forecast
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
