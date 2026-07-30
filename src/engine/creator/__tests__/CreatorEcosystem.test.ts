import { CreatorEcosystem } from '../CreatorEcosystem';
import { EnvironmentEngine } from '../../environment/EnvironmentEngine';

/**
 * Executable Unit Test Suite for AuraWorld Creator Ecosystem Engine
 */
export function runCreatorEcosystemTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];

  // Test 1: Initialization & Bootstrap
  try {
    const ecosystem = new CreatorEcosystem({ seed: 4096, initialCreatorCount: 20 });
    const creators = ecosystem.getAllCreators();
    const passed = creators.length === 20 && creators[0].name.includes('Creator_');
    results.push({ testName: 'Ecosystem Bootstrap Check', passed });
  } catch (err: any) {
    results.push({ testName: 'Ecosystem Bootstrap Check', passed: false, details: err?.message });
  }

  // Test 2: Niche Querying & Filtering
  try {
    const ecosystem = new CreatorEcosystem({ seed: 100, initialCreatorCount: 25 });
    const techCreators = ecosystem.queryCreatorsByNiche('TECH');
    const passed = techCreators.length > 0 && techCreators.every(c => c.niche === 'TECH');
    results.push({ testName: 'Niche Filtering Query', passed });
  } catch (err: any) {
    results.push({ testName: 'Niche Filtering Query', passed: false, details: err?.message });
  }

  // Test 3: Batch Content Generation Speed & Volume
  try {
    const ecosystem = new CreatorEcosystem({ seed: 555, initialCreatorCount: 100 });
    const envEngine = new EnvironmentEngine({ seed: 555 });
    const envState = envEngine.getState();

    const start = performance.now();
    const contentBatch = ecosystem.simulateContentBatch(envState);
    const duration = performance.now() - start;

    const passed = contentBatch.length > 0 && duration < 50; // Latency < 50ms for 100 agents
    results.push({ testName: 'High-Performance Batch Generation (<50ms)', passed });
  } catch (err: any) {
    results.push({ testName: 'High-Performance Batch Generation (<50ms)', passed: false, details: err?.message });
  }

  // Test 4: Seed-Based 100% PRNG Reproducibility
  try {
    const ecoA = new CreatorEcosystem({ seed: 888, initialCreatorCount: 30 });
    const ecoB = new CreatorEcosystem({ seed: 888, initialCreatorCount: 30 });
    const envEngine = new EnvironmentEngine({ seed: 888 });
    const envState = envEngine.getState();

    const batchA = ecoA.simulateContentBatch(envState);
    const batchB = ecoB.simulateContentBatch(envState);

    const passed = batchA.length === batchB.length &&
                   batchA[0].id === batchB[0].id &&
                   batchA[0].qualityScore === batchB[0].qualityScore;

    results.push({ testName: 'Seed-Based PRNG Batch Reproducibility', passed });
  } catch (err: any) {
    results.push({ testName: 'Seed-Based PRNG Batch Reproducibility', passed: false, details: err?.message });
  }

  return results;
}
