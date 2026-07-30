import { WorldEventBus } from './event_bus.js';
import { Subcommunity } from './types.js';

export class CommunityEngine {
  private eventBus: WorldEventBus;
  private communities: Map<string, Subcommunity> = new Map();

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.initializeDefaultCommunities();
  }

  private initializeDefaultCommunities(): void {
    const defaults: Subcommunity[] = [
      {
        id: 'comm_tech_founders',
        name: 'B2B Founder & SaaS Community',
        nicheTopic: 'marketing_and_growth',
        activeViewerCount: 145000,
        cohesionScore: 0.88,
        dominantArchetype: 'High-Intent Millennial Founder',
        connectedCommunityIds: ['comm_creator_economy', 'comm_ai_researchers']
      },
      {
        id: 'comm_creator_economy',
        name: 'Short-Form Creators & Editors',
        nicheTopic: 'video_editing_and_hooks',
        activeViewerCount: 320000,
        cohesionScore: 0.92,
        dominantArchetype: 'Impatient Zoomer',
        connectedCommunityIds: ['comm_tech_founders', 'comm_lifestyle']
      },
      {
        id: 'comm_ai_researchers',
        name: 'AI Researchers & Engineers',
        nicheTopic: 'machine_learning',
        activeViewerCount: 85000,
        cohesionScore: 0.95,
        dominantArchetype: 'Skeptical Tech Enthusiast',
        connectedCommunityIds: ['comm_tech_founders']
      },
      {
        id: 'comm_lifestyle',
        name: 'Aesthetic Lifestyle & Design',
        nicheTopic: 'visual_aesthetics',
        activeViewerCount: 450000,
        cohesionScore: 0.76,
        dominantArchetype: 'Casual Lifestyle Viewer',
        connectedCommunityIds: ['comm_creator_economy']
      }
    ];

    defaults.forEach(c => this.communities.set(c.id, c));
  }

  /**
   * Simulates audience migration and subcommunity graph evolution
   */
  public async processTick(simTimeSec: number): Promise<Subcommunity[]> {
    // Migration between connected communities
    for (const comm of this.communities.values()) {
      if (comm.connectedCommunityIds.length > 0) {
        const targetId = comm.connectedCommunityIds[Math.floor(Math.random() * comm.connectedCommunityIds.length)];
        const targetComm = this.communities.get(targetId);

        if (targetComm) {
          const migratedCount = Math.round(comm.activeViewerCount * 0.005); // 0.5% migration per tick
          comm.activeViewerCount -= migratedCount;
          targetComm.activeViewerCount += migratedCount;

          if (migratedCount > 500) {
            await this.eventBus.publish({
              type: 'COMMUNITY_MIGRATED',
              timestamp: new Date().toISOString(),
              simulatedTimeSec: simTimeSec,
              payload: {
                fromCommunity: comm.name,
                toCommunity: targetComm.name,
                migratedCount
              }
            });
          }
        }
      }
    }

    return Array.from(this.communities.values());
  }

  public getCommunities(): Subcommunity[] {
    return Array.from(this.communities.values());
  }
}
