import { RecommendationCandidate, WaveGateEvaluation, SyntheticAgent } from '../contracts/engine.types.js';

/**
 * Recommendation Engine Module
 * Simulates algorithmic candidate retrieval, vector scoring, and distribution wave gates.
 */
export class RecommendationEngine {
  public rankContentForAgent(agent: SyntheticAgent, candidates: RecommendationCandidate[]): RecommendationCandidate[] {
    return [...candidates].sort((a, b) => {
      const scoreA = this.computeAffinityScore(agent, a);
      const scoreB = this.computeAffinityScore(agent, b);
      return scoreB - scoreA;
    });
  }

  public evaluateWaveGates(
    _candidate: RecommendationCandidate,
    retention3s: number,
    avgRetention: number,
    isGoodHook: boolean
  ): WaveGateEvaluation[] {
    const waves: WaveGateEvaluation[] = [
      {
        waveLevel: 1,
        waveName: 'Initial Niche Seed',
        cohortSize: 1000,
        qualifiedForNextWave: retention3s >= 60.0,
        qualificationReason: retention3s >= 60.0 ? 'Cleared 3s Hook seed threshold (60%).' : 'High early dropoff capped in seed wave.',
        avgRetentionInWave: avgRetention
      },
      {
        waveLevel: 2,
        waveName: 'Early Interest Expansion',
        cohortSize: 10000,
        qualifiedForNextWave: retention3s >= 60.0 && isGoodHook,
        qualificationReason: (retention3s >= 60.0 && isGoodHook) ? 'Strong completion & curiosity score cleared expansion.' : 'Hook drop prevented algorithm push.',
        avgRetentionInWave: Number((avgRetention * 0.9).toFixed(1))
      },
      {
        waveLevel: 3,
        waveName: 'Mainstream Algorithm Push',
        cohortSize: 100000,
        qualifiedForNextWave: (retention3s >= 75.0 && isGoodHook),
        qualificationReason: (retention3s >= 75.0 && isGoodHook) ? 'High share/save ratio unlocked explore feed.' : 'Capped at Wave 2.',
        avgRetentionInWave: Number((avgRetention * 0.8).toFixed(1))
      },
      {
        waveLevel: 4,
        waveName: 'Viral Cascade',
        cohortSize: 1000000,
        qualifiedForNextWave: (retention3s >= 85.0 && isGoodHook),
        qualificationReason: (retention3s >= 85.0 && isGoodHook) ? 'Viral cascade unlocked globally.' : 'Not qualified for viral cascade.',
        avgRetentionInWave: Number((avgRetention * 0.7).toFixed(1))
      }
    ];

    return waves;
  }

  private computeAffinityScore(agent: SyntheticAgent, candidate: RecommendationCandidate): number {
    const nicheAffinity = agent.activeInterests[candidate.niche] || 0.4;
    const baseScore = candidate.hookQualityScore * 0.5 + candidate.pacingScore * 0.3 + candidate.emotionalHookScore * 0.2;
    return baseScore * nicheAffinity * (1 - agent.currentFatigue * 0.3);
  }
}
