import { WorldEventBus } from './event_bus.js';
import { SyntheticCreatorProfile } from './types.js';

export class CreatorEcosystemEngine {
  private eventBus: WorldEventBus;
  private creators: Map<string, SyntheticCreatorProfile> = new Map();

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.initializeDefaultCreators();
  }

  private initializeDefaultCreators(): void {
    const defaults: SyntheticCreatorProfile[] = [
      {
        id: 'cr_alex_growth',
        username: 'alex_growth_hacks',
        nicheCategory: 'Creator Economy',
        followerCount: 245000,
        postingFrequencyPerWeek: 4,
        authorityScore: 0.88,
        churnRisk: 0.12,
        lastPostedSimTimeSec: 0
      },
      {
        id: 'cr_tech_pulse',
        username: 'techpulse_daily',
        nicheCategory: 'Tech',
        followerCount: 520000,
        postingFrequencyPerWeek: 7,
        authorityScore: 0.94,
        churnRisk: 0.05,
        lastPostedSimTimeSec: 0
      },
      {
        id: 'cr_design_vibe',
        username: 'aesthetic_space',
        nicheCategory: 'Lifestyle',
        followerCount: 180000,
        postingFrequencyPerWeek: 3,
        authorityScore: 0.76,
        churnRisk: 0.25,
        lastPostedSimTimeSec: 0
      }
    ];

    defaults.forEach(c => this.creators.set(c.id, c));
  }

  /**
   * Evaluates creator posting activity and churn per simulation tick
   */
  public async processTick(simTimeSec: number): Promise<SyntheticCreatorProfile[]> {
    for (const creator of this.creators.values()) {
      // Check if due to post based on posting frequency
      const hoursPerPost = (7 * 24) / creator.postingFrequencyPerWeek;
      const elapsedHours = (simTimeSec - creator.lastPostedSimTimeSec) / 3600;

      if (elapsedHours >= hoursPerPost) {
        creator.lastPostedSimTimeSec = simTimeSec;
        creator.followerCount += Math.floor(Math.random() * 150) + 20;

        await this.eventBus.publish({
          type: 'CREATOR_POSTED',
          timestamp: new Date().toISOString(),
          simulatedTimeSec: simTimeSec,
          payload: { creatorId: creator.id, username: creator.username }
        });
      }
    }

    return Array.from(this.creators.values());
  }

  public getCreators(): SyntheticCreatorProfile[] {
    return Array.from(this.creators.values());
  }
}
