export type ContentLifecycleState = 
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PUBLISHED' 
  | 'CANDIDATE_POOL' 
  | 'RECOMMENDED' 
  | 'VIEWER_EXPOSURE'
  | 'GROWTH'
  | 'PEAK'
  | 'DECAY' 
  | 'ARCHIVED';

export interface ContentIntelligence {
  dnaVector: number[]; // 1024D Multimodal Embedding
  hookScore: number;
  visualScore: number;
  audioScore: number;
  narrativeScore: number;
  editingScore: number;
  thumbnailScore: number;
  ctaScore: number;
  trendAffinity: number;
  audienceMatch: number;
}

export interface DistributionState {
  currentFeedRank: number;
  candidatePoolPosition: number;
  recommendationScore: number;
  distributionWave: number; // Wave 1 to Wave 4
  reach: number;
  impressions: number;
}

export interface EngagementMetrics {
  views: number;
  watchTimeMs: number;
  retentionCurve: number[]; // 30 retention points (0s to 30s)
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  follows: number;
  completionRate: number;
}

export interface RecommendationHistoryEntry {
  timestamp: number;
  stage: string;
  rankScore: number;
  impressionsDelivered: number;
}

export interface ContentHistoricalAnalytics {
  peakRetentionRate: number;
  viralVelocityScore: number;
  decayHalfLifeHours: number;
}

export interface ContentEntity {
  // Identity
  id: string;
  creatorId: string;
  platformId: string;
  publishTimestamp: number;
  simulationId: string;

  // Lifecycle
  state: ContentLifecycleState;
  stateHistory: { state: ContentLifecycleState; timestamp: number }[];

  // Intelligence
  intelligence: ContentIntelligence;

  // Distribution & Engagement
  distribution: DistributionState;
  engagementMetrics: EngagementMetrics;

  // History & Analytics
  recommendationHistory: RecommendationHistoryEntry[];
  historicalAnalytics: ContentHistoricalAnalytics;
}
