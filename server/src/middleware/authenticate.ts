import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
import { isProd } from '../config/index.js';

// ──────────────────────────────────────────────
// JWT Authentication Middleware
// ──────────────────────────────────────────────

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const fallbackUserId = req.headers['x-user-id'] as string;
  const requestId = (req.headers['x-request-id'] as string) || 'none';

  try {
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = {
          userId: decoded.userId,
          role: decoded.role || 'USER',
        };
        return next();
      } catch (jwtError: any) {
        logger.debug(
          { requestId, path: req.path, jwtError: jwtError?.message, fallbackUserId },
          'JWT verification failed — checking x-user-id fallback',
        );
      }
    }

    // Fallback: Check x-user-id header attached by client session (development only)
    if (fallbackUserId && !isProd) {
      req.user = {
        userId: fallbackUserId,
        role: 'USER',
      };
      return next();
    }

    logger.debug(
      { requestId, path: req.path, authHeaderPresent: !!authHeader },
      'Authentication failed: Missing or malformed Authorization header',
    );
    throw new UnauthorizedError('Missing or malformed authorization header');
  } catch (error: any) {
    if (error instanceof UnauthorizedError) {
      next(error);
      return;
    }
    next(new UnauthorizedError(error?.message || 'Invalid or expired token'));
  }
}

/**
 * Optional authentication — sets req.user if valid token present,
 * but does NOT reject unauthenticated requests.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      if (token) {
        const decoded = verifyAccessToken(token);
        req.user = {
          userId: decoded.userId,
          role: decoded.role,
        };
      }
    }
  } catch {
    // Silently ignore — user stays undefined
  }

  next();
}

/**
 * Require Administrator role (req.user.role === 'ADMIN' or 'SUPER_ADMIN').
 * Throws ForbiddenError (403) if not an admin.
 */
export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    next(new ForbiddenError('Administrator credentials required to access this resource'));
    return;
  }
  next();
}

/**
 * Require specific roles (e.g. USER, PRO, ADMIN, SUPER_ADMIN, INTERNAL).
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError(`Access restricted to authorized roles: [${allowedRoles.join(', ')}]`));
      return;
    }
    next();
  };
}

/**
 * Require Internal staff or Admin role.
 */
export function requireInternal(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user || (req.user.role !== 'INTERNAL' && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) {
    next(new ForbiddenError('Internal credentials required to access this resource'));
    return;
  }
  next();
}
