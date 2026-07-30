import { AiBenchmarkSuite } from '../AiBenchmarkSuite';

/**
 * Executable Unit Test Suite for AuraCore AI Benchmark Suite & Regression Detector
 */
export function runAiBenchmarkSuiteTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];
  const suite = new AiBenchmarkSuite();

  // Test 1: 100-Video Dataset Generation & Execution Report
  try {
    const report = suite.runFullBenchmark();
    const passed = report.totalBenchmarkVideos === 100 &&
                   report.leaderboard.length === 6 &&
                   report.leaderboard[0].rank === 1 &&
                   report.leaderboard[0].compositeScore > 0.80;

    results.push({ testName: '100-Video Dataset Benchmarking & Leaderboard Generation', passed });
  } catch (err: any) {
    results.push({ testName: '100-Video Dataset Benchmarking & Leaderboard Generation', passed: false, details: err?.message });
  }

  // Test 2: Automated Regression Detector (Latency Spike > 15%)
  try {
    const previous = { modelId: 'llm_llama3_70b', category: 'LLM', version: '3.0.0', meanLatencyMs: 2000, gpuUsagePct: 70, memoryMb: 42000, confidenceScore: 0.95, interModelAgreement: 0.93, failureRatePct: 0.0 };
    const current  = { modelId: 'llm_llama3_70b', category: 'LLM', version: '3.1.0', meanLatencyMs: 2500, gpuUsagePct: 75, memoryMb: 42000, confidenceScore: 0.95, interModelAgreement: 0.93, failureRatePct: 0.0 }; // +25% latency

    const alerts = suite.checkRegression(previous, current);
    const passed = alerts.length === 1 && alerts[0].type === 'LATENCY_REGRESSION' && alerts[0].deltaValue === 25.0;

    results.push({ testName: 'Automated Regression Detector (Latency Spike > 15%)', passed });
  } catch (err: any) {
    results.push({ testName: 'Automated Regression Detector (Latency Spike > 15%)', passed: false, details: err?.message });
  }

  // Test 3: Automated Regression Detector (Confidence Drop > 0.05)
  try {
    const previous = { modelId: 'vis_clip_vit_l', category: 'VISION', version: '1.4.0', meanLatencyMs: 800, gpuUsagePct: 55, memoryMb: 8500, confidenceScore: 0.95, interModelAgreement: 0.92, failureRatePct: 0.0 };
    const current  = { modelId: 'vis_clip_vit_l', category: 'VISION', version: '1.5.0', meanLatencyMs: 800, gpuUsagePct: 55, memoryMb: 8500, confidenceScore: 0.88, interModelAgreement: 0.92, failureRatePct: 0.0 }; // -0.07 confidence

    const alerts = suite.checkRegression(previous, current);
    const passed = alerts.length === 1 && alerts[0].type === 'CONFIDENCE_DROP';

    results.push({ testName: 'Automated Regression Detector (Confidence Drop > 0.05)', passed });
  } catch (err: any) {
    results.push({ testName: 'Automated Regression Detector (Confidence Drop > 0.05)', passed: false, details: err?.message });
  }

  return results;
}
