import pinoHttp from 'pino-http';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import type { IncomingMessage, ServerResponse } from 'node:http';

// ──────────────────────────────────────────────
// HTTP Request Logger Middleware
// ──────────────────────────────────────────────

export const requestLogger = (pinoHttp as unknown as typeof pinoHttp.default)({
  logger,
  genReqId: () => uuidv4(),
  customLogLevel(
    _req: IncomingMessage,
    res: ServerResponse,
    err: Error | undefined,
  ) {
    if (err || (res.statusCode && res.statusCode >= 500)) return 'error';
    if (res.statusCode && res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage(req: IncomingMessage, res: ServerResponse) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage(
    req: IncomingMessage,
    _res: ServerResponse,
    err: Error,
  ) {
    return `${req.method} ${req.url} failed: ${err.message}`;
  },
  autoLogging: {
    ignore(req: IncomingMessage) {
      return req.url === '/api/health';
    },
  },
});
