import { WorldEventBus } from './event_bus.js';
import { TrendTopic } from './types.js';

export class TrendEngine {
  private eventBus: WorldEventBus;
  private activeTrends: Map<string, TrendTopic> = new Map();

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.initializeDefaultTrends();
  }

  private initializeDefaultTrends(): void {
    const defaultTrends: TrendTopic[] = [
      {
        id: 'tr_hook_frameworks',
        name: '3-Second Retention Hooks',
        category: 'Creator Economy',
        susceptiblePopulation: 500000,
        infectedPopulation: 120000,
        recoveredPopulation: 30000,
        viralityR0: 2.4,
        decayHalfLifeHours: 48,
        peakTimeSec: 0,
        status: 'PEAKING'
      },
      {
        id: 'tr_ai_simulation',
        name: 'AI Audience Simulators',
        category: 'Tech',
        susceptiblePopulation: 800000,
        infectedPopulation: 45000,
        recoveredPopulation: 5000,
        viralityR0: 3.8,
        decayHalfLifeHours: 72,
        peakTimeSec: 0,
        status: 'EMERGING'
      },
      {
        id: 'tr_brutalist_editing',
        name: 'Brutalist Fast Cuts',
        category: 'Entertainment',
        susceptiblePopulation: 300000,
        infectedPopulation: 85000,
        recoveredPopulation: 140000,
        viralityR0: 0.9,
        decayHalfLifeHours: 24,
        peakTimeSec: 0,
        status: 'DECAYING'
      }
    ];

    defaultTrends.forEach(t => this.activeTrends.set(t.id, t));
  }

  /**
   * Advances trend SIR epidemic diffusion dynamics per simulation tick
   */
  public async processTick(simTimeSec: number): Promise<TrendTopic[]> {
    const updatedTrends: TrendTopic[] = [];

    for (const [id, trend] of this.activeTrends.entries()) {
      if (trend.status === 'EMERGING') {
        // Exponential growth: I_{t+1} = I_t * (1 + beta * S_t / N)
        const infectionGrowth = Math.round(trend.infectedPopulation * (trend.viralityR0 * 0.08));
        trend.infectedPopulation += infectionGrowth;
        trend.susceptiblePopulation = Math.max(0, trend.susceptiblePopulation - infectionGrowth);

        if (trend.infectedPopulation >= trend.susceptiblePopulation * 0.4) {
          trend.status = 'PEAKING';
          trend.peakTimeSec = simTimeSec;
          await this.eventBus.publish({
            type: 'TREND_PEAKED',
            timestamp: new Date().toISOString(),
            simulatedTimeSec: simTimeSec,
            payload: { trendId: id, name: trend.name }
          });
        }
      } else if (trend.status === 'PEAKING') {
        // Transition to recovery & fatigue
        const recoveryRate = Math.round(trend.infectedPopulation * 0.05);
        trend.infectedPopulation = Math.max(0, trend.infectedPopulation - recoveryRate);
        trend.recoveredPopulation += recoveryRate;

        if (trend.infectedPopulation <= trend.recoveredPopulation * 0.5) {
          trend.status = 'DECAYING';
          await this.eventBus.publish({
            type: 'TREND_DECAYED',
            timestamp: new Date().toISOString(),
            simulatedTimeSec: simTimeSec,
            payload: { trendId: id, name: trend.name }
          });
        }
      } else if (trend.status === 'DECAYING') {
        // Half-life decay
        trend.infectedPopulation = Math.floor(trend.infectedPopulation * 0.92);
        if (trend.infectedPopulation < 500) {
          trend.status = 'EXHAUSTED';
        }
      }

      updatedTrends.push({ ...trend });
    }

    return updatedTrends;
  }

  /**
   * Creates a new emerging trend
   */
  public async createTrend(name: string, category: TrendTopic['category'], viralityR0 = 2.5): Promise<TrendTopic> {
    const newTrend: TrendTopic = {
      id: `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      category,
      susceptiblePopulation: 600000,
      infectedPopulation: 5000,
      recoveredPopulation: 0,
      viralityR0,
      decayHalfLifeHours: 48,
      peakTimeSec: 0,
      status: 'EMERGING'
    };

    this.activeTrends.set(newTrend.id, newTrend);

    await this.eventBus.publish({
      type: 'TREND_BORN',
      timestamp: new Date().toISOString(),
      simulatedTimeSec: 0,
      payload: newTrend
    });

    return newTrend;
  }

  public getTrends(): TrendTopic[] {
    return Array.from(this.activeTrends.values());
  }
}
