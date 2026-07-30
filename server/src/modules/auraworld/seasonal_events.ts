import { WorldEventBus } from './event_bus.js';
import { SeasonalEvent } from './types.js';

export class SeasonalEventsEngine {
  private eventBus: WorldEventBus;
  private seasonalEvents: SeasonalEvent[] = [
    { id: 'seas_black_friday', name: 'Black Friday / Cyber Week', season: 'Autumn', intentMultiplier: 2.4, active: false },
    { id: 'seas_new_year', name: 'New Year Resolutions & Goal Setting', season: 'Winter', intentMultiplier: 1.8, active: false },
    { id: 'seas_summer_vibe', name: 'Summer Travel & Outdoor Trends', season: 'Summer', intentMultiplier: 1.5, active: false },
    { id: 'seas_spring_refresh', name: 'Spring Product Launches', season: 'Spring', intentMultiplier: 1.3, active: false }
  ];

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Updates active seasonal events based on current season tick
   */
  public async processTick(simTimeSec: number, currentSeason: string): Promise<SeasonalEvent[]> {
    for (const evt of this.seasonalEvents) {
      const wasActive = evt.active;
      evt.active = evt.season === currentSeason;

      if (evt.active && !wasActive) {
        await this.eventBus.publish({
          type: 'SEASONAL_SHIFT',
          timestamp: new Date().toISOString(),
          simulatedTimeSec: simTimeSec,
          payload: { eventName: evt.name, intentMultiplier: evt.intentMultiplier }
        });
      }
    }

    return this.seasonalEvents.filter(e => e.active);
  }

  public getEvents(): SeasonalEvent[] {
    return this.seasonalEvents;
  }
}
