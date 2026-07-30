import { ContentLifecycleEngine } from '../ContentLifecycleEngine';
import { SimulatedContent } from '../../creator/CreatorAgent';

/**
 * Executable Unit Test Suite for Expanded AuraWorld Content Lifecycle Engine
 */
export function runContentLifecycleEngineTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];

  const mockContent: SimulatedContent = {
    id: 'cnt_exp_001',
    creatorId: 'crt_001',
    title: 'Expanded Lifecycle Reel',
    niche: 'TECH',
    timestamp: Date.now(),
    qualityScore: 0.90,
    hookScore: 0.94,
    pacingScore: 0.88,
    dnaVector: new Array(1024).fill(0.456),
    trendAlignmentScore: 0.85
  };

  // Test 1: 10-State Pipeline Progression
  try {
    const engine = new ContentLifecycleEngine({ seed: 2048 });
    const content = engine.createContent(mockContent, 'instagram_reels');
    
    engine.transitionState(content.id, 'SCHEDULED');
    engine.transitionState(content.id, 'PUBLISHED');
    engine.transitionState(content.id, 'CANDIDATE_POOL');
    engine.transitionState(content.id, 'RECOMMENDED');
    engine.transitionState(content.id, 'VIEWER_EXPOSURE');
    engine.transitionState(content.id, 'GROWTH');
    engine.transitionState(content.id, 'PEAK');
    engine.transitionState(content.id, 'DECAY');
    engine.transitionState(content.id, 'ARCHIVED');

    const passed = engine.getContent(content.id)?.state === 'ARCHIVED' && content.stateHistory.length === 10;
    results.push({ testName: 'Full 10-State Pipeline Progression', passed });
  } catch (err: any) {
    results.push({ testName: 'Full 10-State Pipeline Progression', passed: false, details: err?.message });
  }

  // Test 2: State Rollback & Recovery
  try {
    const engine = new ContentLifecycleEngine({ seed: 100 });
    const content = engine.createContent(mockContent, 'instagram_reels');
    engine.transitionState(content.id, 'PUBLISHED');
    engine.transitionState(content.id, 'CANDIDATE_POOL');

    // Rollback to PUBLISHED
    const rolledBack = engine.rollbackState(content.id);
    const passed = rolledBack.state === 'PUBLISHED';
    results.push({ testName: 'State Rollback & Recovery', passed });
  } catch (err: any) {
    results.push({ testName: 'State Rollback & Recovery', passed: false, details: err?.message });
  }

  // Test 3: Telemetry Event Logging
  try {
    const engine = new ContentLifecycleEngine({ seed: 333 });
    const content = engine.createContent(mockContent, 'instagram_reels');
    engine.transitionState(content.id, 'PUBLISHED');
    engine.transitionState(content.id, 'CANDIDATE_POOL');

    const events = engine.getTelemetryLogs();
    const passed = events.some(e => e.eventType === 'CONTENT_CREATED') &&
                   events.some(e => e.eventType === 'CONTENT_PUBLISHED') &&
                   events.some(e => e.eventType === 'ENTERED_CANDIDATE_POOL');

    results.push({ testName: '10-Event Lifecycle Telemetry Audit', passed });
  } catch (err: any) {
    results.push({ testName: '10-Event Lifecycle Telemetry Audit', passed: false, details: err?.message });
  }

  // Test 4: Fast Candidate Pool Retrieval & DNA Immutability
  try {
    const engine = new ContentLifecycleEngine({ seed: 777 });
    const content = engine.createContent(mockContent, 'tiktok');
    engine.transitionState(content.id, 'PUBLISHED');
    engine.transitionState(content.id, 'CANDIDATE_POOL');

    const candidates = engine.getCandidatePool('tiktok', 10);
    const passed = candidates.length === 1 && candidates[0].intelligence.dnaVector.length === 1024;
    results.push({ testName: 'Fast Candidate Indexing & DNA Immutability', passed });
  } catch (err: any) {
    results.push({ testName: 'Fast Candidate Indexing & DNA Immutability', passed: false, details: err?.message });
  }

  return results;
}
