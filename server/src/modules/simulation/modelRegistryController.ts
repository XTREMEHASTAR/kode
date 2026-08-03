import { Request, Response } from 'express';
import { ModelRegistryService } from './modelRegistryService.js';

export class ModelRegistryController {
  /**
   * POST /api/v1/model-registry/register
   */
  public static async registerModel(req: Request, res: Response): Promise<void> {
    try {
      const { id, modelName, provider, capabilities, avgLatencyMs, costPer1kTokens, version, fallbackModelId, qualityScore, isActive } = req.body;
      if (!id || !modelName || !provider) {
        res.status(400).json({ success: false, error: 'Missing id, modelName, or provider parameter' });
        return;
      }

      const registered = await ModelRegistryService.registerModel({
        id,
        modelName,
        provider,
        capabilities: capabilities || ['text-generation'],
        avgLatencyMs: avgLatencyMs || 250,
        costPer1kTokens: costPer1kTokens || 0.001,
        version: version || '1.0',
        fallbackModelId,
        qualityScore: qualityScore || 90.0,
        isActive: isActive !== undefined ? isActive : true
      });

      res.json({
        success: true,
        data: registered
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/model-registry/policy
   */
  public static async setPolicy(req: Request, res: Response): Promise<void> {
    try {
      const { capability, routingStrategy, primaryModelId, secondaryModelId, trafficSplitPct } = req.body;
      if (!capability || !primaryModelId) {
        res.status(400).json({ success: false, error: 'Missing capability or primaryModelId parameter' });
        return;
      }

      const policy = await ModelRegistryService.setRoutingPolicy({
        capability,
        routingStrategy: routingStrategy || 'direct',
        primaryModelId,
        secondaryModelId,
        trafficSplitPct: trafficSplitPct !== undefined ? trafficSplitPct : 50.0
      });

      res.json({
        success: true,
        data: policy
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/model-registry/resolve/:capability
   */
  public static async resolveCapability(req: Request, res: Response): Promise<void> {
    try {
      const capability = req.params.capability as string;
      const resolution = ModelRegistryService.resolveModel(capability);

      res.json({
        success: true,
        data: resolution
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/model-registry/models
   */
  public static async getModels(_req: Request, res: Response): Promise<void> {
    try {
      const models = ModelRegistryService.listModels();
      res.json({
        success: true,
        data: models
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/model-registry/policies
   */
  public static async getPolicies(_req: Request, res: Response): Promise<void> {
    try {
      const policies = ModelRegistryService.getRoutingPolicies();
      res.json({
        success: true,
        data: policies
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
