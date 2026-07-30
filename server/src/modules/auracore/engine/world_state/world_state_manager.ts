import { WorldStateSnapshot, WorldStateDelta } from '../contracts/engine.types.js';
import { SimulationEventBus } from '../event_bus/event_bus.js';
import { SIMULATION_EVENT_TOPICS } from '../contracts/events.js';

/**
 * World State Manager Module
 * Centralized state store for global social media ecosystem variables.
 */
export class WorldStateManager {
  private snapshot: WorldStateSnapshot;

  constructor(initialNiche?: string) {
    this.snapshot = {
      step: 0,
      timestamp: Date.now(),
      activeNicheSat: {
        [initialNiche || 'Tech & Entrepreneurship']: 45.0,
        'Short-Form Entertainment': 78.2,
        'Educational & How-To': 32.1
      },
      remainingAttentionBudget: 1000000,
      globalMoodVector: {
        curiosity: 0.75,
        humor: 0.50,
        skepticism: 0.35,
        satisfaction: 0.60
      },
      activeContentPoolSize: 1500
    };
  }

  public getSnapshot(): WorldStateSnapshot {
    return JSON.parse(JSON.stringify(this.snapshot));
  }

  public applyDelta(delta: WorldStateDelta, simulationId?: string, eventBus?: SimulationEventBus): WorldStateSnapshot {
    this.snapshot.step = delta.step;
    this.snapshot.timestamp = Date.now();

    if (delta.consumedAttention) {
      this.snapshot.remainingAttentionBudget = Math.max(0, this.snapshot.remainingAttentionBudget - delta.consumedAttention);
    }

    if (delta.nicheSaturationDelta) {
      Object.entries(delta.nicheSaturationDelta).forEach(([niche, satDelta]) => {
        const currentSat = this.snapshot.activeNicheSat[niche] || 40.0;
        this.snapshot.activeNicheSat[niche] = Math.min(100.0, Math.max(0.0, Number((currentSat + satDelta).toFixed(2))));
      });
    }

    if (delta.moodDelta) {
      this.snapshot.globalMoodVector = {
        curiosity: this.clamp(this.snapshot.globalMoodVector.curiosity + (delta.moodDelta.curiosity || 0)),
        humor: this.clamp(this.snapshot.globalMoodVector.humor + (delta.moodDelta.humor || 0)),
        skepticism: this.clamp(this.snapshot.globalMoodVector.skepticism + (delta.moodDelta.skepticism || 0)),
        satisfaction: this.clamp(this.snapshot.globalMoodVector.satisfaction + (delta.moodDelta.satisfaction || 0))
      };
    }

    if (eventBus && simulationId) {
      eventBus.publish(SIMULATION_EVENT_TOPICS.WORLD_STATE_MUTATED, simulationId, this.snapshot);
    }

    return this.getSnapshot();
  }

  private clamp(val: number): number {
    return Number(Math.min(1.0, Math.max(0.0, val)).toFixed(2));
  }
}
