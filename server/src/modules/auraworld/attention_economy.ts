import { WorldEventBus } from './event_bus.js';
import { AttentionEconomyState } from './types.js';

export class AttentionEconomyEngine {
  private state: AttentionEconomyState;
  private eventBus: WorldEventBus;

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.state = {
      totalGlobalViewerCapacity: 10000000,
      activeAttentionPoolMinutes: 4500000,
      globalFatigueIndex: 0.25,
      competitionDensityScore: 0.65,
      peakUsageHourActive: true
    };
  }

  /**
   * Adjusts attention economy budgets per simulation tick
   */
  public async processTick(simTimeSec: number, timeOfDayHour: number): Promise<AttentionEconomyState> {
    // Peak hours: 18.0 to 22.0
    const isPeak = timeOfDayHour >= 18.0 && timeOfDayHour <= 22.0;
    this.state.peakUsageHourActive = isPeak;

    // Adjust pool minutes based on time of day multiplier
    const timeMultiplier = isPeak ? 1.4 : (timeOfDayHour >= 1.0 && timeOfDayHour <= 6.0 ? 0.3 : 0.9);
    this.state.activeAttentionPoolMinutes = Math.round(this.state.totalGlobalViewerCapacity * 0.45 * timeMultiplier);

    // Dynamic fatigue accumulation
    this.state.globalFatigueIndex = Number(
      Math.min(0.95, Math.max(0.1, 0.2 + (isPeak ? 0.3 : 0.1) + Math.sin(simTimeSec / 3600) * 0.1)).toFixed(2)
    );

    if (this.state.globalFatigueIndex >= 0.8) {
      await this.eventBus.publish({
        type: 'ATTENTION_SATURATED',
        timestamp: new Date().toISOString(),
        simulatedTimeSec: simTimeSec,
        payload: { fatigueIndex: this.state.globalFatigueIndex }
      });
    }

    return { ...this.state };
  }

  public getState(): AttentionEconomyState {
    return { ...this.state };
  }
}
