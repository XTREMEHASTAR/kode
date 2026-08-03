import { Request, Response } from 'express';
import { SimulationOrchestrator } from './simulationOrchestrator.js';
import { LearningLoopService } from './learningLoopService.js';
import { AudienceFactService } from './audienceFactService.js';
import { CounterfactualEngine } from './counterfactualEngine.js';
import { CreatorTwinService } from './creatorTwinService.js';
import { KnowledgeGraphService } from './knowledgeGraphService.js';

export class SimulationController {
  /**
   * POST /v1/simulations
   * Submit content bundle for AI audience simulation
   */
  public static async createSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { platform, title, caption, thumbnailUrl, videoUrl, scriptText, personaTier } = req.body;
      const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

      const report = await SimulationOrchestrator.createAndRunSimulation({
        userId,
        platform: platform || 'instagram',
        title,
        caption,
        thumbnailUrl,
        videoUrl,
        scriptText,
        personaTier: personaTier || 'standard'
      });

      res.status(201).json({
        success: true,
        message: 'AI Audience Simulation completed successfully.',
        data: report
      });
    } catch (error: any) {
      console.error('[SIMULATION CONTROLLER] Simulation Error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to execute audience simulation'
      });
    }
  }

  /**
   * GET /v1/simulations/:jobId
   * Fetch complete simulation report
   */
  public static async getSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { jobId } = req.params;
      const jobIdStr = Array.isArray(jobId) ? jobId[0] : String(jobId);
      const report = SimulationOrchestrator.getSimulationJob(jobIdStr);

      if (!report) {
        res.status(404).json({
          success: false,
          error: `Simulation job '${jobId}' not found.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: report
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch simulation'
      });
    }
  }

  /**
   * POST /v1/outcomes
   * Ingest actual video performance for closed-loop learning
   */
  public static async recordOutcome(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';
      const { jobId, contentRef, metrics, measuredAt } = req.body;

      const outcome = await LearningLoopService.recordActualOutcome({
        jobId,
        userId,
        contentRef: contentRef || {},
        metrics: metrics || {},
        measuredAt: measuredAt || new Date().toISOString()
      });

      res.status(201).json({
        success: true,
        message: 'Actual outcome ingested successfully for calibration.',
        data: outcome
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to record outcome'
      });
    }
  }

  /**
   * GET /v1/audience-facts
   * Ingest/inspect market statistics & dataset versions
   */
  public static async getAudienceFacts(req: Request, res: Response): Promise<void> {
    try {
      const platformParam = req.query.platform;
      const platformStr = typeof platformParam === 'string' ? platformParam : Array.isArray(platformParam) ? String(platformParam[0]) : undefined;
      const facts = platformStr
        ? AudienceFactService.getFactsByPlatform(platformStr)
        : AudienceFactService.getAllFacts();

      res.status(200).json({
        success: true,
        datasetVersionId: AudienceFactService.getDatasetVersion(),
        totalFacts: facts.length,
        data: facts
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch audience facts'
      });
    }
  }

  /**
   * POST /v2/simulations/counterfactual
   * Re-simulate candidate edit in What-If Lab with validated lift
   */
  public static async evaluateCounterfactual(req: Request, res: Response): Promise<void> {
    try {
      const { baseScore, component, changeName, originalText, newText } = req.body;
      const result = await CounterfactualEngine.evaluateCounterfactualEdit(baseScore || 85, {
        component: component || 'hook',
        changeName: changeName || 'Hook Pattern Interrupt',
        originalText: originalText || '',
        newText: newText || ''
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to evaluate counterfactual edit'
      });
    }
  }

  /**
   * GET /v2/creators/:userId/twin
   * Fetch persistent Creator Twin profile & style fingerprint
   */
  public static async getCreatorTwin(req: Request, res: Response): Promise<void> {
    try {
      const paramVal = req.params.userId;
      const userId = Array.isArray(paramVal) ? paramVal[0] : (paramVal || '00000000-0000-0000-0000-000000000000');
      const twin = await CreatorTwinService.getCreatorTwin(userId);

      res.status(200).json({
        success: true,
        data: twin
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch Creator Twin'
      });
    }
  }

  /**
   * GET /v2/knowledge-graph/query
   * Query Creative Knowledge Graph for precedent patterns & rules
   */
  public static async queryKnowledgeGraph(req: Request, res: Response): Promise<void> {
    try {
      const q = req.query.q ? String(req.query.q) : undefined;
      const graphData = await KnowledgeGraphService.queryPrecedentPatterns(q);

      res.status(200).json({
        success: true,
        data: graphData
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to query Knowledge Graph'
      });
    }
  }
}

