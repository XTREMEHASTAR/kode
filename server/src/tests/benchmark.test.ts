import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BenchmarkIntelligenceService, BenchmarkDimensionKey } from '../modules/simulation/benchmarkIntelligenceService.js';

describe('Benchmark Intelligence Engine Test Suite', () => {

  describe('1. Quantile Tier Classification & Percentile Mathematics', () => {
    it('classifies Top 1%, Top 5%, Top 10%, Median, and Bottom 25% correctly', () => {
      const dist = { dimension: 'hook' as BenchmarkDimensionKey, p1: 96, p5: 90, p10: 84, p50: 65, p75: 78, p25: 45 };

      assert.strictEqual(BenchmarkIntelligenceService.classifyTier(98, dist), 'Top 1%');
      assert.strictEqual(BenchmarkIntelligenceService.classifyTier(92, dist), 'Top 5%');
      assert.strictEqual(BenchmarkIntelligenceService.classifyTier(86, dist), 'Top 10%');
      assert.strictEqual(BenchmarkIntelligenceService.classifyTier(70, dist), 'Median');
      assert.strictEqual(BenchmarkIntelligenceService.classifyTier(30, dist), 'Bottom 25%');
    });

    it('calculates percentile rank (0-100) accurately', () => {
      const dist = { dimension: 'hook' as BenchmarkDimensionKey, p1: 96, p5: 90, p10: 84, p50: 65, p75: 78, p25: 45 };

      const pctHigh = BenchmarkIntelligenceService.calculatePercentile(92, dist);
      const pctLow = BenchmarkIntelligenceService.calculatePercentile(30, dist);

      assert.ok(pctHigh >= 95.0, 'P95+ for Top 5% score');
      assert.ok(pctLow < 25.0, 'Below 25 for Bottom 25% score');
    });
  });

  describe('2. 11-Dimension Asset Benchmark Evaluation Pipeline', () => {
    it('evaluates asset across all 11 benchmark dimensions', async () => {
      const result = await BenchmarkIntelligenceService.evaluateAssetBenchmark({
        contentRefId: 'asset_bench_test_101',
        platform: 'instagram',
        category: 'tech',
        country: 'global'
      });

      assert.strictEqual(result.contentRefId, 'asset_bench_test_101');
      assert.strictEqual(result.platform, 'instagram');

      const dimensions: BenchmarkDimensionKey[] = [
        'hook', 'retention', 'editing', 'audio', 'visualQuality',
        'speech', 'emotion', 'thumbnail', 'caption', 'engagement', 'views'
      ];

      for (const dim of dimensions) {
        assert.ok(result.dimensionScores[dim] !== undefined, `Must evaluate ${dim} score`);
        assert.ok(result.dimensionPercentiles[dim] !== undefined, `Must evaluate ${dim} percentile`);
        assert.ok(result.dimensionTiers[dim] !== undefined, `Must evaluate ${dim} tier`);
      }
    });
  });

  describe('3. 11-Axis Radar Chart Dataset & Opportunity Score', () => {
    it('generates 11-axis radar chart dataset and bounded Opportunity Score', async () => {
      const result = await BenchmarkIntelligenceService.evaluateAssetBenchmark({
        contentRefId: 'asset_bench_test_102',
        platform: 'tiktok',
        category: 'fitness'
      });

      assert.strictEqual(result.radarChartData.length, 11, 'Radar chart must have 11 axis points');
      assert.ok(result.overallOpportunityScore >= 0 && result.overallOpportunityScore <= 100);
      assert.ok(result.strengths.length > 0);
      assert.ok(result.weaknesses.length > 0);
      assert.ok(result.improvementSuggestions.length > 0);
    });
  });

});
