import * as Sentry from '@sentry/node';
import { config, isProd } from '../config/index.js';
import { logger } from './logger.js';

// ──────────────────────────────────────────────
// Sentry Error Tracking
// ──────────────────────────────────────────────

export function initSentry(): void {
  if (!config.SENTRY_DSN) {
    logger.info('Sentry DSN not configured — error tracking disabled');
    return;
  }

  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.SENTRY_ENVIRONMENT,
    tracesSampleRate: isProd ? 0.2 : 1.0,
    profilesSampleRate: isProd ? 0.1 : 0,
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
    ],
  });

  logger.info({ environment: config.SENTRY_ENVIRONMENT }, 'Sentry initialized');
}

export function captureException(error: Error, context?: Record<string, unknown>): void {
  if (config.SENTRY_DSN) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setExtras(context);
      }
      Sentry.captureException(error);
    });
  }
}
