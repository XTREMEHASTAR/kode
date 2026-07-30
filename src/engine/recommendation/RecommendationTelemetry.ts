export type RecommendationEventType = 
  | 'CONTENT_SELECTED'
  | 'CONTENT_REJECTED'
  | 'FEED_GENERATED'
  | 'RANK_UPDATED'
  | 'DISTRIBUTION_EXPANDED'
  | 'DISTRIBUTION_STOPPED';

export interface RecommendationTelemetryEvent {
  timestamp: number;
  simulationTick: number;
  viewerId?: string;
  contentId?: string;
  eventType: RecommendationEventType;
  score?: number;
  confidence?: number;
  details: string;
}

export class RecommendationTelemetry {
  private events: RecommendationTelemetryEvent[] = [];

  public logEvent(event: RecommendationTelemetryEvent): void {
    this.events.push(event);
  }

  public getEvents(): RecommendationTelemetryEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
