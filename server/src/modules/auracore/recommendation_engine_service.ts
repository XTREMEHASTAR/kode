import { ContentDNA, DistributionWave } from './types.js';

export class RecommendationEngineService {
  /**
   * Evaluates Instagram algorithm candidate qualification across progressive distribution waves
   */
  public evaluateDistributionWaves(
    dna: ContentDNA,
    hookRetention3sPct: number,
    completionRatePct: number,
    avgRetentionPct: number,
    engagementScore: number
  ): DistributionWave[] {
    const waves: DistributionWave[] = [];

    // Wave 1: Initial Seed Cohort (1,000 Viewers)
    const seedThreshold = Math.max(60, Math.round(65 - (dna.hookScore - 0.5) * 20));
    const wave1Qualified = hookRetention3sPct >= seedThreshold && avgRetentionPct >= 40;
    waves.push({
      waveNumber: 1,
      waveName: "Initial Niche Seed",
      cohortSize: 1000,
      qualifiedForNextWave: wave1Qualified,
      qualificationReason: wave1Qualified
        ? `3s Hook retention (${hookRetention3sPct}%) cleared seed threshold (${seedThreshold}%).`
        : `3s Hook retention (${hookRetention3sPct}%) failed to clear initial seed threshold (${seedThreshold}%).`,
      avgRetentionInWave: avgRetentionPct
    });

    // Wave 2: Early Interest Expansion (10,000 Viewers)
    const wave2Qualified = wave1Qualified && completionRatePct >= 35 && engagementScore >= 0.08;
    waves.push({
      waveNumber: 2,
      waveName: "Early Interest Expansion",
      cohortSize: 10000,
      qualifiedForNextWave: wave2Qualified,
      qualificationReason: wave2Qualified
        ? `Completion rate (${completionRatePct}%) & engagement score cleared expansion candidate threshold.`
        : `Candidate scoring dropped in Wave 2. Completion rate (${completionRatePct}%) under 35%.`,
      avgRetentionInWave: Number((avgRetentionPct * 0.92).toFixed(1))
    });

    // Wave 3: Mainstream Algorithm Push (100,000 Viewers)
    const wave3Qualified = wave2Qualified && hookRetention3sPct >= 80 && engagementScore >= 0.15;
    waves.push({
      waveNumber: 3,
      waveName: "Mainstream Algorithm Push",
      cohortSize: 100000,
      qualifiedForNextWave: wave3Qualified,
      qualificationReason: wave3Qualified
        ? `Strong cross-cohort engagement (${engagementScore}) unlocked main explore recommendation push.`
        : `Audience expansion fatigue in broad cohort. Failed to sustain Wave 3 virality velocity.`,
      avgRetentionInWave: Number((avgRetentionPct * 0.82).toFixed(1))
    });

    // Wave 4: Viral Cascade / Explore Feed (1,000,000 Viewers)
    const wave4Qualified = wave3Qualified && avgRetentionPct >= 65;
    waves.push({
      waveNumber: 4,
      waveName: "Viral Cascade (Explore & Audio Page)",
      cohortSize: 1000000,
      qualifiedForNextWave: wave4Qualified,
      qualificationReason: wave4Qualified
        ? "Exponential share/save cascade unlocked global viral distribution."
        : "Virality score capped at Wave 3 scale due to interest graph saturation.",
      avgRetentionInWave: Number((avgRetentionPct * 0.72).toFixed(1))
    });

    return waves;
  }

  /**
   * Calculates Virality Index (0 - 100) based on Wave progression & engagement ratios
   */
  public calculateViralityIndex(
    waves: DistributionWave[],
    sharesCount: number,
    savesCount: number,
    viewsCount: number
  ): number {
    const maxWaveReached = waves.filter(w => w.qualifiedForNextWave).length + 1;
    const waveFactor = (maxWaveReached / 4) * 50; // Max 50 points from waves
    
    const shareRate = viewsCount > 0 ? (sharesCount / viewsCount) * 100 : 0;
    const saveRate = viewsCount > 0 ? (savesCount / viewsCount) * 100 : 0;

    const viralSignalScore = Math.min(50, (shareRate * 8) + (saveRate * 5));

    return Number(Math.min(99.9, Math.max(5.0, waveFactor + viralSignalScore)).toFixed(1));
  }
}
