import { v4 as uuidv4 } from 'uuid';

export interface CKGNode {
  id: string;
  nodeType: 'creator' | 'content_feature' | 'segment' | 'outcome';
  label: string;
  payload: Record<string, any>;
  createdAt: string;
}

export interface CKGEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: 'influences' | 'resembles' | 'improved_by' | 'contradicts';
  weight: number;
  confidence: number;
  provenance?: Record<string, any>;
  createdAt: string;
}

export class KnowledgeGraphService {
  private static NODES: Map<string, CKGNode> = new Map();
  private static EDGES: Map<string, CKGEdge> = new Map();

  static {
    // Seed initial Creative Knowledge Graph precedent patterns
    const n1Id = uuidv4();
    const n2Id = uuidv4();
    const n3Id = uuidv4();

    this.NODES.set(n1Id, {
      id: n1Id,
      nodeType: 'content_feature',
      label: 'Question-Based Hook framing (<2.5s)',
      payload: { featureCategory: 'hook_pattern', velocityIndex: 94 },
      createdAt: new Date().toISOString()
    });

    this.NODES.set(n2Id, {
      id: n2Id,
      nodeType: 'segment',
      label: 'US 18-24 Tech & Startup Creators',
      payload: { platform: 'instagram', ageBand: '18-24' },
      createdAt: new Date().toISOString()
    });

    this.NODES.set(n3Id, {
      id: n3Id,
      nodeType: 'outcome',
      label: '+0.68σ Save Rate Lift',
      payload: { metricKey: 'would_save', liftPct: 68 },
      createdAt: new Date().toISOString()
    });

    const edgeId = uuidv4();
    this.EDGES.set(edgeId, {
      id: edgeId,
      sourceNodeId: n1Id,
      targetNodeId: n3Id,
      relationType: 'improved_by',
      weight: 1.45,
      confidence: 0.94,
      provenance: { sampleSize: 1420, verifiedBy: 'PatternExtractionAgent' },
      createdAt: new Date().toISOString()
    });
  }

  public static async queryPrecedentPatterns(keyword?: string): Promise<{ nodes: CKGNode[]; edges: CKGEdge[] }> {
    const nodes = Array.from(this.NODES.values());
    const edges = Array.from(this.EDGES.values());

    if (!keyword) return { nodes, edges };

    const filteredNodes = nodes.filter(n =>
      n.label.toLowerCase().includes(keyword.toLowerCase()) ||
      n.nodeType.toLowerCase().includes(keyword.toLowerCase())
    );

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = edges.filter(e => nodeIds.has(e.sourceNodeId) || nodeIds.has(e.targetNodeId));

    return { nodes: filteredNodes, edges: filteredEdges };
  }

  public static async addPatternEdge(
    sourceLabel: string,
    targetLabel: string,
    relationType: CKGEdge['relationType'],
    weight: number = 1.0,
    confidence: number = 0.9
  ): Promise<CKGEdge> {
    const sId = uuidv4();
    const tId = uuidv4();

    const sNode: CKGNode = {
      id: sId,
      nodeType: 'content_feature',
      label: sourceLabel,
      payload: {},
      createdAt: new Date().toISOString()
    };

    const tNode: CKGNode = {
      id: tId,
      nodeType: 'outcome',
      label: targetLabel,
      payload: {},
      createdAt: new Date().toISOString()
    };

    this.NODES.set(sId, sNode);
    this.NODES.set(tId, tNode);

    const edgeId = uuidv4();
    const edge: CKGEdge = {
      id: edgeId,
      sourceNodeId: sId,
      targetNodeId: tId,
      relationType,
      weight,
      confidence,
      createdAt: new Date().toISOString()
    };

    this.EDGES.set(edgeId, edge);
    return edge;
  }

