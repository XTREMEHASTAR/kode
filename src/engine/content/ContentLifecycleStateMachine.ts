import { ContentLifecycleState } from './ContentEntity';

export class ContentLifecycleStateMachine {
  private static readonly VALID_TRANSITIONS: Record<ContentLifecycleState, ContentLifecycleState[]> = {
    DRAFT: ['SCHEDULED', 'PUBLISHED'],
    SCHEDULED: ['PUBLISHED', 'ARCHIVED'],
    PUBLISHED: ['CANDIDATE_POOL', 'ARCHIVED'],
    CANDIDATE_POOL: ['RECOMMENDED', 'DECAY', 'ARCHIVED'],
    RECOMMENDED: ['VIEWER_EXPOSURE', 'CANDIDATE_POOL', 'DECAY'],
    VIEWER_EXPOSURE: ['GROWTH', 'DECAY', 'RECOMMENDED'],
    GROWTH: ['PEAK', 'DECAY'],
    PEAK: ['DECAY'],
    DECAY: ['ARCHIVED', 'CANDIDATE_POOL'],
    ARCHIVED: [] // Terminal state
  };

  public static canTransition(current: ContentLifecycleState, target: ContentLifecycleState): boolean {
    const allowed = this.VALID_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  public static validateTransition(current: ContentLifecycleState, target: ContentLifecycleState): void {
    if (!this.canTransition(current, target)) {
      throw new Error(`Invalid Content Lifecycle Transition: Cannot transition from ${current} to ${target}.`);
    }
  }
}
