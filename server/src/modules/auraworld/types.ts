/**
 * AuraWorld Engine Domain Types & Event Contracts
 */

export type WorldEventType =
  | 'TIME_TICK'
  | 'TREND_BORN'
  | 'TREND_PEAKED'
  | 'TREND_DECAYED'
  | 'COMMUNITY_MIGRATED'
  | 'GLOBAL_EVENT_TRIGGERED'
  | 'ATTENTION_SATURATED'
  | 'POLICY_CHANGED'
  | 'HEALTH_WARNING'
  | 'CREATOR_POSTED'
  | 'CREATOR_CHURNED'
  | 'SEASONAL_SHIFT'
  | 'MUSIC_VIRAL'
  | 'FORMAT_ADOPTED';

export interface WorldEvent<T = any> {
  id: string;
  type: WorldEventType;
  timestamp: string;
  simulatedTimeSec: number;
  payload: T;
}

export type WorldEventHandler<T = any> = (event: WorldEvent<T>) => void | Promise<void>;

// 1. Time Engine Types
export interface TimeState {
  currentSimulatedTimeSec: number;
  tickCount: number;
  dilationFactor: number; // e.g. 3600 = 1 sec real time = 1 hr sim time
  timeOfDayHour: number;  // 0 - 23.9
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  currentSeason: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
}

// 2. Trend Engine Types (SIR Epidemic Diffusion)
export interface TrendTopic {
  id: string;
  name: string;
  category: 'Tech' | 'Creator Economy' | 'Lifestyle' | 'Entertainment' | 'Finance';
  susceptiblePopulation: number;
  infectedPopulation: number;   // Active view / adoption count
  recoveredPopulation: number;  // Saturated / fatigued count
  viralityR0: number;           // Basic reproduction number (>1.0 = exponential growth)
  decayHalfLifeHours: number;
  peakTimeSec: number;
  status: 'EMERGING' | 'PEAKING' | 'DECAYING' | 'EXHAUSTED';
}

// 3. Community Engine Types
export interface Subcommunity {
  id: string;
  name: string;
  nicheTopic: string;
  activeViewerCount: number;
  cohesionScore: number;       // Inter-member affinity [0.0 - 1.0]
  dominantArchetype: string;
  connectedCommunityIds: string[]; // Graph adjacency
}

// 4. Global Events Engine Types
export interface GlobalEventPayload {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'PLATFORM_SHOCK';
  affectedCategories: string[];
  attentionMultiplier: number;
  expiresSimTimeSec: number;
}

// 5. Attention Economy Types
export interface AttentionEconomyState {
  totalGlobalViewerCapacity: number;
  activeAttentionPoolMinutes: number;
  globalFatigueIndex: number;    // Accumulated boredom [0.0 - 1.0]
  competitionDensityScore: number; // Ratio of active videos vs viewer pool
  peakUsageHourActive: boolean;
}

// 6. Recommendation Policy Types
export interface RecommendationPolicyState {
  explorationRatio: number;      // e.g. 0.20 (20% discovery, 80% exploitation)
  diversityPenaltyWeight: number;
  coldStartBoostMultiplier: number;
  fatigueDecayPenalty: number;
  authorAuthorityWeight: number;
}

// 7. Platform Health Types
export interface PlatformHealthMetrics {
  activeViewersDAU: number;
  activeCreatorsMAU: number;
  viewerRetentionRatePct: number;
  creatorChurnRiskPct: number;
  clickbaitToxicityIndex: number; // Spam & low-effort ratio [0.0 - 1.0]
  adSaturationScore: number;
}

// 8. Creator Ecosystem Types
export interface SyntheticCreatorProfile {
  id: string;
  username: string;
  nicheCategory: string;
  followerCount: number;
  postingFrequencyPerWeek: number;
  authorityScore: number;        // [0.0 - 1.0]
  churnRisk: number;             // [0.0 - 1.0]
  lastPostedSimTimeSec: number;
}

// 9. Seasonal Events Types
export interface SeasonalEvent {
  id: string;
  name: string;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Global Holiday';
  intentMultiplier: number;     // Commercial purchase / viewing intent boost
  active: boolean;
}

// 10. Trending Music Types
export interface TrendingMusicTrack {
  id: string;
  trackName: string;
  artistName: string;
  bpm: number;
  usageCount: number;
  viralityVelocity: number;      // Uses per hour delta
  vibeTag: string;
}

// 11. Trending Formats Types
export interface TrendingFormatTemplate {
  id: string;
  formatName: string;            // e.g. "POV Storytelling", "3-Step Breakdown"
  category: string;
  adoptionCount: number;
  fatigueScore: number;          // [0.0 - 1.0]
  avgHookRetentionBonusPct: number;
}

// Global AuraWorld Snapshot State
export interface AuraWorldSnapshot {
  worldId: string;
  simulatedTime: TimeState;
  attentionEconomy: AttentionEconomyState;
  recommendationPolicy: RecommendationPolicyState;
  platformHealth: PlatformHealthMetrics;
  activeTrends: TrendTopic[];
  communities: Subcommunity[];
  globalEvents: GlobalEventPayload[];
  creators: SyntheticCreatorProfile[];
  seasonalEvents: SeasonalEvent[];
  trendingMusic: TrendingMusicTrack[];
  trendingFormats: TrendingFormatTemplate[];
  totalEventsProcessed: number;
}
