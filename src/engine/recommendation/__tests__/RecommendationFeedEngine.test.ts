import { RecommendationFeedEngine } from '../RecommendationFeedEngine';
import { ContentEntity } from '../../content/ContentEntity';
import { EnvironmentEngine } from '../../environment/EnvironmentEngine';
import { ViewerProfile } from '../ScoringEngine';

/**
 * Executable Unit Test Suite for AuraCore Recommendation & Feed Construction Engine
 */
export function runRecommendationEngineTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];

  const mockViewer: ViewerProfile = {
    id: 'view_001',
    interestVector: new Array(1024).fill(0.50),
    favoriteNiches: ['TECH'],
    watchHistoryIds: []
  };

  const mockContentBatch: ContentEntity[] = Array.from({ length: 20 }, (_, i) => ({
    id: `cnt_rec_${i + 1}`,
    creatorId: `crt_${(i % 3) + 1}`,
    platformId: 'instagram_reels',
    publishTimestamp: Date.now() - i * 3600 * 1000,
    simulationId: 'sim_test',
    state: 'CANDIDATE_POOL',
    stateHistory: [],
    intelligence: {
      dnaVector: new Array(1024).fill(0.1 + i * 0.04),
      hookScore: 0.85,
      visualScore: 0.80,
      audioScore: 0.82,
      narrativeScore: 0.75,
      editingScore: 0.80,
      thumbnailScore: 0.88,
      ctaScore: 0.70,
      trendAffinity: 1.8 + (i % 3) * 0.5,
      audienceMatch: 0.90
    },
    distribution: {
      currentFeedRank: 0,
      candidatePoolPosition: i + 1,
      recommendationScore: 0,
      distributionWave: 1,
      reach: 100,
      impressions: 100
    },
    engagementMetrics: { views: 500, watchTimeMs: 12000, likes: 40, comments: 10, shares: 30, saves: 15, follows: 5, completionRate: 0.70, retentionCurve: [] },
    recommendationHistory: [],
    historicalAnalytics: { peakRetentionRate: 0.80, viralVelocityScore: 60, decayHalfLifeHours: 48 }
  }));

  // Test 1: 10-Stage Feed Construction
  try {
    const engine = new RecommendationFeedEngine({ seed: 4096 });
    const envEngine = new EnvironmentEngine({ seed: 4096 });
    const { feed, explanations } = engine.generatePersonalizedFeed(mockViewer, mockContentBatch, envEngine.getState(), 10);

    const passed = feed.length === 10 && explanations.length === 10 && feed[0].feedPosition === 1;
    results.push({ testName: '10-Stage Personalized Feed Construction', passed });
  } catch (err: any) {
    results.push({ testName: '10-Stage Personalized Feed Construction', passed: false, details: err?.message });
  }

  // Test 2: Decision Explainability Generation
  try {
    const engine = new RecommendationFeedEngine({ seed: 1024 });
    const envEngine = new EnvironmentEngine({ seed: 1024 });
    const { explanations } = engine.generatePersonalizedFeed(mockViewer, mockContentBatch, envEngine.getState(), 5);

    const exp = explanations[0];
    const passed = exp.contentId.length > 0 && exp.finalRankScore > 0;
    results.push({ testName: 'Decision Explainability Generation', passed });
  } catch (err: any) {
    results.push({ testName: 'Decision Explainability Generation', passed: false, details: err?.message });
  }

  // Test 3: Wave Expansion Evaluation
  try {
    const engine = new RecommendationFeedEngine({ seed: 555 });
    const content = { ...mockContentBatch[0] }; // 500 views & 30 shares triggers Wave 2
    const expanded = engine.evaluateWaveExpansion(content);

    const passed = expanded && content.distribution.distributionWave === 2;
    results.push({ testName: 'Engagement-Driven Wave Expansion', passed });
  } catch (err: any) {
    results.push({ testName: 'Engagement-Driven Wave Expansion', passed: false, details: err?.message });
  }

  // Test 4: Seed-Based 100% PRNG Reproducibility
  try {
    const engineA = new RecommendationFeedEngine({ seed: 7777 });
    const engineB = new RecommendationFeedEngine({ seed: 7777 });
    const envEngine = new EnvironmentEngine({ seed: 7777 });

    const resA = engineA.generatePersonalizedFeed(mockViewer, mockContentBatch, envEngine.getState(), 5);
    const resB = engineB.generatePersonalizedFeed(mockViewer, mockContentBatch, envEngine.getState(), 5);

    const passed = resA.feed[0].contentId === resB.feed[0].contentId &&
                   resA.feed[0].recommendationScore === resB.feed[0].recommendationScore;

    results.push({ testName: 'Seed-Based 100% PRNG Reproducibility', passed });
  } catch (err: any) {
    results.push({ testName: 'Seed-Based 100% PRNG Reproducibility', passed: false, details: err?.message });
  }

  return results;
}
