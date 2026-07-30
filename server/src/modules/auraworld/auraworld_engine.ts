import { WorldEventBus } from './event_bus.js';
import { TimeEngine } from './time_engine.js';
import { TrendEngine } from './trend_engine.js';
import { CommunityEngine } from './community_engine.js';
import { GlobalEventsEngine } from './global_events_engine.js';
import { AttentionEconomyEngine } from './attention_economy.js';
import { RecommendationPolicyEngine } from './recommendation_policy.js';
import { PlatformHealthEngine } from './platform_health.js';
import { CreatorEcosystemEngine } from './creator_ecosystem.js';
import { SeasonalEventsEngine } from './seasonal_events.js';
import { TrendingMusicEngine } from './trending_music.js';
import { TrendingFormatsEngine } from './trending_formats.js';
import { AuraWorldSnapshot } from './types.js';

export class AuraWorldEngine {
  public readonly worldId: string;
  public readonly eventBus: WorldEventBus;

  // 11 Core Subsystem Engines
  public readonly timeEngine: TimeEngine;
  public readonly trendEngine: TrendEngine;
  public readonly communityEngine: CommunityEngine;
  public readonly globalEventsEngine: GlobalEventsEngine;
  public readonly attentionEconomyEngine: AttentionEconomyEngine;
  public readonly recommendationPolicyEngine: RecommendationPolicyEngine;
  public readonly platformHealthEngine: PlatformHealthEngine;
  public readonly creatorEcosystemEngine: CreatorEcosystemEngine;
  public readonly seasonalEventsEngine: SeasonalEventsEngine;
  public readonly trendingMusicEngine: TrendingMusicEngine;
  public readonly trendingFormatsEngine: TrendingFormatsEngine;

  private totalEventsProcessedCount = 0;

  constructor(worldId = `world_${Date.now()}`) {
    this.worldId = worldId;
    this.eventBus = new WorldEventBus();

    // Subscribe to track total event volume
    this.eventBus.subscribe('TIME_TICK', () => {
      this.totalEventsProcessedCount++;
    });

    // Initialize all 11 modules with shared event bus
    this.timeEngine = new TimeEngine(this.eventBus);
    this.trendEngine = new TrendEngine(this.eventBus);
    this.communityEngine = new CommunityEngine(this.eventBus);
    this.globalEventsEngine = new GlobalEventsEngine(this.eventBus);
    this.attentionEconomyEngine = new AttentionEconomyEngine(this.eventBus);
    this.recommendationPolicyEngine = new RecommendationPolicyEngine(this.eventBus);
    this.platformHealthEngine = new PlatformHealthEngine(this.eventBus);
    this.creatorEcosystemEngine = new CreatorEcosystemEngine(this.eventBus);
    this.seasonalEventsEngine = new SeasonalEventsEngine(this.eventBus);
    this.trendingMusicEngine = new TrendingMusicEngine(this.eventBus);
    this.trendingFormatsEngine = new TrendingFormatsEngine(this.eventBus);
  }

  /**
   * Advances the world operating system clock by 1 tick, triggering state updates across all 11 modules
   */
  public async stepWorld(deltaRealSeconds = 1.0): Promise<AuraWorldSnapshot> {
    // 1. Advance Time Engine
    const timeState = await this.timeEngine.tick(deltaRealSeconds);
    const simSec = timeState.currentSimulatedTimeSec;

    // 2. Execute module updates in parallel
    await Promise.all([
      this.trendEngine.processTick(simSec),
      this.communityEngine.processTick(simSec),
      this.globalEventsEngine.processTick(simSec),
      this.attentionEconomyEngine.processTick(simSec, timeState.timeOfDayHour),
      this.creatorEcosystemEngine.processTick(simSec),
      this.seasonalEventsEngine.processTick(simSec, timeState.currentSeason),
      this.trendingMusicEngine.processTick(simSec),
      this.trendingFormatsEngine.processTick(simSec)
    ]);

    // 3. Process Platform Health (depends on attention economy fatigue)
    const attState = this.attentionEconomyEngine.getState();
    await this.platformHealthEngine.processTick(simSec, attState.globalFatigueIndex);

    return this.getSnapshot();
  }

  /**
   * Captures immutable snapshot of complete World OS State
   */
  public getSnapshot(): AuraWorldSnapshot {
    return {
      worldId: this.worldId,
      simulatedTime: this.timeEngine.getState(),
      attentionEconomy: this.attentionEconomyEngine.getState(),
      recommendationPolicy: this.recommendationPolicyEngine.getState(),
      platformHealth: this.platformHealthEngine.getMetrics(),
      activeTrends: this.trendEngine.getTrends(),
      communities: this.communityEngine.getCommunities(),
      globalEvents: this.globalEventsEngine.getActiveEvents(),
      creators: this.creatorEcosystemEngine.getCreators(),
      seasonalEvents: this.seasonalEventsEngine.getEvents(),
      trendingMusic: this.trendingMusicEngine.getTracks(),
      trendingFormats: this.trendingFormatsEngine.getFormats(),
      totalEventsProcessed: this.totalEventsProcessedCount
    };
  }
}

// Global Singleton World OS Instance
export const globalAuraWorld = new AuraWorldEngine('aura_world_prime');
