import { ContentEntity } from '../content/ContentEntity';
import { EnvironmentState } from '../environment/EnvironmentState';
import { EligibilityFilter } from './EligibilityFilter';
import { CandidateGenerator } from './CandidateGenerator';
import { ScoringEngine, ViewerProfile, ScoringFactorBreakdown } from './ScoringEngine';
import { DiversificationModule, ScoredContent } from './DiversificationModule';
import { FeedConstructor, FeedItem } from './FeedConstructor';
import { DistributionWaveManager } from './DistributionWaveManager';
import { RecommendationExplainability, RecommendationExplanation } from './RecommendationExplainability';
import { RecommendationTelemetry } from './RecommendationTelemetry';
import { SeededPRNG } from '../environment/EnvironmentTelemetry';

export interface RecommendationEngineConfig {
  seed?: number;
}

export class RecommendationFeedEngine {
  private eligibilityFilter: EligibilityFilter;
  private candidateGenerator: CandidateGenerator;
  private scoringEngine: ScoringEngine;
  private diversificationModule: DiversificationModule;
  private feedConstructor: FeedConstructor;
  private waveManager: DistributionWaveManager;
  private explainability: RecommendationExplainability;
  private telemetry: RecommendationTelemetry;
  private prng: SeededPRNG;

  constructor(config: RecommendationEngineConfig = {}) {
    const seed = config.seed ?? 4096;
    this.prng = new SeededPRNG(seed);
    this.eligibilityFilter = new EligibilityFilter();
    this.candidateGenerator = new CandidateGenerator();
    this.scoringEngine = new ScoringEngine();
    this.diversificationModule = new DiversificationModule();
    this.feedConstructor = new FeedConstructor();
    this.waveManager = new DistributionWaveManager();
    this.explainability = new RecommendationExplainability();
    this.telemetry = new RecommendationTelemetry();
  }

  /**
   * Generates a deterministic personalized viewer feed across the 10-stage pipeline
   */
  public generatePersonalizedFeed(
    viewer: ViewerProfile,
    allContent: ContentEntity[],
    env: EnvironmentState,
    limit: number = 20
  ): { feed: FeedItem[]; explanations: RecommendationExplanation[] } {
    // Stage 1 & 2: Eligibility Filtering
    const { eligible, rejected } = this.eligibilityFilter.filterEligibleContent(allContent);
    rejected.forEach(r => {
      this.telemetry.logEvent({
        timestamp: Date.now(),
        simulationTick: env.tickIndex,
        viewerId: viewer.id,
        contentId: r.content.id,
        eventType: 'CONTENT_REJECTED',
        details: r.reason
      });
    });

    // Stage 3 & 4: Candidate Generation & Feature Retrieval
    const candidates = this.candidateGenerator.retrieveCandidates(eligible, env.platformId, 200);

    // Stage 5 & 6: Multi-Factor Scoring & Ranking
    const scoredList: ScoredContent[] = candidates.map(content => ({
      content,
      scores: this.scoringEngine.calculateScore(content, viewer, env)
    }));

    // Stage 7: MMR Diversification
    const diversified = this.diversificationModule.applyMMRDiversification(scoredList, limit);

    // Stage 8, 9 & 10: Feed Construction & Explainability
    const feed = this.feedConstructor.constructPersonalizedFeed(diversified, env.platformId);
    const explanations = diversified.map(item => this.explainability.generateExplanation(item));

    this.telemetry.logEvent({
      timestamp: Date.now(),
      simulationTick: env.tickIndex,
      viewerId: viewer.id,
      eventType: 'FEED_GENERATED',
      details: `Generated personalized feed of ${feed.length} items on ${env.platformId}`
    });

    return { feed, explanations };
  }

  public evaluateWaveExpansion(content: ContentEntity): boolean {
    const { nextWave, expanded } = this.waveManager.checkWaveExpansion(content);
    if (expanded) {
      this.telemetry.logEvent({
        timestamp: Date.now(),
        simulationTick: 0,
        contentId: content.id,
        eventType: 'DISTRIBUTION_EXPANDED',
        details: `Expanded content ${content.id} to Distribution Wave ${nextWave}`
      });
    }
    return expanded;
  }

  public getTelemetryLogs() {
    return this.telemetry.getEvents();
  }
}
