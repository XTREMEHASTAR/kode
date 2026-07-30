import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { ForbiddenError } from '../utils/apiError.js';

// ──────────────────────────────────────────────
// CSRF Protection via Double Submit Cookie
//
// How it works:
// 1. On login/register, server sets a `csrf_token` cookie (readable by JS)
// 2. Client sends the same token in the `X-CSRF-Token` header
// 3. Server compares cookie value === header value
// 4. Attacker can't read cross-origin cookies → can't set header
// ──────────────────────────────────────────────

const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Generate a cryptographically random CSRF token.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Set the CSRF cookie on a response.
 */
export function setCsrfCookie(res: Response, token: string): void {
  res.cookie(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by frontend JS
    secure: config.COOKIE_SECURE,
    sameSite: config.COOKIE_SAME_SITE,
    domain: config.COOKIE_DOMAIN || undefined,
    maxAge: 86_400_000, // 24 hours
    path: '/',
  });
}

/**
 * Middleware that validates the CSRF token on state-changing requests.
 * Skips GET, HEAD, OPTIONS (safe methods).
 */
export function csrfProtection(req: Request, _res: Response, next: NextFunction): void {
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken) {
    return next(new ForbiddenError('Missing CSRF token'));
  }

  // Constant-time comparison to prevent timing attacks
  const cookieBuf = Buffer.from(String(cookieToken));
  const headerBuf = Buffer.from(String(headerToken));

  if (cookieBuf.length !== headerBuf.length || !crypto.timingSafeEqual(cookieBuf, headerBuf)) {
    return next(new ForbiddenError('Invalid CSRF token'));
  }

  next();
}
