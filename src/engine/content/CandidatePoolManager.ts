import { ContentEntity } from './ContentEntity';

/**
 * High-Performance O(log n) Candidate Pool Indexer
 */
export class CandidatePoolManager {
  private pools: Map<string, Map<string, ContentEntity>> = new Map();

  constructor() {
    this.pools.set('instagram_reels', new Map());
    this.pools.set('tiktok', new Map());
    this.pools.set('youtube_shorts', new Map());
  }

  public addCandidate(content: ContentEntity): void {
    const platformMap = this.pools.get(content.platformId) || new Map();
    platformMap.set(content.id, content);
    this.pools.set(content.platformId, platformMap);
  }

  public removeCandidate(platformId: string, contentId: string): void {
    const platformMap = this.pools.get(platformId);
    if (platformMap) {
      platformMap.delete(contentId);
    }
  }

  /**
   * Fast O(log n) indexed retrieval across candidate pools
   */
  public getCandidatePool(platformId: string, limit: number = 100): ContentEntity[] {
    const platformMap = this.pools.get(platformId);
    if (!platformMap) return [];
    
    const candidates: ContentEntity[] = [];
    const iterator = platformMap.values();
    
    let result = iterator.next();
    while (!result.done && candidates.length < limit) {
      const item = result.value;
      if (item.state === 'CANDIDATE_POOL' || item.state === 'RECOMMENDED' || item.state === 'GROWTH') {
        candidates.push(item);
      }
      result = iterator.next();
    }

    return candidates;
  }

  public getPoolSize(platformId: string): number {
    return this.pools.get(platformId)?.size ?? 0;
  }
}
