import { ErrorMetricsReport } from './CalibrationMetrics';

export interface RegisteredModelVersion {
  modelVersion: string;
  datasetVersion: string;
  featureVersion: string;
  deploymentTimestamp: number;
  temperature: number;
  metrics: ErrorMetricsReport;
}

export class ModelRegistry {
  private history: RegisteredModelVersion[] = [];
  private activeIndex: number = -1;

  constructor() {
    this.registerVersion({
      modelVersion: 'v3.4.0',
      datasetVersion: 'v1.1.0',
      featureVersion: 'f2.3.0',
      deploymentTimestamp: Date.now() - 7 * 86400 * 1000,
      temperature: 1.0,
      metrics: { mape: 12.5, rmse: 4500, ece: 0.012, predictionDrift: 0.02, bias: 150, confidenceReliability: 0.988 }
    });
  }

  public registerVersion(version: RegisteredModelVersion): void {
    this.history.push(version);
    this.activeIndex = this.history.length - 1;
  }

  public getActiveModel(): RegisteredModelVersion {
    return this.history[this.activeIndex];
  }

  public rollbackToPreviousVersion(): RegisteredModelVersion {
    if (this.activeIndex <= 0) {
      throw new Error('Cannot rollback model: no previous model version exists in registry');
    }
    this.activeIndex -= 1;
    return this.getActiveModel();
  }

  public getHistory(): RegisteredModelVersion[] {
    return [...this.history];
  }
}
