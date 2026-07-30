import type { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError } from '../utils/apiError.js';
import { captureException } from '../utils/sentry.js';
import { logger } from '../utils/logger.js';
import type { ApiErrorResponse } from '../types/index.js';

// ──────────────────────────────────────────────
// Global Error Handler
// ──────────────────────────────────────────────

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Known operational errors ──
  if (err instanceof ValidationError) {
    const body: ApiErrorResponse & { errors: Record<string, string[]> } = {
      success: false,
      message: err.message,
      errors: err.errors,
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ApiError) {
    const body: ApiErrorResponse = {
      success: false,
      message: err.message,
    };
    res.status(err.statusCode).json(body);

    // Log server errors, skip client errors
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.path, method: req.method }, 'Server error');
      captureException(err, { path: req.path, method: req.method });
    }
    return;
  }

  // ── Unexpected errors — never leak details in production ──
  logger.error({ err, message: err.message, stack: err.stack, path: req.path, method: req.method }, 'Unhandled error');
  captureException(err, { path: req.path, method: req.method });

  const body: ApiErrorResponse = {
    success: false,
    message: err.message || 'Internal server error',
  };

  res.status(500).json(body);
}
