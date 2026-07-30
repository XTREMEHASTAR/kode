import { ModelBenchmarkTelemetry } from './LeaderboardGenerator';

export interface RegressionAlert {
  modelId: string;
  type: 'LATENCY_REGRESSION' | 'CONFIDENCE_DROP' | 'AGREEMENT_DROP' | 'FAILURE_RATE_SPIKE';
  deltaValue: number;
  message: string;
}

export class RegressionDetector {
  public static detectRegressions(
    previousTelemetry: ModelBenchmarkTelemetry,
    currentTelemetry: ModelBenchmarkTelemetry
  ): RegressionAlert[] {
    const alerts: RegressionAlert[] = [];

    // 1. Latency Spike > 15%
    const latencyPctChange = ((currentTelemetry.meanLatencyMs - previousTelemetry.meanLatencyMs) / previousTelemetry.meanLatencyMs) * 100;
    if (latencyPctChange > 15.0) {
      alerts.push({
        modelId: currentTelemetry.modelId,
        type: 'LATENCY_REGRESSION',
        deltaValue: Number(latencyPctChange.toFixed(2)),
        message: `Latency regressed by +${latencyPctChange.toFixed(1)}% (${previousTelemetry.meanLatencyMs}ms -> ${currentTelemetry.meanLatencyMs}ms)`
      });
    }

    // 2. Confidence Drop > 0.05
    const confDrop = previousTelemetry.confidenceScore - currentTelemetry.confidenceScore;
    if (confDrop > 0.05) {
      alerts.push({
        modelId: currentTelemetry.modelId,
        type: 'CONFIDENCE_DROP',
        deltaValue: Number(confDrop.toFixed(4)),
        message: `Confidence dropped by -${confDrop.toFixed(3)} (${previousTelemetry.confidenceScore} -> ${currentTelemetry.confidenceScore})`
      });
    }

    // 3. Inter-Model Agreement Drop > 0.08
    const agreeDrop = previousTelemetry.interModelAgreement - currentTelemetry.interModelAgreement;
    if (agreeDrop > 0.08) {
      alerts.push({
        modelId: currentTelemetry.modelId,
        type: 'AGREEMENT_DROP',
        deltaValue: Number(agreeDrop.toFixed(4)),
        message: `Inter-model agreement dropped by -${agreeDrop.toFixed(3)} (${previousTelemetry.interModelAgreement} -> ${currentTelemetry.interModelAgreement})`
      });
    }

    // 4. Failure Rate Spike > 2.0%
    const failureSpike = currentTelemetry.failureRatePct - previousTelemetry.failureRatePct;
    if (failureSpike > 2.0) {
      alerts.push({
        modelId: currentTelemetry.modelId,
        type: 'FAILURE_RATE_SPIKE',
        deltaValue: Number(failureSpike.toFixed(2)),
        message: `Failure rate spiked by +${failureSpike.toFixed(1)}% (${previousTelemetry.failureRatePct}% -> ${currentTelemetry.failureRatePct}%)`
      });
    }

    return alerts;
  }
}
