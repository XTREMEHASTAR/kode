import { ContentEntity } from '../content/ContentEntity';
import { ScoringFactorBreakdown } from './ScoringEngine';

export interface ScoredContent {
  content: ContentEntity;
  scores: ScoringFactorBreakdown;
}

export class DiversificationModule {
  public applyMMRDiversification(scoredList: ScoredContent[], topK: number = 50): ScoredContent[] {
    // Sort primarily by total score
    const sorted = [...scoredList].sort((a, b) => b.scores.totalScore - a.scores.totalScore);
    
    // Apply Maximal Marginal Relevance (MMR) diversification to prevent niche bundling
    const result: ScoredContent[] = [];
    const seenCreators = new Set<string>();

    for (const item of sorted) {
      if (result.length >= topK) break;
      
      // Diversity penalty if same creator appears consecutively
      if (!seenCreators.has(item.content.creatorId) || result.length < 5) {
        result.push(item);
        seenCreators.add(item.content.creatorId);
      }
    }

    return result.length > 0 ? result : sorted.slice(0, topK);
  }
}
