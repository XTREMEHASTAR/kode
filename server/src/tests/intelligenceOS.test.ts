import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { IntelligenceOperatingSystem } from '../modules/simulation/intelligenceOperatingSystem.js';

describe('KONTAGI AI Creative Intelligence Operating System (AI-CIOS) Master Test Suite', () => {

  it('1. executes complete 14-subsystem OS workflow end-to-end', async () => {
    const result = await IntelligenceOperatingSystem.executeFullOSWorkflow({
      userId: '00000000-0000-0000-0000-000000000001',
      creatorId: 'creator_master_os_1',
      platform: 'instagram',
      title: 'Master Intelligence OS Integration Video',
      scriptText: 'Testing complete 14-subsystem AI Creative Intelligence Operating System...',
      personaTier: 'quick'
    });

    // 1. Core OS Result Metadata
    assert.ok(result.jobId, 'Master OS execution must generate a jobId');
    assert.strictEqual(result.creatorId, 'creator_master_os_1');

    // 2. Engines 1 & 2: Content Understanding & Audience Simulation
    assert.ok(result.simulationReport.overallScore > 0, 'Simulation report must have an overall virality score');
    assert.ok(result.simulationReport.retentionCurve.length >= 3, 'Simulation report must contain retention curve');

    // 3. Subsystem 4: Evidence Graph Engine
    assert.ok(result.evidenceGraph.nodes.length >= 3, 'Evidence Graph must contain nodes');

    // 4. Subsystem 6: Benchmark Intelligence Engine
    assert.strictEqual(result.benchmarkEvaluation.radarChartData.length, 11, 'Benchmark evaluation must produce 11 radar points');

    // 5. Subsystem 7: Scenario Counterfactual Engine
    assert.ok(result.scenarioSession.variants.length >= 2, 'Scenario Engine must generate baseline + scenario variants');

    // 6. Subsystem 8: Creator Twin Engine
    assert.ok(result.creatorTwin.styleFingerprint.editingStyle.pacingWpm > 0, 'Creator Twin must contain 12-dimension style fingerprint');

    // 7. Subsystem 14: Dedicated Explainability Engine
    assert.strictEqual(result.explainabilityReport.pillars.length, 1, 'Explainability Report must contain main score pillar');
    assert.ok(result.explainabilityReport.featureImportance.length >= 5, 'Must contain feature importance weights');

    // 8. Engine 3: Decision Intelligence Engine
    assert.ok(['PUBLISH_NOW', 'OPTIMIZE_BEFORE_PUBLISH', 'RESTRUCTURE_REQUIRED'].includes(result.decisionPlan.primaryDirective));
    assert.ok(result.decisionPlan.actionItems.length >= 3, 'Decision Plan must include prioritized action items');

    // 9. Subsystem 12: Model Registry Routing Engine
    assert.strictEqual(result.modelRouting.selectedModelId, 'gemini-2-flash', 'Model Router must select active surface');

    // 10. All 14 Subsystem Statuses
    assert.strictEqual(Object.keys(result.subsystemStatuses).length, 14, 'All 14 subsystems must report status');
  });

});
