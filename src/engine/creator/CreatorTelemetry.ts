export type CreatorEventType = 'CREATOR_REGISTERED' | 'CONTENT_PUBLISHED' | 'VIRAL_SPIKE' | 'TRUST_DECAY';

export interface CreatorTelemetryEvent {
  timestamp: number;
  creatorId: string;
  eventType: CreatorEventType;
  details: string;
  followerCount: number;
}

export class CreatorTelemetry {
  private events: CreatorTelemetryEvent[] = [];

  public logEvent(event: CreatorTelemetryEvent): void {
    this.events.push(event);
  }

  public getEvents(): CreatorTelemetryEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
