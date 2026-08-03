import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SimulationOrchestrator } from '../modules/simulation/simulationOrchestrator.js';
import { EvidenceGraphService } from '../modules/simulation/evidenceGraphService.js';

describe('Evidence Graph Engine Test Suite', () => {

  it('1. compiles a complete Evidence Graph from a simulation report', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_evidence_test_1',
      platform: 'instagram',
      title: '3 AI Tools That Will Double Your Productivity',
      scriptText: 'Are you still doing your workflows manually? Here are 3 AI tools...',
      personaTier: 'standard'
    });

    const graph = await EvidenceGraphService.getEvidenceGraph(report.jobId);
    assert.ok(graph.nodes.length >= 5, 'Evidence Graph must contain at least 5 nodes');
    assert.ok(graph.edges.length >= 4, 'Evidence Graph must contain at least 4 edges');

    const nodeTypes = graph.nodes.map(n => n.nodeType);
    assert.ok(nodeTypes.includes('prediction'), 'Must include root prediction node');
    assert.ok(nodeTypes.includes('scene_segment'), 'Must include scene segment node');
    assert.ok(nodeTypes.includes('content_feature'), 'Must include CKG content feature node');
    assert.ok(nodeTypes.includes('persona_reaction'), 'Must include persona reaction node');
    assert.ok(nodeTypes.includes('recommendation'), 'Must include recommendation node');
  });

  it('2. links nodes with explicit semantic relation types', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_evidence_test_2',
      platform: 'tiktok',
      title: 'Stop Scrolling if you want to grow on TikTok',
      scriptText: 'If you want to blow up on TikTok in 2026, stop doing this right now...',
      personaTier: 'quick'
    });

    const graph = await EvidenceGraphService.getEvidenceGraph(report.jobId);
    const relations = graph.edges.map(e => e.relationType);

    assert.ok(relations.includes('caused_by'), 'Must include caused_by relation');
    assert.ok(relations.includes('traced_to'), 'Must include traced_to relation');
    assert.ok(relations.includes('disagreed_by'), 'Must include disagreed_by relation');
    assert.ok(relations.includes('recommends_fix'), 'Must include recommends_fix relation');
  });

  it('3. fulfills the 5 Core Evidence Questions for every recommendation', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_evidence_test_3',
      platform: 'youtube_shorts',
      title: 'Python Vs TypeScript in 2026',
      scriptText: 'Which programming language should you learn first? Let us compare...',
      personaTier: 'standard'
    });

    const trace = await EvidenceGraphService.traceRecommendationEvidence(report.jobId);
    assert.ok(trace !== null, 'Trace answer must be non-null');

    // 1. Why?
    assert.ok(trace.whyRationale.length > 0, 'Must answer Why rationale');

    // 2. Which scene?
    assert.ok(typeof trace.sceneTimestamp.startSec === 'number');
    assert.ok(typeof trace.sceneTimestamp.endSec === 'number');
    assert.ok(trace.sceneTimestamp.segmentName.length > 0);

    // 3. Which feature?
    assert.ok(trace.ckgContentFeature.featureLabel.length > 0);
    assert.ok(trace.ckgContentFeature.sourceEngine.length > 0);

    // 4. Which personas?
    assert.ok(trace.affectedPersonas.disagreementPct > 0);
    assert.ok(trace.affectedPersonas.demographicSummary.length > 0);

    // 5. How confident?
    assert.ok(trace.confidence.scorePct >= 70);
    assert.ok(trace.confidence.sourceAttribution.length > 0);
  });

  it('4. enforces Zero-Evidence Guard (rejects recommendations without evidence edges)', async () => {
    const report = await SimulationOrchestrator.createAndRunSimulation({
      userId: 'user_evidence_test_4',
      platform: 'instagram',
      title: 'Zero Evidence Guard Test',
      scriptText: 'Testing evidence edge enforcement...',
      personaTier: 'quick'
    });

    const graph = await EvidenceGraphService.getEvidenceGraph(report.jobId);
    const recNode = graph.nodes.find(n => n.nodeType === 'recommendation');
    assert.ok(recNode);

    // Verify recNode has at least one edge
    const edges = graph.edges.filter(e => e.sourceEvidenceNodeId === recNode.id || e.targetEvidenceNodeId === recNode.id);
    assert.ok(edges.length > 0, 'Recommendation must have supporting evidence edges');
  });

});
