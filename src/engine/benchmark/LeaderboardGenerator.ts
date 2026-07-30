export interface ModelBenchmarkTelemetry {
  modelId: string;
  category: string;
  version: string;
  meanLatencyMs: number;
  gpuUsagePct: number;
  memoryMb: number;
  confidenceScore: number;
  interModelAgreement: number;
  failureRatePct: number;
}

export interface LeaderboardEntry {
  rank: number;
  modelId: string;
  category: string;
  version: string;
  compositeScore: number; // 0.0 to 1.0
  telemetry: ModelBenchmarkTelemetry;
}

export class LeaderboardGenerator {
  public static generateLeaderboard(results: ModelBenchmarkTelemetry[]): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = results.map(t => {
      const efficiency = Math.max(0, 1.0 - (t.meanLatencyMs / 5000));
      const compositeScore = Number((
        (0.35 * t.confidenceScore) +
        (0.25 * t.interModelAgreement) +
        (0.20 * (1.0 - (t.failureRatePct / 100))) +
        (0.20 * efficiency)
      ).toFixed(4));

      return {
        rank: 0,
        modelId: t.modelId,
        category: t.category,
        version: t.version,
        compositeScore,
        telemetry: t
      };
    });

    // Sort descending by composite score
    entries.sort((a, b) => b.compositeScore - a.compositeScore);

    // Assign rank
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return entries;
  }
}
