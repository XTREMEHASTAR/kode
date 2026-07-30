import { ContentLifecycleState } from './ContentEntity';

export type LifecycleEventType =
  | 'CONTENT_CREATED'
  | 'CONTENT_PUBLISHED'
  | 'ENTERED_CANDIDATE_POOL'
  | 'RECOMMENDED'
  | 'FIRST_VIEW'
  | 'FIRST_SHARE'
  | 'TRENDING'
  | 'PEAK_REACHED'
  | 'DECAY_STARTED'
  | 'ARCHIVED';

export interface ContentTelemetryEvent {
  timestamp: number;
  simulationTick: number;
  contentId: string;
  creatorId: string;
  eventType: LifecycleEventType;
  previousState?: ContentLifecycleState;
  newState?: ContentLifecycleState;
  environmentSnapshot: {
    competitionIndex: number;
    platformId: string;
  };
  recommendationSnapshot: {
    rankScore: number;
    distributionWave: number;
  };
}

export class ContentLifecycleTelemetry {
  private events: ContentTelemetryEvent[] = [];

  public logEvent(event: ContentTelemetryEvent): void {
    this.events.push(event);
  }

  public getEvents(): ContentTelemetryEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
