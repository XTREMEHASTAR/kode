import { WorldEventBus } from './event_bus.js';
import { RecommendationPolicyState } from './types.js';

export class RecommendationPolicyEngine {
  private state: RecommendationPolicyState;
  private eventBus: WorldEventBus;

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.state = {
      explorationRatio: 0.20,         // 20% discovery, 80% exploitation
      diversityPenaltyWeight: 0.35,
      coldStartBoostMultiplier: 1.8,
      fatigueDecayPenalty: 0.40,
      authorAuthorityWeight: 0.25
    };
  }

  /**
   * Updates recommendation policy configuration dynamically (e.g. algorithm updates)
   */
  public async updatePolicy(newPolicy: Partial<RecommendationPolicyState>, simTimeSec = 0): Promise<RecommendationPolicyState> {
    this.state = { ...this.state, ...newPolicy };

    await this.eventBus.publish({
      type: 'POLICY_CHANGED',
      timestamp: new Date().toISOString(),
      simulatedTimeSec: simTimeSec,
      payload: { updatedPolicy: { ...this.state } }
    });

    return { ...this.state };
  }

  public getState(): RecommendationPolicyState {
    return { ...this.state };
  }
}
