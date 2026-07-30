import { WorldEventBus } from './event_bus.js';
import { PlatformHealthMetrics } from './types.js';

export class PlatformHealthEngine {
  private state: PlatformHealthMetrics;
  private eventBus: WorldEventBus;

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.state = {
      activeViewersDAU: 450000000,
      activeCreatorsMAU: 32000000,
      viewerRetentionRatePct: 84.5,
      creatorChurnRiskPct: 4.2,
      clickbaitToxicityIndex: 0.18,
      adSaturationScore: 0.28
    };
  }

  /**
   * Recalculates platform ecosystem health per simulation tick
   */
  public async processTick(simTimeSec: number, globalFatigue: number): Promise<PlatformHealthMetrics> {
    // High fatigue increases viewer retention loss & toxicity perception
    if (globalFatigue > 0.7) {
      this.state.viewerRetentionRatePct = Number(Math.max(70.0, this.state.viewerRetentionRatePct - 0.1).toFixed(1));
      this.state.clickbaitToxicityIndex = Number(Math.min(0.8, this.state.clickbaitToxicityIndex + 0.01).toFixed(2));
    } else {
      this.state.viewerRetentionRatePct = Number(Math.min(92.0, this.state.viewerRetentionRatePct + 0.05).toFixed(1));
      this.state.clickbaitToxicityIndex = Number(Math.max(0.05, this.state.clickbaitToxicityIndex - 0.005).toFixed(2));
    }

    if (this.state.clickbaitToxicityIndex > 0.4) {
      await this.eventBus.publish({
        type: 'HEALTH_WARNING',
        timestamp: new Date().toISOString(),
        simulatedTimeSec: simTimeSec,
        payload: {
          warning: 'Elevated Clickbait Toxicity Index',
          toxicityIndex: this.state.clickbaitToxicityIndex
        }
      });
    }

    return { ...this.state };
  }

  public getMetrics(): PlatformHealthMetrics {
    return { ...this.state };
  }
}
