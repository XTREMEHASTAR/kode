import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CreatorTwinEngineService } from '../modules/simulation/creatorTwinEngineService.js';
import { SimulationOrchestrator } from '../modules/simulation/simulationOrchestrator.js';

describe('Creator Twin Engine Test Suite', () => {

  it('1. initializes a new Creator Twin with 12-dimension style fingerprint', async () => {
    const twin = await CreatorTwinEngineService.getOrCreateTwin({
      creatorId: 'creator_twin_test_1',
      handle: '@techvision',
      twinName: 'TechVision AI Twin',
      nicheCategory: 'tech'
    });

    assert.ok(twin.id);
    assert.strictEqual(twin.creatorId, 'creator_twin_test_1');
    assert.ok(twin.styleFingerprint.editingStyle.pacingWpm > 0);
    assert.ok(twin.styleFingerprint.hookPatterns.curiosityGapScore > 0);
    assert.strictEqual(twin.totalAnalyzedVideos, 1);
  });

  it('2. updates twin style memory incrementally through simulation learning', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'creator_twin_test_2',
      platform: 'instagram',
      title: 'Creator Twin Learning Video',
      scriptText: 'Testing persistent creator twin incremental learning pipeline...',
      personaTier: 'quick'
    });

    const updatedTwin = await CreatorTwinEngineService.learnFromSimulation('creator_twin_test_2', report);
    assert.ok(updatedTwin.totalAnalyzedVideos >= 2);
    assert.ok(updatedTwin.overallMaturityScore > 50.0);
  });

  it('3. generates 90-day growth forecasting trajectory and personalized strategies', async () => {
    const forecast = await CreatorTwinEngineService.generateGrowthForecast('creator_twin_test_1');
    assert.strictEqual(forecast.creatorId, 'creator_twin_test_1');
    assert.ok(forecast.trajectories.expected90dViews > forecast.baselineViews);
    assert.ok(forecast.trajectories.viral90dViews > forecast.trajectories.expected90dViews);
    assert.ok(forecast.personalizedStrategy.length >= 3);
    assert.ok(forecast.contentPlanSuggestions.length >= 3);
  });

});
