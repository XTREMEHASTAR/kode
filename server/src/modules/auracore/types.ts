/**
 * AuraCore Simulation Engine Types & Schemas
 */

export interface Demographics {
  ageGroup: '13-17' | '18-24' | '25-34' | '35-44' | '45+';
  gender: 'M' | 'F' | 'Non-Binary';
  geo: string;
  language: string;
  incomeTier: 'Low' | 'Medium' | 'High' | 'Ultra-High';
  occupation: string;
}

export interface CognitiveTraits {
  attentionSpanSec: number;     // Mean decay half-life in seconds
  patienceFactor: number;       // Tolerance for slow opening hook [0.0 - 1.0]
  skepticismScore: number;      // Resistance to clickbait or aggressive CTAs [0.0 - 1.0]
  emotionalReactivity: {
    humor: number;
    curiosity: number;
    controversy: number;
    aesthetic: number;
    relatability: number;
  };
  socialPropensity: {
    likeProb: number;
    commentProb: number;
    shareProb: number;
    saveProb: number;
    followProb: number;
  };
}

export interface ViewerMemoryState {
  workingMemorySessionMin: number;
  sessionFatigue: number;        // Accumulated boredom in current session [0.0 - 1.0]
  recentTopicsViewed: string[];
  ebbinghausDecayStrength: number;
  creatorLoyaltyMap: Record<string, number>; // CreatorId -> Loyalty Score
}

export interface SyntheticViewerProfile {
  id: string;
  archetypeName: string;
  demographics: Demographics;
  traits: CognitiveTraits;
  interestEmbedding: number[];   // 1024d normalized vector matching Content DNA space
  memoryState: ViewerMemoryState;
}

export interface ContentDNA {
  id: string;
  videoHash: string;
  title: string;
  durationSec: number;
  fps: number;
  
  // 1. Visual Stream
  spatialEmbedding: number[];    // 512d CLIP/EVA-02 vector
  cutCount: number;
  avgShotDurationSec: number;
  visualComplexityScore: number; // Color palette entropy & object density [0.0 - 1.0]
  faceCountAvg: number;
  cameraMotionVelocity: number;  // Optical flow motion delta [0.0 - 1.0]

  // 2. Acoustic Stream
  bpm: number;
  audioEnergyVariance: number;
  musicStyleEmbedding: number[];
  speechToMusicRatio: number;

  // 3. Speech & Linguistic Stream
  transcript: string;
  wordCount: number;
  readingGradeLevel: number;
  sentimentVelocity: number[];   // Per 0.5s sentiment delta
  semanticEmbedding: number[];   // 1024d BGE-M3 text vector

  // 4. Editing & Hook Topology
  pacingScore: number;           // Combined motion + cuts + audio energy [0.0 - 1.0]
  hookScore: number;             // First 3s visual & curiosity gap metric [0.0 - 1.0]
  curiosityGapScore: number;     // Hook semantic tension [0.0 - 1.0]
  ctaStrength: number;           // End CTA clarity [0.0 - 1.0]

  // Feature vector dump (500-1000 floats)
  featureVector: number[];
}

export interface Tier1MicroDecision {
  second: number;
  utilityScore: number;
  action: 'WATCH' | 'SKIP' | 'REPLAY';
  attentionRemaining: number;
}

export interface Tier2MacroDecision {
  viewerId: string;
  triggeredActions: ('LIKE' | 'COMMENT' | 'SHARE' | 'SAVE' | 'FOLLOW')[];
  generatedComment?: string;
  qualitativeReason?: string;
  memoryUpdate: {
    interestDelta: number;
    fatigueDelta: number;
  };
}

export interface SimulationStepResult {
  second: number;
  activeViewersCount: number;
  retentionPercentage: number;
  dropOffCount: number;
  cumulativeLikes: number;
  cumulativeComments: number;
  cumulativeShares: number;
  cumulativeSaves: number;
  averageEmotionVector: {
    curiosity: number;
    humor: number;
    skepticism: number;
    satisfaction: number;
  };
}

export interface DistributionWave {
  waveNumber: number;
  waveName: string; // "Initial Niche Seed", "Early Interest Expansion", "Algorithm Push", "Viral Cascade"
  cohortSize: number;
  qualifiedForNextWave: boolean;
  qualificationReason: string;
  avgRetentionInWave: number;
}

export interface AuraCoreSimulationTelemetry {
  simulationId: string;
  contentDnaId: string;
  timestamp: string;
  populationSizeSimulated: number;

  // Predicted Key Performance Indicators
  predictedTotalViews: number;
  predictedWatchTimeSec: number;
  predictedCompletionRate: number;
  predicted3sHookRetention: number;
  predictedAverageRetention: number;
  viralityIndex: number;          // 0 to 100 scale
  confidenceScore: 'High' | 'Medium' | 'Low';
  confidenceReason: string;

  // Interactions Breakdown
  predictedLikes: number;
  predictedComments: number;
  predictedShares: number;
  predictedSaves: number;
  predictedFollowersGained: number;

  // Detailed Telemetry Structures
  timeline: SimulationStepResult[];
  distributionWaves: DistributionWave[];
  topSyntheticReactions: Array<{
    viewerId: string;
    archetype: string;
    action: string;
    commentText?: string;
    psychologicalReason: string;
  }>;
  audienceSegmentPerformance: Array<{
    segmentName: string;
    shareOfAudiencePct: number;
    retentionPct: number;
    viralityContributionScore: number;
  }>;
  dropOffAnalysis: Array<{
    second: number;
    dropOffRatePct: number;
    causeCategory: string;
    causeDescription: string;
    fixRecommendation: string;
  }>;
}
