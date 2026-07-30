/**
 * AuraCore AI Simulation Environment - Core Contracts & Types
 */

// Platform types
export type PlatformType = 'TIKTOK' | 'REELS' | 'YOUTUBE_SHORTS' | 'X_FEED';

// 1. Environment Engine Types
export interface EnvironmentConfig {
  environmentId: string;
  platform: PlatformType;
  timeStepMs: number;
  stochasticNoiseFactor: number; // 0.0 - 1.0
  globalAttentionCap: number; // Total available viewer seconds in epoch
  nicheContext: string;
}

export interface EnvironmentTickContext {
  environmentId: string;
  step: number;
  timestamp: number;
  noiseVector: {
    attentionShift: number;
    viralMultiplier: number;
    cringePenalty: number;
  };
  platformRules: {
    maxDurationSec: number;
    hookWindowSec: number;
    linkPenaltyFactor: number;
  };
}

// 2. World State Manager Types
export interface EmotionVector {
  curiosity: number;
  humor: number;
  skepticism: number;
  satisfaction: number;
}

export interface WorldStateSnapshot {
  step: number;
  timestamp: number;
  activeNicheSat: Record<string, number>; // Niche -> Saturation % (0-100)
  remainingAttentionBudget: number;
  globalMoodVector: EmotionVector;
  activeContentPoolSize: number;
}

export interface WorldStateDelta {
  step: number;
  nicheSaturationDelta?: Record<string, number>;
  consumedAttention?: number;
  moodDelta?: Partial<EmotionVector>;
}

// 3. Viewer Archetype System Types
export interface ArchetypeTraits {
  openness: number;
  curiositySensitivity: number;
  cringeTolerance: number;
  hookPatienceSec: number;
  skepticismThreshold: number;
}

export interface ActionWeights {
  like: number;
  comment: number;
  share: number;
  save: number;
  skip: number;
}

export interface ViewerArchetype {
  archetypeId: string;
  codeName: string;
  displayName: string;
  description: string;
  traits: ArchetypeTraits;
  actionWeights: ActionWeights;
}

// 4. Synthetic Population Generator Types
export interface SyntheticAgent {
  agentId: string;
  archetypeId: string;
  varianceSeed: number;
  currentFatigue: number; // 0.0 - 1.0
  activeInterests: Record<string, number>; // Topic -> Interest weight (0.0 to 1.0)
  followerIds: string[];
}

export interface PopulationSwarmConfig {
  populationSize: number;
  demographicMix: Record<string, number>; // ArchetypeId -> Percentage (e.g. { 'ZOOMER': 0.35, 'FOUNDER': 0.40 })
  seed?: number;
}

// 5. Recommendation Engine Types
export interface RecommendationCandidate {
  contentDnaId: string;
  title: string;
  niche: string;
  hookQualityScore: number;
  pacingScore: number;
  emotionalHookScore: number;
  durationSec: number;
}

export interface RecommendationWave {
  waveLevel: 1 | 2 | 3 | 4;
  waveName: string;
  cohortSize: number;
  retentionThresholdPct: number;
  engagementThresholdPct: number;
}

export interface WaveGateEvaluation {
  waveLevel: number;
  waveName: string;
  cohortSize: number;
  qualifiedForNextWave: boolean;
  qualificationReason: string;
  avgRetentionInWave: number;
}

// 6. Trend Engine Types
export type TrendLifecycleStage = 'EMERGENT' | 'PEAK' | 'SATURATED' | 'DECLINING';

export interface TrendEntity {
  trendId: string;
  topicOrAudio: string;
  heatIndex: number; // 0 - 1000
  lifecycleStage: TrendLifecycleStage;
  decayRate: number;
  associatedKeywords: string[];
}

// 7. Community Engine Types
export interface SyntheticComment {
  commentId: string;
  contentDnaId: string;
  agentId: string;
  archetype: string;
  commentText: string;
  upvotes: number;
  sentimentScore: number; // -1.0 to +1.0
  psychologicalTrigger: string;
}

export interface CommunityState {
  totalComments: number;
  sentimentPolarity: number; // -1.0 to +1.0
  isRatioed: boolean;
  topComments: SyntheticComment[];
}

// 8. Content Competition Engine Types
export interface CompetitorItem {
  competitorId: string;
  title: string;
  niche: string;
  viralityPower: number;
  hookStrength: number;
}

export interface CompetitionSlotResult {
  targetContentId: string;
  competitorCount: number;
  impressionSharePct: number;
  relativeHookRank: number;
  competitiveDisplacementPenalty: number;
}

// 9. Memory Engine Types
export interface AgentMemoryState {
  agentId: string;
  seenContentIds: Set<string>;
  creatorAffinityMap: Record<string, number>; // CreatorId -> Affinity (-1.0 to 1.0)
  hookPatternFatigue: Record<string, number>; // HookType -> Fatigue (0.0 to 1.0)
}

// 11. Simulation Scheduler Types
export type SimulationStatus = 'IDLE' | 'INITIALIZING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';

export interface SimulationScheduleConfig {
  simulationId: string;
  totalDurationSeconds: number;
  ticksPerSecond: number;
  parallelismWorkerCount: number;
}

// 12. Telemetry Pipeline Types
export interface TelemetrySecondTimeline {
  second: number;
  activeViewersCount: number;
  retentionPercentage: number;
  dropOffCount: number;
  cumulativeLikes: number;
  cumulativeComments: number;
  cumulativeShares: number;
  cumulativeSaves: number;
  averageEmotionVector: EmotionVector;
}

export interface SimulationTelemetryResult {
  simulationId: string;
  contentDnaId: string;
  timestamp: string;
  populationSizeSimulated: number;
  predictedTotalViews: number;
  predictedWatchTimeSec: number;
  predictedCompletionRate: number;
  predicted3sHookRetention: number;
  predictedAverageRetention: number;
  viralityIndex: number;
  confidenceScore: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  predictedSaves: number;
  predictedFollowersGained: number;
  timeline: TelemetrySecondTimeline[];
  distributionWaves: WaveGateEvaluation[];
  topSyntheticReactions: {
    viewerId: string;
    archetype: string;
    action: string;
    commentText: string;
    psychologicalReason: string;
  }[];
  audienceSegmentPerformance: {
    segmentName: string;
    shareOfAudiencePct: number;
    retentionPct: number;
    viralityContributionScore: number;
  }[];
  dropOffAnalysis: {
    second: number;
    dropOffRatePct: number;
    causeCategory: string;
    causeDescription: string;
    fixRecommendation: string;
  }[];
}
