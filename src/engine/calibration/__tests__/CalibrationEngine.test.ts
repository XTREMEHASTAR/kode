import { CalibrationEngine } from '../CalibrationEngine';
import { CalibrationMetrics } from '../CalibrationMetrics';

/**
 * Executable Unit Test Suite for AuraCore Calibration Engine
 */
export function runCalibrationEngineTests(): { testName: string; passed: boolean; details?: string }[] {
  const results: { testName: string; passed: boolean; details?: string }[] = [];

  const mockPredictions = [50000, 25000, 100000, 15000, 80000];
  const mockActuals     = [48000, 27000,  92000, 14000, 85000];

  // Test 1: Error Metrics Calculation (MAPE, RMSE, ECE)
  try {
    const metrics = CalibrationMetrics.calculateMetrics(mockPredictions, mockActuals);
    const passed = metrics.mape < 10.0 && metrics.rmse > 0 && metrics.ece <= 0.015;
    results.push({ testName: 'Error Metrics Calculation (MAPE/RMSE/ECE)', passed });
  } catch (err: any) {
    results.push({ testName: 'Error Metrics Calculation (MAPE/RMSE/ECE)', passed: false, details: err?.message });
  }

  // Test 2: Closed-Loop Calibration Pass
  try {
    const engine = new CalibrationEngine();
    const report = engine.runCalibrationPass(mockPredictions, mockActuals);

    const passed = report.sampleCount === 5 && report.activeModelVersion.startsWith('v3.5.') && !report.rollbackTriggered;
    results.push({ testName: 'Closed-Loop Calibration Ingestion Pass', passed });
  } catch (err: any) {
    results.push({ testName: 'Closed-Loop Calibration Ingestion Pass', passed: false, details: err?.message });
  }

  // Test 3: Model Registry & Automated Circuit-Breaker Rollback
  try {
    const engine = new CalibrationEngine();
    const badPredictions = [500000, 200000, 1000000]; // High error
    const badActuals     = [ 50000,  20000,  100000]; // Actuals 10x smaller -> high MAPE

    const report = engine.runCalibrationPass(badPredictions, badActuals);
    const passed = report.rollbackTriggered && report.activeModelVersion === 'v3.4.0';

    results.push({ testName: 'Model Registry & Circuit-Breaker Rollback', passed });
  } catch (err: any) {
    results.push({ testName: 'Model Registry & Circuit-Breaker Rollback', passed: false, details: err?.message });
  }

  return results;
}
