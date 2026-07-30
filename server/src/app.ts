import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { config } from './config/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Module routers
import { createAuthRouter } from './modules/auth/auth.routes.js';
import { createUserRouter } from './modules/user/user.routes.js';
import { createWorkspaceRouter } from './modules/workspace/workspace.routes.js';
import { createProjectRouter } from './modules/project/project.routes.js';
import { createVideoRouter } from './modules/video/video.routes.js';
import { createScriptRouter } from './modules/script/script.routes.js';
import { createAiRouter } from './modules/ai/ai.routes.js';
import { createSubscriptionRouter } from './modules/subscription/subscription.routes.js';
import { createUsageRouter } from './modules/usage/usage.routes.js';
import { createAdminRouter } from './modules/admin/admin.routes.js';
import { createAuraCoreRouter } from './modules/auracore/auracore.routes.js';
import { createAuraWorldRouter } from './modules/auraworld/auraworld.routes.js';
import { authenticate, requireAdmin } from './middleware/authenticate.js';

// Health & Readiness
import { healthHandler, readinessHandler } from './middleware/healthCheck.js';

// Monitoring
import { metricsMiddleware, metrics } from './middleware/metrics.js';

// ──────────────────────────────────────────────
// Express App Factory
// ──────────────────────────────────────────────

export function createApp(): express.Express {
  const app = express();

  // ── Trust proxy (must be first for accurate IP) ──
  app.set('trust proxy', 1);

  // ── Request ID (before all other middleware) ──
  app.use(requestId);

  // ── Security ──────────────────────────────────
  app.use(helmet({
    contentSecurityPolicy: config.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  }));
  app.use(cors({
    origin: config.CORS_ORIGIN.split(',').map((o) => o.trim().replace(/\/$/, '')),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID', 'x-user-id'],
    exposedHeaders: [
      'X-Request-ID',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'X-Usage-Limit',
      'X-Usage-Remaining',
      'X-Usage-Reset',
    ],
  }));

  // ── Compression ───────────────────────────────
  app.use(compression({
    threshold: 1024,         // Don't compress < 1KB
    level: 6,                // Default zlib level
    filter: (req, res) => {
      // Don't compress SSE streams
      if (res.getHeader('Content-Type') === 'text/event-stream') {
        return false;
      }
      return compression.filter(req, res);
    },
  }));

  // ── Cookie Parsing ────────────────────────────
  app.use(cookieParser());

  // ── Body Parsing ──────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ── Monitoring ────────────────────────────────
  app.use(metricsMiddleware);

  // ── Request Logging ───────────────────────────
  app.use(requestLogger);

  // ── Global Rate Limit ─────────────────────────
  app.use(rateLimiter({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    maxRequests: config.RATE_LIMIT_MAX_REQUESTS,
    keyPrefix: 'rl:global',
  }));

  // ── Health & Readiness ────────────────────────
  // Outside /api prefix — standard for K8s probes
  app.get('/health', healthHandler);
  app.get('/healthz', healthHandler);
  app.get('/ready', readinessHandler);
  app.get('/readyz', readinessHandler);
  // Also under /api for backwards compatibility
  app.get('/api/health', healthHandler);

  // ── Metrics (internal — protect in production with Admin requirement) ──
  app.get('/api/metrics', authenticate, requireAdmin, (_req, res) => {
    res.json({ success: true, data: metrics.getSnapshot() });
  });

  // ── Route Aliases & Synchronizations ──────────
  const prefix = config.API_PREFIX;

  app.get('/api/settings', authenticate, (_req, res) => {
    res.json({
      success: true,
      data: {
        theme: 'dark',
        border_radius: '12',
        language: 'en',
        timezone: 'UTC',
        date_format: 'ddmmyyyy',
      },
    });
  });

  app.post('/api/settings', authenticate, (req, res) => {
    res.json({
      success: true,
      data: req.body,
    });
  });

  app.get('/settings', authenticate, (_req, res) => {
    res.json({
      success: true,
      data: {
        theme: 'dark',
        border_radius: '12',
        language: 'en',
        timezone: 'UTC',
        date_format: 'ddmmyyyy',
      },
    });
  });

  app.use(`${prefix}/auth`, createAuthRouter());
  app.use(`${prefix}/users`, createUserRouter());
  app.use(`${prefix}/workspaces`, createWorkspaceRouter());
  app.use(`${prefix}/projects`, createProjectRouter());
  app.use(`${prefix}/videos`, createVideoRouter());
  app.use(`${prefix}/upload`, createVideoRouter());
  app.use(`${prefix}/scripts`, createScriptRouter());
  app.use(`${prefix}/ai`, createAiRouter());
  app.use(`${prefix}/subscription`, createSubscriptionRouter());
  app.use(`${prefix}/usage`, createUsageRouter());
  app.use(`${prefix}/admin`, createAdminRouter());
  app.use(`${prefix}/auracore`, createAuraCoreRouter());
  app.use(`${prefix}/auraworld`, createAuraWorldRouter());

  // ── Static Files (uploads) ────────────────────
  app.use('/uploads', express.static(config.UPLOAD_DIR));

  // ── 404 Handler ───────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  // ── Global Error Handler ──────────────────────
  app.use(errorHandler);

  return app;
}
