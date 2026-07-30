import { TrendEntity } from '../contracts/engine.types.js';

/**
 * Trend Engine Module - Mathematically Grounded
 * Incorporates Hawkes Self-Exciting Point Processes for viral meme contagion & decay.
 */
export class TrendEngine {
  private activeTrends: Map<string, TrendEntity> = new Map();
  private eventTimestamps: Map<string, number[]> = new Map();

  constructor() {
    this.seedInitialTrends();
  }

  private seedInitialTrends(): void {
    const defaultTrends: TrendEntity[] = [
      {
        trendId: 'trend_ai_automation',
        topicOrAudio: 'AI Agent Workflows',
        heatIndex: 850,
        lifecycleStage: 'PEAK',
        decayRate: 0.05,
        associatedKeywords: ['ai', 'agent', 'automation', 'future', 'workflow']
      },
      {
        trendId: 'trend_solopreneur_stack',
        topicOrAudio: 'Micro-SaaS Tech Stack',
        heatIndex: 620,
        lifecycleStage: 'EMERGENT',
        decayRate: 0.02,
        associatedKeywords: ['saas', 'code', 'build', 'stack', 'revenue']
      }
    ];

    defaultTrends.forEach(t => {
      this.activeTrends.set(t.trendId, t);
      this.eventTimestamps.set(t.trendId, [Date.now() - 10000, Date.now() - 5000]);
    });
  }

  /**
   * Hawkes Process Conditional Intensity Function
   * lambda(t) = mu + sum_{t_i < t} alpha * exp(-beta * (t - t_i))
   */
  public computeHawkesIntensity(trendId: string, currentTime: number, mu: number = 50, alpha: number = 250, beta: number = 0.0005): number {
    const timestamps = this.eventTimestamps.get(trendId) || [];
    let selfExcitement = 0;

    for (const t_i of timestamps) {
      if (t_i < currentTime) {
        selfExcitement += alpha * Math.exp(-beta * (currentTime - t_i));
      }
    }

    return Number((mu + selfExcitement).toFixed(2));
  }

  public evaluateTrendMatch(text: string): { trendBonus: number; matchedTrend?: TrendEntity } {
    const lowercase = text.toLowerCase();
    const now = Date.now();

    for (const trend of this.activeTrends.values()) {
      const isMatch = trend.associatedKeywords.some((kw: string) => lowercase.includes(kw));
      if (isMatch) {
        // Record event timestamp for self-excitement boost
        const timestamps = this.eventTimestamps.get(trend.trendId) || [];
        timestamps.push(now);
        this.eventTimestamps.set(trend.trendId, timestamps.slice(-50)); // keep last 50 events

        const hawkesHeat = this.computeHawkesIntensity(trend.trendId, now);
        const bonus = (hawkesHeat / 1000) * (trend.lifecycleStage === 'PEAK' ? 1.25 : 1.0);
        return { trendBonus: Number(Math.min(1.0, bonus).toFixed(2)), matchedTrend: trend };
      }
    }
    return { trendBonus: 0.0 };
  }

  public stepTrends(): void {
    const now = Date.now();
    for (const trend of this.activeTrends.values()) {
      const hawkesHeat = this.computeHawkesIntensity(trend.trendId, now);
      trend.heatIndex = Math.min(1000, Math.max(0, hawkesHeat));

      if (trend.heatIndex < 200) {
        trend.lifecycleStage = 'DECLINING';
      } else if (trend.heatIndex < 500) {
        trend.lifecycleStage = 'SATURATED';
      } else if (trend.heatIndex >= 800) {
        trend.lifecycleStage = 'PEAK';
      }
    }
  }
}
