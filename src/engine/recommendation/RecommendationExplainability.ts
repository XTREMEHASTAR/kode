import { ScoredContent } from './DiversificationModule';

export interface RecommendationExplanation {
  contentId: string;
  finalRankScore: number;
  confidenceScore: number;
  topContributingFactors: string[];
  negativePenalties: string[];
  recommendationReason: string;
}

export class RecommendationExplainability {
  public generateExplanation(scoredItem: ScoredContent): RecommendationExplanation {
    const scores = scoredItem.scores;
    const topContributingFactors: string[] = [];
    const negativePenalties: string[] = [];

    if (scores.dnaSimilarity > 0.60) {
      topContributingFactors.push(`Content DNA Cosine Match (+${(scores.dnaSimilarity * 0.35).toFixed(3)})`);
    }
    if (scores.trendAffinity > 1.5) {
      topContributingFactors.push(`Platform Trend Audio/Topic Alignment (+${(scores.trendAffinity * 0.12).toFixed(3)})`);
    }
    if (scores.creatorAuthority > 0.70) {
      topContributingFactors.push(`Creator Brand Authority Score (+${(scores.creatorAuthority * 0.15).toFixed(3)})`);
    }

    if (scores.freshnessDecay < 0.80) {
      negativePenalties.push(`Freshness Decay Penalty (-${((1 - scores.freshnessDecay) * 0.10).toFixed(3)})`);
    }

    const confidenceScore = Number((0.85 + scores.totalScore * 0.12).toFixed(3));

    return {
      contentId: scoredItem.content.id,
      finalRankScore: scores.totalScore,
      confidenceScore,
      topContributingFactors,
      negativePenalties,
      recommendationReason: `Selected via 10-stage cascade: Strong DNA vector alignment and high predicted retention (${(scores.predictedRetention * 100).toFixed(0)}%).`
    };
  }
}
