import { SimulationEventBus } from './event_bus/event_bus.js';
import { EnvironmentEngine } from './environment/environment_engine.js';
import { WorldStateManager } from './world_state/world_state_manager.js';
import { ViewerArchetypeSystem } from './archetypes/archetype_system.js';
import { SyntheticPopulationGenerator } from './population/population_generator.js';
import { RecommendationEngine } from './recommendation/recommendation_engine.js';
import { TrendEngine } from './trend/trend_engine.js';
import { CommunityEngine } from './community/community_engine.js';
import { ContentCompetitionEngine } from './competition/competition_engine.js';
import { MemoryEngine } from './memory/memory_engine.js';
import { SimulationScheduler } from './scheduler/simulation_scheduler.js';
import { TelemetryPipeline } from './telemetry/telemetry_pipeline.js';
import { SimulationTelemetryResult, EnvironmentConfig } from './contracts/engine.types.js';

export interface ExecuteAuraCoreSimulationInput {
  title: string;
  scriptText: string;
  durationSec?: number;
  populationSize?: number;
  contentType?: string;
  platform?: 'TIKTOK' | 'REELS' | 'YOUTUBE_SHORTS' | 'X_FEED';
}

/**
 * AuraCore AI Simulation Environment Engine
 * Master game engine orchestrator combining all 12 decoupled sub-engines:
 * 1. Environment Engine
 * 2. World State Manager
 * 3. Viewer Archetype System
 * 4. Synthetic Population Generator
 * 5. Recommendation Engine
 * 6. Trend Engine
 * 7. Community Engine
 * 8. Content Competition Engine
 * 9. Memory Engine
 * 10. Event Bus
 * 11. Simulation Scheduler
 * 12. Telemetry Pipeline
 */
export class AuraCoreSimulationEnvironment {
  public eventBus: SimulationEventBus;
  public environmentEngine: EnvironmentEngine;
  public worldStateManager: WorldStateManager;
  public archetypeSystem: ViewerArchetypeSystem;
  public populationGenerator: SyntheticPopulationGenerator;
  public recommendationEngine: RecommendationEngine;
  public trendEngine: TrendEngine;
  public communityEngine: CommunityEngine;
  public competitionEngine: ContentCompetitionEngine;
  public memoryEngine: MemoryEngine;
  public scheduler: SimulationScheduler;
  public telemetryPipeline: TelemetryPipeline;

  constructor(envConfig?: Partial<EnvironmentConfig>) {
    this.eventBus = new SimulationEventBus();
    this.environmentEngine = new EnvironmentEngine(envConfig);
    this.worldStateManager = new WorldStateManager(this.environmentEngine.getConfig().nicheContext);
    this.archetypeSystem = new ViewerArchetypeSystem();
    this.populationGenerator = new SyntheticPopulationGenerator(this.archetypeSystem);
    this.recommendationEngine = new RecommendationEngine();
    this.trendEngine = new TrendEngine();
    this.communityEngine = new CommunityEngine();
    this.competitionEngine = new ContentCompetitionEngine();
    this.memoryEngine = new MemoryEngine();
    this.scheduler = new SimulationScheduler(this.eventBus);
    this.telemetryPipeline = new TelemetryPipeline(this.eventBus);
  }

  public async runSimulation(input: ExecuteAuraCoreSimulationInput): Promise<SimulationTelemetryResult> {
    const simulationId = `sim_env_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const contentDnaId = `dna_${Date.now()}`;
    const durationSec = input.durationSec || Math.max(10, Math.ceil(input.scriptText.trim().split(/\s+/).length / 2.5));
    const popSize = input.populationSize || 1000;

    if (input.platform) {
      this.environmentEngine.updateConfig({ platform: input.platform }, this.eventBus, simulationId);
    }

    const _agents = this.populationGenerator.generateSwarm({
      populationSize: popSize,
      demographicMix: {
        'ZOOMER_SKIMMER': 0.35,
        'MILLENNIAL_FOUNDER': 0.40,
        'SKEPTICAL_TECHIE': 0.25
      }
    }, simulationId, this.eventBus);

    const firstLine = input.scriptText.split('\n')[0] || '';
    const isGoodHook = /(stop|never|don't|mistake|wrong|worst|secret|hidden)/i.test(firstLine);
    const { trendBonus } = this.trendEngine.evaluateTrendMatch(input.scriptText);
    const competitionSlot = this.competitionEngine.simulateFeedSlotAuction(contentDnaId, isGoodHook ? 88 : 60, 'Tech & Entrepreneurship');

    const hook3s = isGoodHook ? (88.5 + trendBonus * 5) : 62.0;

    this.scheduler.init({
      simulationId,
      totalDurationSeconds: durationSec,
      ticksPerSecond: 1,
      parallelismWorkerCount: 4
    });

    await this.scheduler.executeTicks((s) => {
      const tickContext = this.environmentEngine.evaluateTickContext(s, simulationId, this.eventBus);
      const decay = Math.exp(-s / (durationSec * 0.8));
      const baseRetention = 100 * decay + (isGoodHook ? 10 : 0) + trendBonus * 2;
      const retentionPct = Math.max(22.0, Math.min(99.0, Number((baseRetention * tickContext.noiseVector.viralMultiplier * competitionSlot.competitiveDisplacementPenalty).toFixed(1))));

      // Record Memory Engine impressions for sample agents
      _agents.slice(0, 10).forEach(agent => {
        this.memoryEngine.recordImpression(agent.agentId, contentDnaId, 'creator_active', 'HOOK_CURIOSITY', retentionPct / 100);
      });

      this.telemetryPipeline.recordFrame({
        second: s,
        activeViewersCount: Math.round(popSize * (retentionPct / 100)),
        retentionPercentage: retentionPct,
        dropOffCount: s === 1 ? 0 : Math.round(popSize * 0.04),
        cumulativeLikes: Math.round(popSize * 0.12 * (s / durationSec)),
        cumulativeComments: Math.round(popSize * 0.03 * (s / durationSec)),
        cumulativeShares: Math.round(popSize * 0.05 * (s / durationSec)),
        cumulativeSaves: Math.round(popSize * 0.08 * (s / durationSec)),
        averageEmotionVector: {
          curiosity: Number((0.8 - (s / durationSec) * 0.3).toFixed(2)),
          humor: 0.4,
          skepticism: 0.3,
          satisfaction: Number((0.5 + (s / durationSec) * 0.4).toFixed(2))
        }
      }, simulationId);

      this.worldStateManager.applyDelta({
        step: s,
        consumedAttention: Math.round(popSize * (retentionPct / 100))
      }, simulationId, this.eventBus);
    });

    const { topSyntheticReactions } = this.communityEngine.generateSyntheticReactions(input.scriptText, isGoodHook);
    const avgRetention = Number((hook3s * 0.8).toFixed(1));
    const distributionWaves = this.recommendationEngine.evaluateWaveGates(
      { contentDnaId, title: input.title, niche: 'Tech & Entrepreneurship', hookQualityScore: isGoodHook ? 85 : 55, pacingScore: 78, emotionalHookScore: 80, durationSec },
      hook3s,
      avgRetention,
      isGoodHook
    );

    return this.telemetryPipeline.compileTelemetryResult(
      simulationId,
      contentDnaId,
      durationSec,
      popSize,
      isGoodHook,
      distributionWaves,
      topSyntheticReactions
    );
  }
}
