import { EnvironmentState } from '../environment/EnvironmentState';

export type CreatorNiche = 'TECH' | 'LIFESTYLE' | 'FINANCE' | 'FITNESS' | 'ENTERTAINMENT';

export interface HistoricalPerformance {
  totalUploads: number;
  totalViews: number;
  totalEngagement: number;
  avgViralityScore: number;
}

export interface SimulatedContent {
  id: string;
  creatorId: string;
  title: string;
  niche: CreatorNiche;
  timestamp: number;
  qualityScore: number;
  hookScore: number;
  pacingScore: number;
  dnaVector: number[]; // 1024D Multimodal Embedding
  trendAlignmentScore: number;
}

export interface CreatorConfig {
  id: string;
  name: string;
  niche: CreatorNiche;
  authorityScore?: number;
  postingFrequencyPerWeek?: number;
  baseContentQuality?: number;
  brandTrust?: number;
  consistencyScore?: number;
  followerCount?: number;
  historicalPerformance?: HistoricalPerformance;
}

/**
 * Persistent Creator Agent Entity
 */
export class CreatorAgent {
  public readonly id: string;
  public readonly name: string;
  public readonly niche: CreatorNiche;
  
  public authorityScore: number;
  public postingFrequencyPerWeek: number;
  public baseContentQuality: number;
  public brandTrust: number;
  public consistencyScore: number;
  public followerCount: number;
  public historicalPerformance: HistoricalPerformance;

  constructor(config: CreatorConfig) {
    this.id = config.id;
    this.name = config.name;
    this.niche = config.niche;
    this.authorityScore = config.authorityScore ?? 0.50;
    this.postingFrequencyPerWeek = config.postingFrequencyPerWeek ?? 3;
    this.baseContentQuality = config.baseContentQuality ?? 0.70;
    this.brandTrust = config.brandTrust ?? 0.80;
    this.consistencyScore = config.consistencyScore ?? 0.85;
    this.followerCount = config.followerCount ?? 10000;
    this.historicalPerformance = config.historicalPerformance ?? {
      totalUploads: 0,
      totalViews: 0,
      totalEngagement: 0,
      avgViralityScore: 50.0
    };
  }

  /**
   * Generates a 1024D Simulated Content object tailored to Environment State
   */
  public generateContent(env: EnvironmentState, prngNoise: number = 0.5): SimulatedContent {
    const qualityNoise = (prngNoise - 0.5) * 0.15;
    const finalQuality = Math.min(1.0, Math.max(0.1, this.baseContentQuality + qualityNoise));
    
    // Check trend alignment
    const matchingTrend = env.activeTrends.find(t => t.category === 'TOPIC' || t.category === 'AUDIO');
    const trendAlignment = matchingTrend ? matchingTrend.viralityMultiplier / 5.0 : 0.50;

    const hookScore = Number(Math.min(1.0, finalQuality * 0.9 + trendAlignment * 0.2).toFixed(3));
    const pacingScore = Number(Math.min(1.0, finalQuality * 0.85 + (1 - env.competitionIndex) * 0.15).toFixed(3));

    // Construct 1024D DNA Vector
    const dnaVector = new Array(1024).fill(0).map((_, i) => {
      const val = (Math.sin(i + finalQuality * 10) + Math.cos(i * 0.5 + trendAlignment * 5)) / 2;
      return Number(val.toFixed(4));
    });

    this.historicalPerformance.totalUploads += 1;

    return {
      id: `cnt_${this.id.slice(0, 6)}_${this.historicalPerformance.totalUploads}`,
      creatorId: this.id,
      title: `${this.name} - ${this.niche} Update #${this.historicalPerformance.totalUploads}`,
      niche: this.niche,
      timestamp: env.timestamp,
      qualityScore: Number(finalQuality.toFixed(3)),
      hookScore,
      pacingScore,
      dnaVector,
      trendAlignmentScore: Number(trendAlignment.toFixed(3))
    };
  }

  public recordPerformance(views: number, engagement: number, viralityScore: number): void {
    this.historicalPerformance.totalViews += views;
    this.historicalPerformance.totalEngagement += engagement;
    
    // Update moving average virality score
    const total = this.historicalPerformance.totalUploads;
    this.historicalPerformance.avgViralityScore = Number(
      ((this.historicalPerformance.avgViralityScore * (total - 1) + viralityScore) / total).toFixed(2)
    );

    // Audience follower growth based on performance
    if (viralityScore > 75) {
      const newFollowers = Math.round(views * 0.02);
      this.followerCount += newFollowers;
    }
  }
}
