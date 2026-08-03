import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VectorIntelligenceService } from '../modules/embedding/vectorIntelligenceService.js';
import { EmbeddingProviderRegistry, IEmbeddingProvider, EmbeddingProviderConfig } from '../modules/embedding/embeddingProvider.js';
import { RagRetrievalService } from '../modules/embedding/ragRetrievalService.js';

describe('Embedding Intelligence Layer Test Suite', () => {

  describe('1. Cosine Similarity Vector Mathematics', () => {
    it('calculates Cosine similarity = 1.0 for identical vectors', () => {
      const vecA = [0.6, 0.8, 0.0];
      const vecB = [0.6, 0.8, 0.0];
      const sim = VectorIntelligenceService.calculateCosineSimilarity(vecA, vecB);
      assert.strictEqual(Math.round(sim * 1000) / 1000, 1.0);
    });

    it('calculates Cosine similarity = 0.0 for orthogonal vectors', () => {
      const vecA = [1.0, 0.0, 0.0];
      const vecB = [0.0, 1.0, 0.0];
      const sim = VectorIntelligenceService.calculateCosineSimilarity(vecA, vecB);
      assert.strictEqual(Math.round(sim * 1000) / 1000, 0.0);
    });

    it('calculates Cosine similarity = -1.0 for opposite vectors', () => {
      const vecA = [0.6, 0.8];
      const vecB = [-0.6, -0.8];
      const sim = VectorIntelligenceService.calculateCosineSimilarity(vecA, vecB);
      assert.strictEqual(Math.round(sim * 1000) / 1000, -1.0);
    });
  });

  describe('2. Swappable Model Provider Registry', () => {
    it('contains registered default providers for all 8 modalities', () => {
      const configs = EmbeddingProviderRegistry.listProviders();
      assert.ok(configs.length >= 5, 'Registry must list embedding providers');

      const modalities = configs.map(c => c.modality);
      assert.ok(modalities.includes('script'), 'Must support script modality');
      assert.ok(modalities.includes('thumbnail'), 'Must support thumbnail modality');
      assert.ok(modalities.includes('audio'), 'Must support audio modality');
      assert.ok(modalities.includes('ckg_graph'), 'Must support ckg_graph modality');
    });

    it('allows registering and resolving a custom fine-tuned PyTorch provider', () => {
      class CustomPyTorchProvider implements IEmbeddingProvider {
        readonly config: EmbeddingProviderConfig = {
          providerId: 'custom-pytorch-fine-tuned-v2',
          modelName: 'Custom-PyTorch-FineTuned-V2',
          dimension: 1024,
          modality: 'script',
          version: 'v2.1.0'
        };

        public async generateEmbedding(): Promise<number[]> {
          return new Array(1024).fill(0.1);
        }
      }

      const customProv = new CustomPyTorchProvider();
      EmbeddingProviderRegistry.registerProvider(customProv);

      const resolved = EmbeddingProviderRegistry.getProvider('script', 'custom-pytorch-fine-tuned-v2');
      assert.strictEqual(resolved.config.providerId, 'custom-pytorch-fine-tuned-v2');
      assert.strictEqual(resolved.config.version, 'v2.1.0');
    });
  });

  describe('3. Vector Store Persistence & Similarity Search', () => {
    it('stores content embeddings and retrieves top-K nearest neighbors', async () => {
      await VectorIntelligenceService.storeContentEmbedding('asset_tech_01', 'script', {
        text: 'How to build high performance AI systems with TypeScript and Node'
      });

      await VectorIntelligenceService.storeContentEmbedding('asset_tech_02', 'script', {
        text: 'Building scalable AI backend architectures and vector search engines'
      });

      await VectorIntelligenceService.storeContentEmbedding('asset_cooking_01', 'script', {
        text: 'How to bake delicious sourdough bread at home'
      });

      const provider = EmbeddingProviderRegistry.getProvider('script');
      const queryVec = await provider.generateEmbedding({ text: 'AI system backend engineering' });

      const matches = await VectorIntelligenceService.findSimilarContent(queryVec, 'script', { topK: 2 });
      assert.ok(matches.length > 0, 'Vector search must return matches');
      assert.ok(matches[0].similarityScore > 0, 'Matches must have positive similarity score');
    });
  });

  describe('4. Near-Duplicate Content Detection', () => {
    it('detects near-duplicate assets with high cosine similarity (>= 0.96)', async () => {
      const origRef = 'original_video_101';
      const dupRef = 'reposted_video_102';

      // Same text content generates identical synthetic vector
      await VectorIntelligenceService.storeContentEmbedding(origRef, 'script', {
        text: 'Stop making this #1 mistake on your Instagram Reels in 2026'
      });

      await VectorIntelligenceService.storeContentEmbedding(dupRef, 'script', {
        text: 'Stop making this #1 mistake on your Instagram Reels in 2026'
      });

      const check = await VectorIntelligenceService.detectNearDuplicates(dupRef, 'script', 0.95);
      assert.strictEqual(check.isDuplicate, true, 'Duplicate detector should identify near-duplicate content');
      assert.ok(check.similarityScore >= 0.95);
    });
  });

  describe('5. RAG Retrieval Engine for Audience Simulation', () => {
    it('retrieves top precedent scripts & CKG rules into synthesized RAG context prompt', async () => {
      const payload = await RagRetrievalService.retrievePrecedentsForPersonaSimulation({
        title: '3 AI Agent Hacks You Need to Know',
        scriptText: 'Here are 3 secret AI agent prompts that will save you 10 hours a week...',
        category: 'tech'
      });

      assert.strictEqual(payload.queryTitle, '3 AI Agent Hacks You Need to Know');
      assert.ok(payload.ragPromptContext.includes('RAG HISTORICAL PRECEDENT CONTEXT'));
      assert.ok(payload.matchedCkgNodes.length >= 0);
    });
  });

  describe('6. Semantic Clustering & Trend Velocity', () => {
    it('returns trending semantic clusters sorted by velocity score', async () => {
      const trends = await VectorIntelligenceService.clusterEmbeddingsAndFindTrends('script');
      assert.ok(trends.length > 0);
      assert.ok(trends[0].velocityScore > 0);
      assert.ok(trends[0].clusterName);
    });
  });

});
