import { ScoredContent } from './DiversificationModule';

export interface FeedItem {
  feedPosition: number;
  contentId: string;
  creatorId: string;
  recommendationScore: number;
  confidenceScore: number;
  distributionWave: number;
  selectionReason: string;
  predictedRetentionRate: number;
}

export class FeedConstructor {
  public constructPersonalizedFeed(scoredItems: ScoredContent[], platformId: string): FeedItem[] {
    return scoredItems.map((item, index) => {
      const confidenceScore = Number((0.85 + item.scores.totalScore * 0.12).toFixed(3));
      
      const selectionReason = `Recommended on ${platformId}: High DNA match (${item.scores.dnaSimilarity}) + Trend alignment (${item.scores.trendAffinity}).`;

      return {
        feedPosition: index + 1,
        contentId: item.content.id,
        creatorId: item.content.creatorId,
        recommendationScore: item.scores.totalScore,
        confidenceScore,
        distributionWave: item.content.distribution.distributionWave,
        selectionReason,
        predictedRetentionRate: item.scores.predictedRetention
      };
    });
  }
}
