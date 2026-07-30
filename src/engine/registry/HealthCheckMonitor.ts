export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE';

export interface ModelHealthReport {
  modelId: string;
  status: HealthStatus;
  lastHeartbeat: number;
  errorRate: number;
  consecutiveFailures: number;
}

export class HealthCheckMonitor {
  private healthMap: Map<string, ModelHealthReport> = new Map();

  public registerModel(modelId: string): void {
    this.healthMap.set(modelId, {
      modelId,
      status: 'HEALTHY',
      lastHeartbeat: Date.now(),
      errorRate: 0.0,
      consecutiveFailures: 0
    });
  }

  public recordSuccess(modelId: string): void {
    const report = this.healthMap.get(modelId);
    if (report) {
      report.lastHeartbeat = Date.now();
      report.consecutiveFailures = 0;
      report.status = 'HEALTHY';
    }
  }

  public recordFailure(modelId: string): void {
    const report = this.healthMap.get(modelId);
    if (report) {
      report.consecutiveFailures += 1;
      report.errorRate = Number(Math.min(1.0, report.errorRate + 0.1).toFixed(2));
      if (report.consecutiveFailures >= 3) {
        report.status = 'DEGRADED';
      }
      if (report.consecutiveFailures >= 5) {
        report.status = 'OFFLINE';
      }
    }
  }

  public getHealth(modelId: string): ModelHealthReport | undefined {
    return this.healthMap.get(modelId);
  }
}
