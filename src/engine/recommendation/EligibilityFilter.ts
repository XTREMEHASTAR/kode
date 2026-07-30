import { ContentEntity } from '../content/ContentEntity';

export class EligibilityFilter {
  public filterEligibleContent(contentItems: ContentEntity[]): { eligible: ContentEntity[]; rejected: { content: ContentEntity; reason: string }[] } {
    const eligible: ContentEntity[] = [];
    const rejected: { content: ContentEntity; reason: string }[] = [];

    contentItems.forEach(item => {
      if (item.state === 'ARCHIVED') {
        rejected.push({ content: item, reason: 'Content state is ARCHIVED' });
      } else if (item.state === 'DRAFT') {
        rejected.push({ content: item, reason: 'Content is in DRAFT state' });
      } else if (item.intelligence.visualScore < 0.20) {
        rejected.push({ content: item, reason: 'Visual score below minimum threshold (0.20)' });
      } else {
        eligible.push(item);
      }
    });

    return { eligible, rejected };
  }
}
