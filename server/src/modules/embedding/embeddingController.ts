import { Request, Response } from 'express';
import { VectorIntelligenceService } from './vectorIntelligenceService.js';
import { RagRetrievalService } from './ragRetrievalService.js';
import { EmbeddingProviderRegistry } from './embeddingProvider.js';

export class EmbeddingController {
  /**
   * POST /api/v1/embeddings/generate
   */
  public static async generateEmbeddings(req: Request, res: Response): Promise<void> {
    try {
      const { contentRefId, modality, text, mediaUrl, payload, providerId } = req.body;
      if (!contentRefId || !modality) {
        res.status(400).json({ success: false, error: 'Missing required contentRefId or modality' });
        return;
      }

      const record = await VectorIntelligenceService.storeContentEmbedding(
        contentRefId,
        modality,
        { text, mediaUrl, payload },
        providerId
      );

      res.json({
        success: true,
        data: {
          id: record.id,
          contentRefId: record.contentRefId,
          modality: record.modality,
          providerId: record.providerId,
          modelVersion: record.modelVersion,
          dimension: record.dimension,
          l2Norm: record.l2Norm
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/embeddings/similarity-search
   */
  public static async similaritySearch(req: Request, res: Response): Promise<void> {
    try {
      const { queryText, modality, topK, minSimilarity } = req.body;
      const targetModality = modality || 'script';
      const provider = EmbeddingProviderRegistry.getProvider(targetModality);

      const queryVector = await provider.generateEmbedding({ text: queryText || '' });
      const results = await VectorIntelligenceService.findSimilarContent(queryVector, targetModality, {
        topK: topK || 5,
        minSimilarity: minSimilarity || 0.40
      });

      res.json({
        success: true,
        data: {
          modality: targetModality,
          queryText: queryText || '',
          totalMatches: results.length,
          results
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/embeddings/duplicate-check
   */
  public static async detectDuplicates(req: Request, res: Response): Promise<void> {
    try {
      const { contentRefId, modality, threshold } = req.body;
      if (!contentRefId) {
        res.status(400).json({ success: false, error: 'Missing contentRefId' });
        return;
      }

      const result = await VectorIntelligenceService.detectNearDuplicates(
        contentRefId,
        modality || 'script',
        threshold || 0.96
      );

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/embeddings/clusters/trends
   */
  public static async getTrendClusters(req: Request, res: Response): Promise<void> {
    try {
      const modality = (req.query.modality as string) || 'script';
      const trends = await VectorIntelligenceService.clusterEmbeddingsAndFindTrends(modality);

      res.json({ success: true, data: trends });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/v1/embeddings/rag-retrieve
   */
  public static async retrieveRagContext(req: Request, res: Response): Promise<void> {
    try {
      const { title, scriptText, platform, category, topK } = req.body;
      if (!title || !scriptText) {
        res.status(400).json({ success: false, error: 'Missing title or scriptText' });
        return;
      }

      const payload = await RagRetrievalService.retrievePrecedentsForPersonaSimulation({
        title,
        scriptText,
        platform,
        category,
        topK
      });

      res.json({ success: true, data: payload });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /api/v1/embeddings/providers
   */
  public static async listProviders(_req: Request, res: Response): Promise<void> {
    const providers = EmbeddingProviderRegistry.listProviders();
    res.json({ success: true, data: providers });
  }
}
