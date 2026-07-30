import { EventEmitter } from 'events';
import { SystemSimulationEvent, EventSubscriptionCallback } from '../contracts/events.js';

/**
 * Event Bus Engine Module
 * High-throughput asynchronous message broker decoupling all 12 simulation modules.
 */
export class SimulationEventBus {
  private emitter: EventEmitter;
  private eventHistory: SystemSimulationEvent[] = [];
  private maxHistorySize: number = 5000;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(200);
  }

  public publish<T = unknown>(topic: string, simulationId: string, payload: T): void {
    const event: SystemSimulationEvent<T> = {
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      topic,
      timestamp: Date.now(),
      simulationId,
      payload
    };

    if (this.eventHistory.length >= this.maxHistorySize) {
      this.eventHistory.shift();
    }
    this.eventHistory.push(event as SystemSimulationEvent);

    setImmediate(() => {
      this.emitter.emit(topic, event);
      this.emitter.emit('*', event);
    });
  }

  public subscribe<T = unknown>(topic: string, callback: EventSubscriptionCallback<T>): () => void {
    const handler = (event: SystemSimulationEvent<T>) => {
      try {
        const result = callback(event);
        if (result instanceof Promise) {
          result.catch(err => {
            console.error(`[EventBus] Unhandled error in subscriber for topic "${topic}":`, err);
          });
        }
      } catch (err) {
        console.error(`[EventBus] Error in subscriber for topic "${topic}":`, err);
      }
    };

    this.emitter.on(topic, handler);

    return () => {
      this.emitter.off(topic, handler);
    };
  }

  public getEventHistory(simulationId?: string, topicFilter?: string): SystemSimulationEvent[] {
    return this.eventHistory.filter(evt => {
      if (simulationId && evt.simulationId !== simulationId) return false;
      if (topicFilter && evt.topic !== topicFilter) return false;
      return true;
    });
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}
