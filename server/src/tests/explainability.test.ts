import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SimulationOrchestrator } from '../modules/simulation/simulationOrchestrator.js';
import { ExplainabilityEngineService } from '../modules/simulation/explainabilityEngineService.js';

describe('Explainability Engine Test Suite', () => {

  it('1. synthesizes a complete 7-pillar explainability report for a simulation job', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_exp_test_1',
      platform: 'instagram',
      title: '7 Pillar Explainability Test Video',
      scriptText: 'Testing complete explainability pipeline with 7 mandatory pillars...',
      personaTier: 'quick'
    });

    const expReport = await ExplainabilityEngineService.generateExplainabilityReport(report);
    assert.ok(expReport.id);
    assert.strictEqual(expReport.jobId, report.jobId);
    assert.ok(expReport.pillars.length >= 1, 'Must include main score pillar');

    const pillar = expReport.pillars[0];
    assert.ok(pillar.whyRationale.length > 0, '1. Why rationale must exist');
    assert.ok(pillar.evidenceReferences.length > 0, '2. Evidence references must exist');
    assert.ok(pillar.confidence.scorePct >= 70, '3. Confidence score must exist');
    assert.ok(pillar.supportingFeatures.length > 0, '4. Supporting features must exist');
    assert.ok(pillar.personaAgreement.agreementPct >= 50, '5. Persona agreement must exist');
    assert.ok(pillar.historicalComparison.percentileRank >= 0, '6. Historical comparison must exist');
    assert.ok(pillar.counterfactual.recommendedFix.length > 0, '7. Counterfactual fix must exist');
  });

  it('2. verifies relative feature importance weights sum strictly to 100%', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_exp_test_2',
      platform: 'tiktok',
      title: 'Feature Importance Weight Test',
      scriptText: 'Checking relative feature importance weight summation...',
      personaTier: 'quick'
    });

    const expReport = await ExplainabilityEngineService.generateExplainabilityReport(report);
    const weightSum = expReport.featureImportance.reduce((acc, fi) => acc + fi.importanceScore, 0);

    assert.strictEqual(weightSum, 100, 'Feature importance weights must sum strictly to 100%');
  });

  it('3. validates causal reason chain lineage and confidence attribution tree', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_exp_test_3',
      platform: 'youtube_shorts',
      title: 'Reason Chain Test',
      scriptText: 'Checking step-by-step causal reason chains...',
      personaTier: 'quick'
    });

    const expReport = await ExplainabilityEngineService.generateExplainabilityReport(report);
    assert.ok(expReport.reasonChains.length >= 3, 'Must contain at least 3 reason chain steps');

    for (const step of expReport.reasonChains) {
      assert.ok(step.cause.length > 0);
      assert.ok(step.effect.length > 0);
      assert.ok(step.confidence >= 0.80);
    }
  });

});
