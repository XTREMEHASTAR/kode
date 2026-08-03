import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ScenarioEngineService } from '../modules/simulation/scenarioEngineService.js';

describe('Scenario Engine Test Suite', () => {

  it('1. initializes comparison session with a baseline variant', async () => {
    const session = await ScenarioEngineService.createComparisonSession({
      sessionName: 'Hook Optimization Pre-Pub Test',
      creatorId: 'creator_scenario_test_1',
      baseContentRefId: 'content_ref_scenario_101',
      baselineName: 'Baseline (Original Cut)'
    });

    assert.ok(session.id, 'Session ID must be non-empty');
    assert.strictEqual(session.variants.length, 1, 'Initial session must contain 1 baseline variant');
    assert.strictEqual(session.variants[0].variantName, 'Baseline (Original Cut)');
  });

  it('2. adds counterfactual variants and calculates delta metrics relative to baseline', async () => {
    const session = await ScenarioEngineService.createComparisonSession({
      sessionName: 'Multivariate Scenario Test',
      baseContentRefId: 'content_ref_scenario_102'
    });

    const variantA = await ScenarioEngineService.addScenarioVariant({
      sessionId: session.id,
      variantName: 'Scenario A: Better Hook',
      modifications: { hookTextOverlay: true },
      overrideScores: { overallScore: 82.0, scrollStop: 0.82, estimatedViews: 82000 }
    });

    assert.strictEqual(variantA.sessionId, session.id);
    assert.strictEqual(variantA.deltaFromBaseline.scoreDelta, 14.0);
    assert.strictEqual(variantA.deltaFromBaseline.viewDelta, 37000);
    assert.ok(variantA.whyOutperforms.length > 0);
  });

  it('3. selects the best version winner and updates session rankings', async () => {
    const session = await ScenarioEngineService.createComparisonSession({
      sessionName: 'Winner Selection Test',
      baseContentRefId: 'content_ref_scenario_103'
    });

    await ScenarioEngineService.addScenarioVariant({
      sessionId: session.id,
      variantName: 'Scenario A: Better Hook',
      modifications: { hookTextOverlay: true },
      overrideScores: { overallScore: 82.0 }
    });

    await ScenarioEngineService.addScenarioVariant({
      sessionId: session.id,
      variantName: 'Scenario B: Better Thumbnail',
      modifications: { thumbnailContrast: true },
      overrideScores: { overallScore: 76.0 }
    });

    const evaluatedSession = await ScenarioEngineService.compareScenarios(session.id);
    assert.ok(evaluatedSession.bestVariantId, 'Session must have a winner ID');

    const winner = evaluatedSession.variants.find(v => v.isBestVersion);
    assert.ok(winner, 'Must have a winning variant');
    assert.strictEqual(winner.variantName, 'Scenario A: Better Hook');
  });

});
