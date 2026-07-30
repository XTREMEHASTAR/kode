import { CompetitorItem, CompetitionSlotResult } from '../contracts/engine.types.js';

/**
 * Content Competition Engine Module - Mathematically Grounded
 * Models zero-sum attention economy marketplace via Tullock Contest Auction Functions.
 */
export class ContentCompetitionEngine {
  /**
   * Tullock Contest Function for Attention Auction
   * P_i = (e_i^r) / sum_{j=1}^K (e_j^r)
   * where e_i is hook strength effort, and r is contest discrimination coefficient
   */
  public calculateTullockContestProbability(efforts: number[], r: number = 2.0): number[] {
    const poweredEfforts = efforts.map(e => Math.pow(Math.max(1, e), r));
    const totalPower = poweredEfforts.reduce((a, b) => a + b, 0);
    return poweredEfforts.map(p => Number((p / (totalPower || 1)).toFixed(4)));
  }

  public simulateFeedSlotAuction(
    targetContentId: string,
    targetHookScore: number,
    niche: string
  ): CompetitionSlotResult {
    const competitors: CompetitorItem[] = [
      { competitorId: 'comp_1', title: 'Top 5 AI Tools You Didn\'t Know', niche, viralityPower: 88, hookStrength: 82 },
      { competitorId: 'comp_2', title: 'How I Built a $10k/mo App in 48 Hours', niche, viralityPower: 92, hookStrength: 90 },
      { competitorId: 'comp_3', title: 'Stop Making This Huge Marketing Mistake', niche, viralityPower: 75, hookStrength: 78 }
    ];

    const efforts = [targetHookScore, ...competitors.map(c => c.hookStrength)];
    const winProbabilities = this.calculateTullockContestProbability(efforts, 2.5); // r = 2.5 (competitive feed discrimination)

    const targetWinProb = winProbabilities[0];
    const impressionSharePct = Number((targetWinProb * 100).toFixed(1));

    // Rank evaluation
    const sortedEfforts = [...efforts].sort((a, b) => b - a);
    const rank = sortedEfforts.indexOf(targetHookScore) + 1;
    const competitiveDisplacementPenalty = Number((Math.min(1.0, targetWinProb * 4.0)).toFixed(2));

    return {
      targetContentId,
      competitorCount: competitors.length,
      impressionSharePct,
      relativeHookRank: rank,
      competitiveDisplacementPenalty
    };
  }
}
