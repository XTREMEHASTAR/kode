import { CalibrationMetrics, ErrorMetricsReport } from './CalibrationMetrics';
import { TemperatureScaler } from './TemperatureScaler';
import { ModelRegistry, RegisteredModelVersion } from './ModelRegistry';

export interface CalibrationReport {
  timestamp: number;
  sampleCount: number;
  metrics: ErrorMetricsReport;
  newTemperature: number;
  activeModelVersion: string;
  rollbackTriggered: boolean;
}

export class CalibrationEngine {
  private metricsCalculator: typeof CalibrationMetrics;
  private temperatureScaler: TemperatureScaler;
  private modelRegistry: ModelRegistry;

  constructor() {
    this.metricsCalculator = CalibrationMetrics;
    this.temperatureScaler = new TemperatureScaler();
    this.modelRegistry = new ModelRegistry();
  }

  /**
   * Closed-loop Calibration Ingestion Pass
   */
  public runCalibrationPass(predictions: number[], actuals: number[]): CalibrationReport {
    const metrics = this.metricsCalculator.calculateMetrics(predictions, actuals);
    const newTemperature = this.temperatureScaler.calibrateTemperature(metrics.mape, metrics.bias);

    let rollbackTriggered = false;
    let activeModel = this.modelRegistry.getActiveModel();

    // Circuit Breaker Rollback Guard if ECE > 0.040 or MAPE > 25%
    if (metrics.ece > 0.040 || metrics.mape > 25.0) {
      activeModel = this.modelRegistry.rollbackToPreviousVersion();
      rollbackTriggered = true;
    } else {
      // Register updated model version
      const newVersionString = `v3.5.${this.modelRegistry.getHistory().length}`;
      this.modelRegistry.registerVersion({
        modelVersion: newVersionString,
        datasetVersion: 'v1.2.0',
        featureVersion: 'f2.4.0',
        deploymentTimestamp: Date.now(),
        temperature: newTemperature,
        metrics
      });
      activeModel = this.modelRegistry.getActiveModel();
    }

    return {
      timestamp: Date.now(),
      sampleCount: predictions.length,
      metrics,
      newTemperature,
      activeModelVersion: activeModel.modelVersion,
      rollbackTriggered
    };
  }

  public getModelRegistry(): ModelRegistry {
    return this.modelRegistry;
  }
}
