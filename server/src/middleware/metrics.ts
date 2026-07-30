import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

// ──────────────────────────────────────────────
// Monitoring Hooks — Metrics Collection
//
// Lightweight request metrics that can be scraped
// by Prometheus, Datadog, or any monitoring agent.
// No external dependency — uses in-memory counters
// with periodic log emission.
// ──────────────────────────────────────────────

interface RouteMetrics {
  count: number;
  totalDurationMs: number;
  errors: number;
  statusCodes: Record<number, number>;
}

class MetricsCollector {
  private routes = new Map<string, RouteMetrics>();
  private totalRequests = 0;
  private totalErrors = 0;
  private startTime = Date.now();
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // Emit metrics summary every 60 seconds in production
    if (process.env.NODE_ENV === 'production') {
      this.flushInterval = setInterval(() => this.emitSummary(), 60_000);
      this.flushInterval.unref(); // Don't prevent shutdown
    }
  }

  record(method: string, path: string, statusCode: number, durationMs: number): void {
    const routeKey = `${method} ${this.normalizePath(path)}`;

    let metrics = this.routes.get(routeKey);
    if (!metrics) {
      metrics = { count: 0, totalDurationMs: 0, errors: 0, statusCodes: {} };
      this.routes.set(routeKey, metrics);
    }

    metrics.count++;
    metrics.totalDurationMs += durationMs;
    metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;

    if (statusCode >= 500) {
      metrics.errors++;
      this.totalErrors++;
    }

    this.totalRequests++;
  }

  /**
   * Get metrics snapshot (for /api/metrics or Prometheus scraping).
   */
  getSnapshot(): {
    uptime: number;
    totalRequests: number;
    totalErrors: number;
    errorRate: number;
    routes: Array<{
      route: string;
      count: number;
      avgDurationMs: number;
      errors: number;
      statusCodes: Record<number, number>;
    }>;
    memory: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
      external: number;
    };
    process: {
      pid: number;
      uptime: number;
      nodeVersion: string;
    };
  } {
    const mem = process.memoryUsage();

    return {
      uptime: Date.now() - this.startTime,
      totalRequests: this.totalRequests,
      totalErrors: this.totalErrors,
      errorRate: this.totalRequests > 0 ? this.totalErrors / this.totalRequests : 0,
      routes: Array.from(this.routes.entries())
        .map(([route, m]) => ({
          route,
          count: m.count,
          avgDurationMs: Math.round(m.totalDurationMs / m.count),
          errors: m.errors,
          statusCodes: m.statusCodes,
        }))
        .sort((a, b) => b.count - a.count),
      memory: {
        rss: Math.round(mem.rss / 1_048_576),
        heapUsed: Math.round(mem.heapUsed / 1_048_576),
        heapTotal: Math.round(mem.heapTotal / 1_048_576),
        external: Math.round(mem.external / 1_048_576),
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        nodeVersion: process.version,
      },
    };
  }

  private normalizePath(path: string): string {
    // Replace UUIDs and numeric IDs with :id placeholder
    return path
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
      .split('?')[0]; // Strip query params
  }

  private emitSummary(): void {
    if (this.totalRequests === 0) return;

    const snapshot = this.getSnapshot();
    logger.info(
      {
        totalRequests: snapshot.totalRequests,
        totalErrors: snapshot.totalErrors,
        errorRate: snapshot.errorRate.toFixed(4),
        memoryMB: snapshot.memory.rss,
        topRoutes: snapshot.routes.slice(0, 5).map((r) => ({
          route: r.route,
          count: r.count,
          avgMs: r.avgDurationMs,
        })),
      },
      'Metrics summary',
    );
  }

  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}

// Singleton
export const metrics = new MetricsCollector();

/**
 * Express middleware that records request metrics.
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.record(req.method, req.path, res.statusCode, duration);
  });

  next();
}
