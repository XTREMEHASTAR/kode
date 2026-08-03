import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ContinuousLearningCronService } from '../modules/simulation/continuousLearningCron.js';

describe('Continuous Learning Cron Pipeline Test Suite', () => {

  it('1. executes automated nightly continuous learning loop', async () => {
    const telemetry = await ContinuousLearningCronService.executeNightlyLearningLoop();

    assert.strictEqual(telemetry.status, 'completed');
    assert.ok(telemetry.processedAssetsCount >= 1);
    assert.strictEqual(telemetry.updatedPersonaWeightsCount, 100);
    assert.ok(telemetry.averageBrierScore >= 0);
  });

  it('2. retrieves latest continuous learning telemetry', () => {
    const telemetry = ContinuousLearningCronService.getTelemetry();

    assert.ok(telemetry.lastExecutedAt);
    assert.ok(['completed', 'idle', 'running'].includes(telemetry.status));
  });

});
