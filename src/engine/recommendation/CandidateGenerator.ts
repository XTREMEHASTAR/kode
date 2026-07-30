import { ContentEntity } from '../content/ContentEntity';

export class CandidateGenerator {
  public retrieveCandidates(eligibleContent: ContentEntity[], platformId: string, limit: number = 200): ContentEntity[] {
    return eligibleContent
      .filter(c => c.platformId === platformId || c.platformId === 'global')
      .slice(0, limit);
  }
}
