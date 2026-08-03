import { Request, Response } from 'express';
import { EvidenceGraphService } from './evidenceGraphService.js';

export class EvidenceController {
  /**
   * GET /api/v1/evidence/:jobId
   */
  public static async getEvidenceGraph(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      if (!jobId) {
        res.status(400).json({ success: false, error: 'Missing jobId parameter' });
        return;
      }

      const graph = await EvidenceGraphService.getEvidenceGraph(jobId);
      res.json({
        success: true,
        data: {
          jobId,
          totalNodes: graph.nodes.length,
          totalEdges: graph.edges.length,
          nodes: graph.nodes,
          edges: graph.edges
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/evidence/:jobId/trace/:recommendationId
   */
  public static async traceRecommendation(req: Request, res: Response): Promise<void> {
    try {
      const jobId = req.params.jobId as string;
      const recommendationId = req.params.recommendationId as string | undefined;
      if (!jobId) {
        res.status(400).json({ success: false, error: 'Missing jobId parameter' });
        return;
      }

      const trace = await EvidenceGraphService.traceRecommendationEvidence(jobId, recommendationId);
      if (!trace) {
        res.status(404).json({ success: false, error: 'Evidence trace not found for recommendation' });
        return;
      }

      res.json({
        success: true,
        data: trace
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}
