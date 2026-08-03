import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CalibrationRegistryService } from '../modules/simulation/calibrationRegistryService.js';
import { SimulationOrchestrator } from '../modules/simulation/simulationOrchestrator.js';

describe('Calibration Registry Engine Test Suite', () => {

  describe('1. Prediction Error Mathematics (Brier Score, MAPE, Log Loss)', () => {
    it('calculates Brier Score and MAPE correctly for exact predictions', () => {
      const predicted = { scrollStop: 0.70, watch3s: 0.50 };
      const actuals = { scrollStop: 0.70, watch3s: 0.50 };

      const error = CalibrationRegistryService.calculatePredictionError(predicted, actuals);
      assert.strictEqual(error.brierScore, 0.0);
      assert.strictEqual(error.meanAbsolutePctError, 0.0);
    });

    it('calculates Brier Score and MAPE for realistic prediction errors', () => {
      const predicted = { scrollStop: 0.65, watch3s: 0.50, completion: 0.30 };
      const actuals = { scrollStop: 0.75, watch3s: 0.55, completion: 0.35 };

      const error = CalibrationRegistryService.calculatePredictionError(predicted, actuals);
      assert.ok(error.brierScore > 0, 'Brier score must be positive for non-identical predictions');
      assert.ok(error.meanAbsolutePctError > 0, 'MAPE must be positive for non-identical predictions');
    });
  });

  describe('2. Ingestion of Post-Publication Actuals & Calibration', () => {
    it('ingests actual views, likes, and retention metrics for a simulation job', async () => {
      const report = await SimulationOrchestrator.createAndRunSimulation({
        userId: 'creator_calib_test_1',
        platform: 'instagram',
        title: 'Closed Loop Calibration Test',
        scriptText: 'Testing post-publication actuals ingestion and Bayesian updates...',
        personaTier: 'quick'
      });

      const record = await CalibrationRegistryService.recordActualsAndCalibrate({
        jobId: report.jobId,
        creatorId: 'creator_calib_test_1',
        platform: 'instagram',
        publishedAt: new Date().toISOString(),
        realViews: 45000,
        realLikes: 3200,
        realShares: 450,
        realRetention3s: 0.72,
        realCompletionRate: 0.38
      });

      assert.strictEqual(record.jobId, report.jobId);
      assert.strictEqual(record.platform, 'instagram');
      assert.ok(record.predictionError.brierScore >= 0);
      assert.ok(record.predictionError.meanAbsolutePctError >= 0);
    });
  });

  describe('3. Bayesian Conjugate Prior-Posterior Weight Updating', () => {
    it('updates platform Bayesian posterior weights dynamically on high accuracy', async () => {
      const priorSet = CalibrationRegistryService.getWeightSet('platform', 'instagram');
      assert.ok(typeof priorSet.posteriorWeight === 'number');

      // Ingest actuals matching predictions closely (low Brier error)
      await CalibrationRegistryService.recordActualsAndCalibrate({
        jobId: 'sim_job_calib_bayesian',
        creatorId: 'creator_bayesian_1',
        platform: 'instagram',
        realViews: 50000,
        realRetention3s: 0.68,
        realCompletionRate: 0.35
      });

      const updatedSet = CalibrationRegistryService.getWeightSet('platform', 'instagram');
      assert.ok(updatedSet.sampleCount > priorSet.sampleCount, 'Sample count must increment');
      assert.ok(typeof updatedSet.posteriorWeight === 'number', 'Posterior weight must be a number');
    });
  });

  describe('4. Historical Calibration Statistics & Accuracy Curves', () => {
    it('retrieves aggregate Brier scores, MAPE trends, and weight parameters', async () => {
      const stats = await CalibrationRegistryService.getCalibrationStats();
      assert.ok(stats.totalRecordsEvaluated > 0, 'Total records evaluated must be > 0');
      assert.ok(typeof stats.meanBrierScore === 'number');
      assert.ok(typeof stats.meanMapePct === 'number');
      assert.ok(stats.weightSets.length > 0, 'Must return weight sets');
    });
  });

});
