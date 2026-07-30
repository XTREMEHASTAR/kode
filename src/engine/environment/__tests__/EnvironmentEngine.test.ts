import { EnvironmentEngine } from '../EnvironmentEngine';

/**
 * Executable Unit Test Suite for AuraWorld Environment Engine
 */
export function runEnvironmentEngineTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];

  // Test 1: Initialization
  try {
    const engine = new EnvironmentEngine({ seed: 1024, platformId: 'instagram_reels' });
    const state = engine.getState();
    const passed = state.seed === 1024 && state.platformId === 'instagram_reels' && state.tickIndex === 0;
    results.push({ testName: 'Initialization State Check', passed });
  } catch (err: any) {
    results.push({ testName: 'Initialization State Check', passed: false, details: err?.message });
  }

  // Test 2: Deterministic Tick Loop
  try {
    const engine = new EnvironmentEngine({ seed: 42 });
    const initialTick = engine.getState().tickIndex;
    engine.tick(5.0);
    const updatedState = engine.getState();
    const passed = updatedState.tickIndex === initialTick + 1;
    results.push({ testName: 'Deterministic Tick Loop', passed });
  } catch (err: any) {
    results.push({ testName: 'Deterministic Tick Loop', passed: false, details: err?.message });
  }

  // Test 3: Seed Reproducibility
  try {
    const engineA = new EnvironmentEngine({ seed: 9982 });
    const engineB = new EnvironmentEngine({ seed: 9982 });

    for (let i = 0; i < 5; i++) {
      engineA.tick(1.0);
      engineB.tick(1.0);
    }

    const stateA = engineA.getState();
    const stateB = engineB.getState();

    const passed = stateA.competitionIndex === stateB.competitionIndex &&
                   stateA.creatorDensity === stateB.creatorDensity &&
                   stateA.attentionBudget.availableCapacity === stateB.attentionBudget.availableCapacity;

    results.push({ testName: 'Seed-Based 100% PRNG Reproducibility', passed });
  } catch (err: any) {
    results.push({ testName: 'Seed-Based 100% PRNG Reproducibility', passed: false, details: err?.message });
  }

  // Test 4: Multi-Platform Profile Swap
  try {
    const engine = new EnvironmentEngine({ platformId: 'tiktok' });
    const initialOk = engine.getState().platformId === 'tiktok';
    engine.setPlatform('youtube_shorts');
    const swappedOk = engine.getState().platformId === 'youtube_shorts' && engine.getState().algorithmWeights.watchTime === 0.50;
    results.push({ testName: 'Multi-Platform Profile Swapping', passed: initialOk && swappedOk });
  } catch (err: any) {
    results.push({ testName: 'Multi-Platform Profile Swapping', passed: false, details: err?.message });
  }

  return results;
}
