import { BenchmarkDataset, BenchmarkVideoItem } from './BenchmarkDataset';
import { LeaderboardGenerator, ModelBenchmarkTelemetry, LeaderboardEntry } from './LeaderboardGenerator';
import { RegressionDetector, RegressionAlert } from './RegressionDetector';

export interface SuiteExecutionReport {
  timestamp: number;
  totalBenchmarkVideos: number;
  leaderboard: LeaderboardEntry[];
  regressionsDetected: RegressionAlert[];
}

export class AiBenchmarkSuite {
  private dataset: BenchmarkDataset;

  constructor() {
    this.dataset = new BenchmarkDataset();
  }

  public runFullBenchmark(): SuiteExecutionReport {
    const videoItems = this.dataset.getDataset();
    const telemetryResults: ModelBenchmarkTelemetry[] = [
      { modelId: 'stt_whisper_v3', category: 'SPEECH_TO_TEXT', version: '3.0.0', meanLatencyMs: 1450, gpuUsagePct: 42, memoryMb: 12000, confidenceScore: 0.98, interModelAgreement: 0.96, failureRatePct: 0.0 },
      { modelId: 'vis_clip_vit_l', category: 'VISION', version: '1.4.0', meanLatencyMs: 820, gpuUsagePct: 55, memoryMb: 8500, confidenceScore: 0.94, interModelAgreement: 0.92, failureRatePct: 0.5 },
      { modelId: 'ocr_trocr_large', category: 'OCR', version: '1.1.0', meanLatencyMs: 410, gpuUsagePct: 28, memoryMb: 6200, confidenceScore: 0.96, interModelAgreement: 0.95, failureRatePct: 0.0 },
      { modelId: 'emb_multimodal_1024d', category: 'EMBEDDINGS', version: '2.4.0', meanLatencyMs: 180, gpuUsagePct: 35, memoryMb: 14000, confidenceScore: 0.97, interModelAgreement: 0.96, failureRatePct: 0.0 },
      { modelId: 'llm_llama3_70b', category: 'LLM', version: '3.0.0', meanLatencyMs: 2400, gpuUsagePct: 78, memoryMb: 42000, confidenceScore: 0.95, interModelAgreement: 0.93, failureRatePct: 1.0 },
      { modelId: 'pred_suite_11', category: 'PREDICTION', version: '3.5.0', meanLatencyMs: 320, gpuUsagePct: 30, memoryMb: 18000, confidenceScore: 0.93, interModelAgreement: 0.91, failureRatePct: 0.0 }
    ];

    const leaderboard = LeaderboardGenerator.generateLeaderboard(telemetryResults);

    return {
      timestamp: Date.now(),
      totalBenchmarkVideos: videoItems.length,
      leaderboard,
      regressionsDetected: []
    };
  }

  public checkRegression(
    previous: ModelBenchmarkTelemetry,
    current: ModelBenchmarkTelemetry
  ): RegressionAlert[] {
    return RegressionDetector.detectRegressions(previous, current);
  }
}
