import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

// ──────────────────────────────────────────────
// Request ID Middleware
//
// Assigns a unique ID to every request.
// Respects incoming X-Request-ID from load balancers.
// Sets the header on the response for tracing.
// ──────────────────────────────────────────────

export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = (req.headers['x-request-id'] as string) || uuidv4();

  // Attach to request for downstream use
  req.id = id;

  // Echo back to client for tracing
  res.setHeader('X-Request-ID', id);

  next();
}
