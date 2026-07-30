/**
 * AuraWorld Environment Data Model & Interfaces
 */

export interface AlgorithmWeights {
  watchTime: number;
  shares: number;
  comments: number;
  repeatPlays: number;
  saves: number;
  clickThroughRate: number;
}

export interface TrendItem {
  id: string;
  name: string;
  category: 'AUDIO' | 'HASHTAG' | 'TOPIC';
  viralityMultiplier: number;
  decayRate: number;
  ageHours: number;
}

export interface EnvironmentState {
  timestamp: number;
  tickIndex: number;
  seed: number;
  region: string;
  platformId: string;
  competitionIndex: number; // 0.0 to 1.0
  creatorDensity: number; // Active creators per min
  audienceMood: {
    valence: number; // -1.0 to 1.0
    arousal: number; // 0.0 to 1.0
  };
  attentionBudget: {
    totalCapacity: number;
    availableCapacity: number;
    fatigueRate: number;
  };
  seasonalityFactor: number; // 0.8 to 1.4
  algorithmWeights: AlgorithmWeights;
  activeTrends: TrendItem[];
}

export interface StateTransitionLog {
  tickIndex: number;
  timestamp: number;
  platformId: string;
  competitionIndex: number;
  availableAttention: number;
  activeTrendCount: number;
}
