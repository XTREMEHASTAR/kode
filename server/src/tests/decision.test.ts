import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SimulationOrchestrator } from '../modules/simulation/simulationOrchestrator.js';
import { DecisionIntelligenceService } from '../modules/simulation/decisionIntelligenceService.js';

describe('Decision Intelligence Engine Test Suite', () => {

  it('1. synthesizes a prioritized Decision Plan ("What should creator do next?")', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_decision_test_1',
      platform: 'instagram',
      title: 'Decision Intelligence Test Video',
      scriptText: 'Testing decision directive matrix and action plan checklist...',
      personaTier: 'quick'
    });

    const plan = await DecisionIntelligenceService.generateDecisionPlan({
      jobId: report.jobId,
      simulationReport: report,
      creatorId: 'creator_decision_1'
    });

    assert.ok(plan.id);
    assert.strictEqual(plan.jobId, report.jobId);
    assert.ok(['PUBLISH_NOW', 'OPTIMIZE_BEFORE_PUBLISH', 'RESTRUCTURE_REQUIRED'].includes(plan.primaryDirective));
    assert.ok(plan.actionItems.length >= 3, 'Must include at least 3 prioritized action items');
  });

  it('2. calculates expected score gain, view gain, and action item execution steps', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_decision_test_2',
      platform: 'tiktok',
      title: 'Action Item Lift Test',
      scriptText: 'Testing action item priority and expected gain calculations...',
      personaTier: 'quick'
    });

    const plan = await DecisionIntelligenceService.generateDecisionPlan({
      jobId: report.jobId,
      simulationReport: report
    });

    assert.ok(plan.totalExpectedScoreGain > 0, 'Total expected score gain must be positive');
    assert.ok(plan.totalExpectedViewGain > 0, 'Total expected view gain must be positive');

    const hookAction = plan.actionItems.find(i => i.actionKey === 'change_hook');
    assert.ok(hookAction, 'Must include hook optimization action item');
    assert.ok(hookAction.executionSteps.length >= 2, 'Must include actionable execution steps');
  });

  it('3. resolves optimal posting time window for creator audience demographic', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_decision_test_3',
      platform: 'youtube_shorts',
      title: 'Optimal Posting Window Test',
      scriptText: 'Testing optimal posting time window resolution...',
      personaTier: 'quick'
    });

    const plan = await DecisionIntelligenceService.generateDecisionPlan({
      jobId: report.jobId,
      simulationReport: report
    });

    assert.ok(plan.optimalPostingWindow.recommendedDay);
    assert.ok(plan.optimalPostingWindow.recommendedHourUtc >= 0);
    assert.ok(plan.optimalPostingWindow.reasoning.length > 0);
  });

});
