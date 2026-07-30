import { WorldEventBus } from './event_bus.js';
import { TimeState } from './types.js';

export class TimeEngine {
  private state: TimeState;
  private eventBus: WorldEventBus;

  constructor(eventBus: WorldEventBus, initialDilationFactor = 3600) {
    this.eventBus = eventBus;
    this.state = {
      currentSimulatedTimeSec: 0,
      tickCount: 0,
      dilationFactor: initialDilationFactor, // Default: 1 sec = 1 hour sim time
      timeOfDayHour: 12.0,
      dayOfWeek: 'Mon',
      currentSeason: 'Spring'
    };
  }

  /**
   * Advances the simulation clock by 1 tick
   */
  public async tick(deltaRealSeconds = 1.0): Promise<TimeState> {
    const elapsedSimSec = deltaRealSeconds * this.state.dilationFactor;
    this.state.currentSimulatedTimeSec += elapsedSimSec;
    this.state.tickCount += 1;

    // Calculate time of day (0.0 to 23.9)
    const totalHours = this.state.currentSimulatedTimeSec / 3600;
    this.state.timeOfDayHour = Number((totalHours % 24).toFixed(1));

    // Calculate day of week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
    const dayIndex = Math.floor((totalHours / 24) % 7);
    this.state.dayOfWeek = days[dayIndex];

    // Calculate season (365 days / 4 = 91.25 days per season)
    const dayOfYr = Math.floor(totalHours / 24) % 365;
    if (dayOfYr < 91) this.state.currentSeason = 'Spring';
    else if (dayOfYr < 182) this.state.currentSeason = 'Summer';
    else if (dayOfYr < 273) this.state.currentSeason = 'Autumn';
    else this.state.currentSeason = 'Winter';

    // Publish TIME_TICK event
    await this.eventBus.publish({
      type: 'TIME_TICK',
      timestamp: new Date().toISOString(),
      simulatedTimeSec: this.state.currentSimulatedTimeSec,
      payload: { ...this.state }
    });

    return { ...this.state };
  }

  public getState(): TimeState {
    return { ...this.state };
  }

  public setDilationFactor(factor: number): void {
    this.state.dilationFactor = Math.max(1, factor);
  }
}
