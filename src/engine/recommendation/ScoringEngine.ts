import { ContentEntity } from '../content/ContentEntity';
import { EnvironmentState } from '../environment/EnvironmentState';

export interface ViewerProfile {
  id: string;
  interestVector: number[]; // 1024D Interest Vector
  favoriteNiches: string[];
  watchHistoryIds: string[];
}

export interface ScoringFactorBreakdown {
  dnaSimilarity: number;
  trendAffinity: number;
  creatorAuthority: number;
  predictedRetention: number;
  predictedCompletion: number;
  freshnessDecay: number;
  totalScore: number;
}

export class ScoringEngine {
  public calculateScore(
    content: ContentEntity, 
    viewer: ViewerProfile, 
    env: EnvironmentState
  ): ScoringFactorBreakdown {
    // 1. Content DNA Cosine Similarity
    const dnaSimilarity = this.cosineSimilarity(content.intelligence.dnaVector, viewer.interestVector);

    // 2. Trend Affinity
    const trendAffinity = content.intelligence.trendAffinity;

    // 3. Creator Authority
    const creatorAuthority = content.intelligence.hookScore;

    // 4. Predicted Retention & Completion
    const predictedRetention = content.intelligence.visualScore;
    const predictedCompletion = content.intelligence.narrativeScore;

    // 5. Freshness Decay
    const ageHours = (env.timestamp - content.publishTimestamp) / (1000 * 60 * 60);
    const freshnessDecay = Number(Math.exp(-0.05 * Math.max(0, ageHours)).toFixed(3));

    // Platform-specific weighting
    const weights = env.algorithmWeights;
    const totalScore = Number((
      dnaSimilarity * 0.35 +
      trendAffinity * weights.shares +
      creatorAuthority * 0.15 +
      predictedRetention * weights.watchTime +
      predictedCompletion * weights.repeatPlays +
      freshnessDecay * 0.10
    ).toFixed(4));

    return {
      dnaSimilarity: Number(dnaSimilarity.toFixed(3)),
      trendAffinity,
      creatorAuthority,
      predictedRetention,
      predictedCompletion,
      freshnessDecay,
      totalScore
    };
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0.5;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0.5;
    return (dot / (Math.sqrt(normA) * Math.sqrt(normB)) + 1) / 2; // Normalize to [0, 1]
  }
}
