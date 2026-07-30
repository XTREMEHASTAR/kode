import { ContentEntity, ContentLifecycleState, EngagementMetrics } from './ContentEntity';
import { ContentLifecycleStateMachine } from './ContentLifecycleStateMachine';
import { CandidatePoolManager } from './CandidatePoolManager';
import { ContentLifecycleTelemetry, LifecycleEventType } from './ContentLifecycleTelemetry';
import { SimulatedContent } from '../creator/CreatorAgent';
import { SeededPRNG } from '../environment/EnvironmentTelemetry';

export interface ContentLifecycleEngineConfig {
  seed?: number;
  simulationId?: string;
}

export class ContentLifecycleEngine {
  private entities: Map<string, ContentEntity> = new Map();
  private candidatePoolManager: CandidatePoolManager;
  private telemetry: ContentLifecycleTelemetry;
  private prng: SeededPRNG;
  private simulationId: string;

  constructor(config: ContentLifecycleEngineConfig = {}) {
    const seed = config.seed ?? 2048;
    this.simulationId = config.simulationId ?? `sim_${Date.now()}`;
    this.prng = new SeededPRNG(seed);
    this.candidatePoolManager = new CandidatePoolManager();
    this.telemetry = new ContentLifecycleTelemetry();
  }

  /**
   * Registers a new Content entity in DRAFT state
   */
  public createContent(simulatedContent: SimulatedContent, platformId: string = 'instagram_reels'): ContentEntity {
    const entity: ContentEntity = {
      id: simulatedContent.id,
      creatorId: simulatedContent.creatorId,
      platformId,
      publishTimestamp: simulatedContent.timestamp,
      simulationId: this.simulationId,
      state: 'DRAFT',
      stateHistory: [{ state: 'DRAFT', timestamp: Date.now() }],
      intelligence: {
        dnaVector: [...simulatedContent.dnaVector],
        hookScore: simulatedContent.hookScore,
        visualScore: 0.85,
        audioScore: 0.80,
        narrativeScore: 0.78,
        editingScore: 0.82,
        thumbnailScore: 0.88,
        ctaScore: 0.75,
        trendAffinity: simulatedContent.trendAlignmentScore,
        audienceMatch: 0.90
      },
      distribution: {
        currentFeedRank: 0,
        candidatePoolPosition: 0,
        recommendationScore: 0,
        distributionWave: 1,
        reach: 0,
        impressions: 0
      },
      engagementMetrics: {
        views: 0,
        watchTimeMs: 0,
        retentionCurve: new Array(30).fill(1.0).map((val, idx) => Number((val * Math.exp(-0.03 * idx)).toFixed(2))),
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        follows: 0,
        completionRate: 0.75
      },
      recommendationHistory: [],
      historicalAnalytics: { peakRetentionRate: 0.85, viralVelocityScore: 50, decayHalfLifeHours: 48 }
    };

    this.entities.set(entity.id, entity);

    this.telemetry.logEvent({
      timestamp: Date.now(),
      simulationTick: 0,
      contentId: entity.id,
      creatorId: entity.creatorId,
      eventType: 'CONTENT_CREATED',
      newState: 'DRAFT',
      environmentSnapshot: { competitionIndex: 0.45, platformId },
      recommendationSnapshot: { rankScore: 0, distributionWave: 1 }
    });

    return entity;
  }

  /**
   * Deterministic State Transition
   */
  public transitionState(contentId: string, targetState: ContentLifecycleState, simulationTick: number = 0): ContentEntity {
    const entity = this.entities.get(contentId);
    if (!entity) throw new Error(`Content entity not found: ${contentId}`);

    ContentLifecycleStateMachine.validateTransition(entity.state, targetState);
    const previousState = entity.state;

    entity.state = targetState;
    entity.stateHistory.push({ state: targetState, timestamp: Date.now() });

    // Pool sync
    if (targetState === 'CANDIDATE_POOL') {
      this.candidatePoolManager.addCandidate(entity);
      this.logTelemetryEvent('ENTERED_CANDIDATE_POOL', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'PUBLISHED') {
      this.logTelemetryEvent('CONTENT_PUBLISHED', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'RECOMMENDED') {
      this.logTelemetryEvent('RECOMMENDED', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'VIEWER_EXPOSURE' && previousState !== 'VIEWER_EXPOSURE') {
      this.logTelemetryEvent('FIRST_VIEW', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'GROWTH') {
      this.logTelemetryEvent('TRENDING', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'PEAK') {
      this.logTelemetryEvent('PEAK_REACHED', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'DECAY') {
      this.logTelemetryEvent('DECAY_STARTED', entity, previousState, targetState, simulationTick);
    } else if (targetState === 'ARCHIVED') {
      this.candidatePoolManager.removeCandidate(entity.platformId, entity.id);
      this.logTelemetryEvent('ARCHIVED', entity, previousState, targetState, simulationTick);
    }

    return entity;
  }

  /**
   * Rollback state to previous step
   */
  public rollbackState(contentId: string): ContentEntity {
    const entity = this.entities.get(contentId);
    if (!entity) throw new Error(`Content entity not found: ${contentId}`);
    if (entity.stateHistory.length <= 1) {
      throw new Error(`Cannot rollback initial state for content ${contentId}`);
    }

    entity.stateHistory.pop(); // Remove current state
    const prevState = entity.stateHistory[entity.stateHistory.length - 1].state;
    entity.state = prevState;

    return entity;
  }

  public recordEngagement(contentId: string, delta: Partial<EngagementMetrics>): ContentEntity {
    const entity = this.entities.get(contentId);
    if (!entity) throw new Error(`Content entity not found: ${contentId}`);

    const isFirstShare = entity.engagementMetrics.shares === 0 && (delta.shares ?? 0) > 0;

    entity.engagementMetrics.views += delta.views ?? 0;
    entity.engagementMetrics.likes += delta.likes ?? 0;
    entity.engagementMetrics.shares += delta.shares ?? 0;
    entity.engagementMetrics.comments += delta.comments ?? 0;
    entity.engagementMetrics.saves += delta.saves ?? 0;

    if (isFirstShare) {
      this.logTelemetryEvent('FIRST_SHARE', entity, entity.state, entity.state, 0);
    }

    return entity;
  }

  public getContent(contentId: string): ContentEntity | undefined {
    return this.entities.get(contentId);
  }

  public getCandidatePool(platformId: string, limit: number = 100): ContentEntity[] {
    return this.candidatePoolManager.getCandidatePool(platformId, limit);
  }

  public getTelemetryLogs() {
    return this.telemetry.getEvents();
  }

  private logTelemetryEvent(
    eventType: LifecycleEventType, 
    entity: ContentEntity, 
    previousState: ContentLifecycleState, 
    newState: ContentLifecycleState,
    simulationTick: number
  ): void {
    this.telemetry.logEvent({
      timestamp: Date.now(),
      simulationTick,
      contentId: entity.id,
      creatorId: entity.creatorId,
      eventType,
      previousState,
      newState,
      environmentSnapshot: { competitionIndex: 0.42, platformId: entity.platformId },
      recommendationSnapshot: { rankScore: entity.distribution.recommendationScore, distributionWave: entity.distribution.distributionWave }
    });
  }
}