  /**
   * Compiles Engine 1 ContentDNA objective facts into Creative Knowledge Graph Nodes and Edges.
   */
  public static async compileContentDnaToCkg(dna: {
    id: string;
    title: string;
    durationSec: number;
    cutCount: number;
    avgShotDurationSec: number;
    pacingScore: number;
    hookScore: number;
    curiosityGapScore: number;
    ctaStrength: number;
    bpm: number;
    transcript: string;
  }): Promise<{ contentNodeId: string; nodeCount: number; edgeCount: number }> {
    const contentNodeId = uuidv4();
    
    // Main Content Node
    this.NODES.set(contentNodeId, {
      id: contentNodeId,
      nodeType: 'content_feature',
      label: `Content: ${dna.title || 'Untitled Creative'} (${dna.durationSec}s)`,
      payload: {
        dnaId: dna.id,
        durationSec: dna.durationSec,
        cutCount: dna.cutCount,
        avgShotDurationSec: dna.avgShotDurationSec,
        bpm: dna.bpm
      },
      createdAt: new Date().toISOString()
    });

    // Feature Node 1: Hook Topology
    const hookNodeId = uuidv4();
    const hookLabel = dna.hookScore > 0.7 
      ? 'Strong Curiosity-Based Hook (<3.0s)' 
      : 'Standard Declarative Hook (<3.0s)';
    this.NODES.set(hookNodeId, {
      id: hookNodeId,
      nodeType: 'content_feature',
      label: hookLabel,
      payload: { hookScore: dna.hookScore, curiosityGap: dna.curiosityGapScore },
      createdAt: new Date().toISOString()
    });

    // Feature Node 2: Visual Pacing
    const pacingNodeId = uuidv4();
    const pacingLabel = dna.pacingScore > 0.7 
      ? `High Editing Velocity (${dna.cutCount} cuts, ${dna.avgShotDurationSec}s/shot)` 
      : `Moderate Pacing (${dna.cutCount} cuts, ${dna.avgShotDurationSec}s/shot)`;
    this.NODES.set(pacingNodeId, {
      id: pacingNodeId,
      nodeType: 'content_feature',
      label: pacingLabel,
      payload: { cuts: dna.cutCount, shotDuration: dna.avgShotDurationSec },
      createdAt: new Date().toISOString()
    });

    // Feature Node 3: CTA Strength
    const ctaNodeId = uuidv4();
    this.NODES.set(ctaNodeId, {
      id: ctaNodeId,
      nodeType: 'content_feature',
      label: dna.ctaStrength > 0.7 ? 'Explicit Action Trigger CTA' : 'Implicit Passive Ending',
      payload: { ctaStrength: dna.ctaStrength },
      createdAt: new Date().toISOString()
    });

    // Link Content Node to Feature Nodes
    let edgeCount = 0;
    const addEdge = (sId: string, tId: string, rel: CKGEdge['relationType'], w: number) => {
      const eId = uuidv4();
      this.EDGES.set(eId, {
        id: eId,
        sourceNodeId: sId,
        targetNodeId: tId,
        relationType: rel,
        weight: w,
        confidence: 0.95,
        createdAt: new Date().toISOString()
      });
      edgeCount++;
    };

    addEdge(contentNodeId, hookNodeId, 'influences', 1.5);
    addEdge(contentNodeId, pacingNodeId, 'influences', 1.2);
    addEdge(contentNodeId, ctaNodeId, 'influences', 1.0);

    return {
      contentNodeId,
      nodeCount: 4,
      edgeCount
    };
  }

  /**
   * Constructs CKG Context Summary for Engine 2 Audience Simulation.
   * Engine 2 NEVER consumes raw media — only this structured summary!
   */
  public static async getSummaryForAudienceSimulation(title?: string, scriptText?: string): Promise<{
    summaryText: string;
    hookScore: number;
    curiosityGapScore: number;
    pacingScore: number;
    hasCTA: boolean;
    ckgNodeCount: number;
  }> {
    const nodes = Array.from(this.NODES.values());
    const text = `${title || ''} ${scriptText || ''}`;
    const hasQuestion = text.includes('?');
    const hasCTA = /comment|save|share|follow|link/i.test(text);

    return {
      summaryText: `CKG Structured Summary: "${title || 'Creative Video'}" — ${text.length} chars. Objective Hook Question: ${hasQuestion ? 'Present' : 'Absent'}. CTA Trigger: ${hasCTA ? 'Explicit' : 'None'}.`,
      hookScore: hasQuestion ? 0.85 : 0.55,
      curiosityGapScore: hasQuestion ? 0.88 : 0.50,
      pacingScore: 0.72,
      hasCTA,
      ckgNodeCount: nodes.length
    };
  }
}

