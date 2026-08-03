import { EmbeddingProviderRegistry } from './embeddingProvider.js';
import { VectorIntelligenceService } from './vectorIntelligenceService.js';
import { KnowledgeGraphService } from '../simulation/knowledgeGraphService.js';

export interface PrecedentScriptContext {
  contentRefId: string;
  similarityScore: number;
  snippet: string;
}

export interface RagContextPayload {
  queryTitle: string;
  queryScriptLength: number;
  precedentScripts: PrecedentScriptContext[];
  matchedCkgNodes: Array<{
    label: string;
    nodeType: string;
  }>;
  ragPromptContext: string;
}

export class RagRetrievalService {
  /**
   * Retrieves top-K historical precedent scripts and CKG nodes to empower Engine 2 Audience Simulation.
   */
  public static async retrievePrecedentsForPersonaSimulation(input: {
    title: string;
    scriptText: string;
    platform?: string;
    category?: string;
    topK?: number;
  }): Promise<RagContextPayload> {
    const topK = input.topK || 3;
    const scriptProvider = EmbeddingProviderRegistry.getProvider('script');
    
    // Generate query embedding for target script
    const queryVector = await scriptProvider.generateEmbedding({ text: `${input.title} ${input.scriptText}` });

    // Vector similarity search against historical content embeddings
    const similarityMatches = await VectorIntelligenceService.findSimilarContent(queryVector, 'script', {
      topK,
      minSimilarity: 0.30
    });

    const precedentScripts: PrecedentScriptContext[] = similarityMatches.map(match => ({
      contentRefId: match.contentRefId,
      similarityScore: match.similarityScore,
      snippet: `Precedent ${match.contentRefId}: Similarity ${Math.round(match.similarityScore * 100)}%`
    }));

    // Query Creative Knowledge Graph precedent nodes
    const ckgData = await KnowledgeGraphService.queryPrecedentPatterns(input.category || 'hook');
    const matchedCkgNodes = ckgData.nodes.slice(0, 5).map(n => ({
      label: n.label,
      nodeType: n.nodeType
    }));

    // Construct synthesized RAG Prompt Context
    const ckgRulesStr = matchedCkgNodes.map(n => `• [${n.nodeType.toUpperCase()}] ${n.label}`).join('\n');
    const ragPromptContext = `
=== RAG HISTORICAL PRECEDENT CONTEXT ===
Query Asset: "${input.title}" (${input.scriptText.length} chars)
Top Matched Precedents: ${precedentScripts.length} assets found via 1024d BGE-M3 Vector Search.

Creative Knowledge Graph Precedent Patterns:
${ckgRulesStr || '• Standard viral hook topology precedent pattern'}
========================================
`.trim();

    return {
      queryTitle: input.title,
      queryScriptLength: input.scriptText.length,
      precedentScripts,
      matchedCkgNodes,
      ragPromptContext
    };
  }
}
