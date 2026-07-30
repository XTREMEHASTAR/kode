/**
 * AuraCore Phase 2 Engine Types & Mathematical Contracts
 */

export interface MultimodalDnaVector {
  dimensions: {
    visualDna: number;
    audioDna: number;
    narrativeDna: number;
    hookDna: number;
    emotion: number;
    curiosity: number;
    editingRhythm: number;
    pacing: number;
    motionEnergy: number;
    ctaStrength: number;
    musicAnalysis: number;
    brandVoice: number;
    audienceMatch: number;
  };
  embedding1024: number[]; // Normalized 1024D vector
  confidenceScore: number;
}

export interface DdmAgentParameters {
  v0: number; // Initial curiosity drift rate
  lambda: number; // Attention decay half-life factor
  a: number; // Upper/lower decision boundary threshold
  z: number; // Initial bias (z = 0 is unbiased)
  Ter: number; // Non-decision perception latency in seconds (0.12s)
  sigma: number; // Stochastic Gaussian noise diffusion scale (0.10)
}

export interface SyntheticViewerProfile {
  id: string;
  clusterName: string;
  psychologicalDna: number[];
  ddmParams: DdmAgentParameters;
}

export interface SwarmSimulationResult {
  totalViewers: number;
  retentionCurve: { timestamp: number; retentionPct: number }[];
  watchCount: number;
  skipCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  meanDecisionTimeMs: number;
}

export interface RecommendationCascadeResult {
  stages: {
    stageName: string;
    inputCandidates: number;
    outputCandidates: number;
    latencyMs: number;
    confidence: number;
    passed: boolean;
  }[];
  finalWave: number;
  qualifiedForMainstream: boolean;
}

export interface ViralityForecastResult {
  predictedViews: number;
  confidenceInterval95: { min: number; max: number };
  viralProbability: number;
  followerGrowth: number;
  shapleyCausalFactors: { factor: string; impactPct: number; direction: 'POSITIVE' | 'NEGATIVE' }[];
  runsExecuted: number;
  convergenceRatePct: number;
}
