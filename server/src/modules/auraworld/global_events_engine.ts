import { WorldEventBus } from './event_bus.js';
import { GlobalEventPayload } from './types.js';

export class GlobalEventsEngine {
  private eventBus: WorldEventBus;
  private activeEvents: Map<string, GlobalEventPayload> = new Map();

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Triggers a new platform or world macro event
   */
  public async triggerGlobalEvent(
    title: string,
    description: string,
    severity: GlobalEventPayload['severity'],
    affectedCategories: string[],
    attentionMultiplier = 1.5,
    durationSec = 86400
  ): Promise<GlobalEventPayload> {
    const eventPayload: GlobalEventPayload = {
      id: `gev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title,
      description,
      severity,
      affectedCategories,
      attentionMultiplier,
      expiresSimTimeSec: Date.now() / 1000 + durationSec
    };

    this.activeEvents.set(eventPayload.id, eventPayload);

    await this.eventBus.publish({
      type: 'GLOBAL_EVENT_TRIGGERED',
      timestamp: new Date().toISOString(),
      simulatedTimeSec: Date.now() / 1000,
      payload: eventPayload
    });

    return eventPayload;
  }

  /**
   * Purges expired global events
   */
  public processTick(simTimeSec: number): GlobalEventPayload[] {
    for (const [id, evt] of this.activeEvents.entries()) {
      if (simTimeSec >= evt.expiresSimTimeSec) {
        this.activeEvents.delete(id);
      }
    }
    return Array.from(this.activeEvents.values());
  }

  public getActiveEvents(): GlobalEventPayload[] {
    return Array.from(this.activeEvents.values());
  }
}
