import { EnvironmentState } from '../environment/EnvironmentState';
import { CreatorAgent } from '../creator/CreatorAgent';

export interface PredictionInput {
  contentDna: number[]; // 1024D Multimodal Embedding
  platformId: string;
  creatorProfile: CreatorAgent;
  environmentState: EnvironmentState;
  qualityScore?: number;
  hookScore?: number;
  pacingScore?: number;
}

export interface ConfidenceInterval95 {
  lowerBound: number;
  upperBound: number;
}

export interface AlternativeOutcomes {
  worstCaseP10: number;
  baseCaseP50: number;
  bestCaseP90: number;
}

export interface PredictionExplainability {
  topPositiveFactors: string[];
  topNegativePenalties: string[];
  confidenceScore: number;
  alternativeOutcomes: AlternativeOutcomes;
  improvementSuggestions: string[];
}

export interface PredictionSuiteResult {
  predictedViews: number;
  confidenceInterval95: ConfidenceInterval95;
  predictedWatchTimeMs: number;
  retentionCurve: number[]; // 30 points
  predictedCompletionRate: number;
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  predictedSaves: number;
  predictedFollowers: number;
  viralityProbability: number; // P_viral in [0, 1]
  peakDistributionWave: number;
  explainability: PredictionExplainability;
}
