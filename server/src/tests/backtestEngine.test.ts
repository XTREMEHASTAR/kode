import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { BacktestEngine } from '../modules/simulation/backtestEngine.js';

describe('BacktestEngine Statistical Math & Synthetic Fixtures Test Suite', () => {

  describe('1. Spearman Rank Correlation (rho)', () => {
    it('reproduces rho ≈ 1.0 on perfectly rank-correlated data', () => {
      const predRanks = [1, 2, 3, 4, 5];
      const actRanks = [1, 2, 3, 4, 5];
      const rho = BacktestEngine.calculateSpearmanRho(predRanks, actRanks);
      assert.strictEqual(Math.round(rho * 1000) / 1000, 1.0);
    });

    it('reproduces rho ≈ -1.0 on perfectly rank-inverted data', () => {
      const predRanks = [1, 2, 3, 4, 5];
      const actRanks = [5, 4, 3, 2, 1];
      const rho = BacktestEngine.calculateSpearmanRho(predRanks, actRanks);
      assert.strictEqual(Math.round(rho * 1000) / 1000, -1.0);
    });

    it('matches exact hand-calculated rho = 0.60 on known fixture sequence', () => {
      // d = [-1, 1, -1, 1], d^2 = [1, 1, 1, 1], sum d^2 = 4, n = 4
      // rho = 1 - (6 * 4) / (4 * (16 - 1)) = 1 - 24 / 60 = 0.60
      const predRanks = [1, 2, 3, 4];
      const actRanks = [2, 1, 4, 3];
      const rho = BacktestEngine.calculateSpearmanRho(predRanks, actRanks);
      assert.strictEqual(Math.round(rho * 100) / 100, 0.60);
    });
  });

  describe('2. Tercile / Bucket Classification Quantiles', () => {
    it('correctly calculates 33.3rd and 66.7th percentiles on known array', () => {
      const values = [10, 20, 30, 40, 50, 60, 70, 80, 90];
      const { p33, p66 } = BacktestEngine.calculateTercileQuantiles(values);
      assert.ok(p33 > 25 && p33 < 40, `p33 expected ~33.3, got ${p33}`);
      assert.ok(p66 > 55 && p66 < 70, `p66 expected ~63.3, got ${p66}`);
    });

    it('correctly assigns values to top, middle, and bottom thirds', () => {
      const p33 = 35.0;
      const p66 = 70.0;
      assert.strictEqual(BacktestEngine.assignTercileBucket(20, p33, p66), 'bottom');
      assert.strictEqual(BacktestEngine.assignTercileBucket(35, p33, p66), 'bottom'); // inclusive edge
      assert.strictEqual(BacktestEngine.assignTercileBucket(50, p33, p66), 'middle');
      assert.strictEqual(BacktestEngine.assignTercileBucket(70, p33, p66), 'middle'); // inclusive edge
      assert.strictEqual(BacktestEngine.assignTercileBucket(85, p33, p66), 'top');
    });
  });

  describe('3. Confidence Interval (90% CI) Boundary Inclusion', () => {
    it('correctly evaluates values inside, outside, and exactly at boundary edges (off-by-one check)', () => {
      const ciMin = 30.0;
      const ciMax = 50.0;

      // Exact boundaries must evaluate to true (inclusive)
      assert.strictEqual(BacktestEngine.evaluateCiCoverage(30.0, ciMin, ciMax), true, 'ciMin exact edge should be covered');
      assert.strictEqual(BacktestEngine.evaluateCiCoverage(50.0, ciMin, ciMax), true, 'ciMax exact edge should be covered');

      // Inside boundary
      assert.strictEqual(BacktestEngine.evaluateCiCoverage(40.0, ciMin, ciMax), true);

      // Outside boundary
      assert.strictEqual(BacktestEngine.evaluateCiCoverage(29.99, ciMin, ciMax), false);
      assert.strictEqual(BacktestEngine.evaluateCiCoverage(50.01, ciMin, ciMax), false);
    });
  });

  describe('4. Brier Score Calculation', () => {
    it('matches exact hand-calculated expected values on binary outcome fixtures', () => {
      // predProb = 0.8, outcome = 1 -> (0.8 - 1)^2 = 0.04
      const score1 = BacktestEngine.calculateBrierScore(0.8, 1);
      assert.strictEqual(Math.round(score1 * 1000) / 1000, 0.04);

      // predProb = 0.3, outcome = 0 -> (0.3 - 0)^2 = 0.09
      const score2 = BacktestEngine.calculateBrierScore(0.3, 0);
      assert.strictEqual(Math.round(score2 * 1000) / 1000, 0.09);

      // Mean Brier score of [0.04, 0.09] = 0.065
      const meanBrier = (score1 + score2) / 2;
      assert.strictEqual(Math.round(meanBrier * 1000) / 1000, 0.065);
    });
  });

  describe('5. Synthetic Reels Test Fixture Pipeline Execution & Isolation', () => {
    it('processes synthetic Reels test fixtures with isolated namespace and claimEligible = false', async () => {
      const fixturePath = path.join(process.cwd(), 'src', 'fixtures', 'synthetic_reels_backtest_fixtures.json');
      assert.ok(fs.existsSync(fixturePath), 'Synthetic Reels fixture JSON file must exist');

      const fileData = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'));
      assert.strictEqual(fileData.is_synthetic_test_fixture, true);
      assert.strictEqual(fileData.claim_eligible, false);
      assert.ok(fileData.items.length > 0, 'Fixture items array must not be empty');

      // Take a slice of 100 items for unit test execution
      const testSlice = fileData.items.slice(0, 100);

      const engine = new BacktestEngine();
      const result = await engine.runSyntheticPipelineTestBatch(testSlice);

      assert.ok(result.runBatchId);
      assert.strictEqual(result.isSyntheticTestFixture, true);
      assert.ok(result.summaries.length > 0);

      for (const summary of result.summaries) {
        // NON-NEGOTIABLE SAFETY ASSERTIONS:
        assert.ok(summary.segmentKey.startsWith('TEST:'), `Segment key ${summary.segmentKey} must have TEST: prefix`);
        assert.strictEqual(summary.claimEligible, false, `Synthetic test segment ${summary.segmentKey} MUST have claimEligible = false`);
        assert.ok(summary.sampleSize > 0);
        assert.ok(summary.coveragePct >= 0 && summary.coveragePct <= 100);
        assert.ok(summary.bucketAccuracyPct >= 0 && summary.bucketAccuracyPct <= 100);
      }
    });
  });
});
