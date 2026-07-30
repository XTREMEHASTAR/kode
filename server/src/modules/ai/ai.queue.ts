import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

// ──────────────────────────────────────────────
// AI Request Queue — Bounded concurrency limiter
//
// Prevents overloading Ollama with concurrent
// requests. Queues requests and processes them
// in order with a configurable concurrency limit.
// ──────────────────────────────────────────────

interface QueuedTask<T> {
  id: string;
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
  enqueuedAt: number;
}

export class AiRequestQueue {
  private queue: QueuedTask<unknown>[] = [];
  private activeCount = 0;
  private readonly concurrency: number;
  private processedCount = 0;
  private rejectedCount = 0;
  private static readonly MAX_QUEUE_SIZE = 50;

  constructor(concurrency?: number) {
    this.concurrency = concurrency ?? config.AI_QUEUE_CONCURRENCY;
  }

  /**
   * Enqueue a task for execution. Returns a promise that resolves
   * when the task completes (may be delayed if the queue is busy).
   */
  async enqueue<T>(taskId: string, execute: () => Promise<T>): Promise<T> {
    // Reject if queue is full — prevent unbounded memory growth
    if (this.queue.length >= AiRequestQueue.MAX_QUEUE_SIZE) {
      this.rejectedCount++;
      logger.warn(
        { taskId, queueSize: this.queue.length },
        'AI queue full — rejecting request',
      );
      throw new Error('AI service is overloaded. Please try again later.');
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        id: taskId,
        execute: execute as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
        enqueuedAt: Date.now(),
      });

      logger.debug(
        { taskId, queueSize: this.queue.length, active: this.activeCount },
        'AI task enqueued',
      );

      this.processNext();
    });
  }

  /**
   * Get queue statistics for monitoring.
   */
  getStats(): {
    queueLength: number;
    activeCount: number;
    concurrency: number;
    processedCount: number;
    rejectedCount: number;
  } {
    return {
      queueLength: this.queue.length,
      activeCount: this.activeCount,
      concurrency: this.concurrency,
      processedCount: this.processedCount,
      rejectedCount: this.rejectedCount,
    };
  }

  // ── Internal ──────────────────────────────────

  private processNext(): void {
    if (this.activeCount >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift()!;
    this.activeCount++;

    const waitMs = Date.now() - task.enqueuedAt;
    if (waitMs > 100) {
      logger.debug({ taskId: task.id, waitMs }, 'AI task waited in queue');
    }

    task
      .execute()
      .then((result) => {
        this.processedCount++;
        task.resolve(result);
      })
      .catch((error) => {
        this.rejectedCount++;
        task.reject(error);
      })
      .finally(() => {
        this.activeCount--;
        this.processNext();
      });
  }
}
