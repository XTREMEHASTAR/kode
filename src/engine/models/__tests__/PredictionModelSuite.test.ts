import { PredictionModelSuite } from '../PredictionModelSuite';
import { CreatorAgent } from '../../creator/CreatorAgent';
import { EnvironmentEngine } from '../../environment/EnvironmentEngine';

/**
 * Executable Unit Test Suite for AuraCore Prediction Model Suite
 */
export function runPredictionModelSuiteTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];

  const mockCreator = new CreatorAgent({
    id: 'crt_pred_01',
    name: 'Tech Creator',
    niche: 'TECH',
    authorityScore: 0.85,
    followerCount: 200000
  });

  const envEngine = new EnvironmentEngine({ seed: 4096 });
  const envState = envEngine.getState();

  const mockInput = {
    contentDna: new Array(1024).fill(0.25),
    platformId: 'instagram_reels',
    creatorProfile: mockCreator,
    environmentState: envState,
    qualityScore: 0.90,
    hookScore: 0.88,
    pacingScore: 0.85
  };

  // Test 1: Full Performance Prediction Inference
  try {
    const suite = new PredictionModelSuite({ seed: 4096 });
    const pred = suite.predictPerformance(mockInput);

    const passed = pred.predictedViews > 0 &&
                   pred.retentionCurve.length === 30 &&
                   pred.confidenceInterval95.lowerBound < pred.predictedViews &&
                   pred.confidenceInterval95.upperBound > pred.predictedViews;

    results.push({ testName: '11-Model Performance Inference & 95% CIs', passed });
  } catch (err: any) {
    results.push({ testName: '11-Model Performance Inference & 95% CIs', passed: false, details: err?.message });
  }

  // Test 2: Explainability Factor Breakdown
  try {
    const suite = new PredictionModelSuite({ seed: 1024 });
    const pred = suite.predictPerformance(mockInput);

    const exp = pred.explainability;
    const passed = exp.confidenceScore > 0.80 &&
                   exp.alternativeOutcomes.baseCaseP50 === pred.predictedViews &&
                   exp.alternativeOutcomes.worstCaseP10 < exp.alternativeOutcomes.baseCaseP50 &&
                   exp.alternativeOutcomes.bestCaseP90 > exp.alternativeOutcomes.baseCaseP50;

    results.push({ testName: 'Explainability & Alternative Scenarios (P10/P50/P90)', passed });
  } catch (err: any) {
    results.push({ testName: 'Explainability & Alternative Scenarios (P10/P50/P90)', passed: false, details: err?.message });
  }

  // Test 3: Seed-Based PRNG Reproducibility
  try {
    const suiteA = new PredictionModelSuite({ seed: 999 });
    const suiteB = new PredictionModelSuite({ seed: 999 });

    const predA = suiteA.predictPerformance(mockInput);
    const predB = suiteB.predictPerformance(mockInput);

    const passed = predA.predictedViews === predB.predictedViews &&
                   predA.viralityProbability === predB.viralityProbability;

    results.push({ testName: 'Seed-Based 100% PRNG Reproducibility', passed });
  } catch (err: any) {
    results.push({ testName: 'Seed-Based 100% PRNG Reproducibility', passed: false, details: err?.message });
  }

  return results;
}
