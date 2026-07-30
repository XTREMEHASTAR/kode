import { WorldEvent, WorldEventHandler, WorldEventType } from './types.js';

export class WorldEventBus {
  private handlers: Map<WorldEventType, Set<WorldEventHandler>> = new Map();
  private eventHistory: WorldEvent[] = [];
  private maxHistorySize = 1000;

  /**
   * Subscribe to specific world event type
   */
  public subscribe<T = any>(type: WorldEventType, handler: WorldEventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Unsubscribe function
    return () => {
      const set = this.handlers.get(type);
      if (set) {
        set.delete(handler);
      }
    };
  }

  /**
   * Dispatch event to all registered subscribers
   */
  public async publish<T = any>(event: Omit<WorldEvent<T>, 'id'>): Promise<WorldEvent<T>> {
    const fullEvent: WorldEvent<T> = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };

    // Store in circular history buffer
    this.eventHistory.push(fullEvent);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    const set = this.handlers.get(event.type);
    if (set && set.size > 0) {
      const promises = Array.from(set).map(handler => {
        try {
          return Promise.resolve(handler(fullEvent));
        } catch (err) {
          console.error(`[WorldEventBus] Handler error on ${event.type}:`, err);
          return Promise.resolve();
        }
      });
      await Promise.all(promises);
    }

    return fullEvent;
  }

  /**
   * Retrieves recent event log history
   */
  public getEventHistory(limit = 50): WorldEvent[] {
    return this.eventHistory.slice(-limit);
  }

  /**
   * Clears event history buffer
   */
  public clearHistory(): void {
    this.eventHistory = [];
  }
}
