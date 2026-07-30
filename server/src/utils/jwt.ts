import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/index.js';
import { UnauthorizedError } from './apiError.js';

// ──────────────────────────────────────────────
// JWT Utilities — Access & Refresh Tokens
// ──────────────────────────────────────────────

export interface TokenPayload {
  userId: string;
  role: string;
}

export interface DecodedToken extends JwtPayload, TokenPayload {}

/**
 * Validate that a token string matches basic JWT format:
 * - Non-empty string
 * - Starts with Base64URL header ("eyJ")
 * - Contains exactly 3 dot-separated segments (header.payload.signature)
 */
export function isValidJwtFormat(token: unknown): token is string {
  if (typeof token !== 'string' || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  if (!token.startsWith('eyJ')) return false;
  return true;
}

/**
 * Sign a short-lived access token (default: 15m).
 */
export function signAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'kontagi',
    audience: 'kontagi-client',
    jwtid: uuidv4(),
  };
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, options);
}

/**
 * Sign a long-lived refresh token (default: 7d).
 */
export function signRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    issuer: 'kontagi',
    audience: 'kontagi-client',
    jwtid: uuidv4(),
  };
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, options);
}

/**
 * Verify an access token. Throws on invalid/expired.
 */
export function verifyAccessToken(token: string): DecodedToken {
  if (!isValidJwtFormat(token)) {
    throw new UnauthorizedError('Malformed JWT token structure');
  }
  return jwt.verify(token, config.JWT_ACCESS_SECRET, {
    issuer: 'kontagi',
    audience: 'kontagi-client',
  }) as DecodedToken;
}

/**
 * Verify a refresh token. Throws on invalid/expired.
 */
export function verifyRefreshToken(token: string): DecodedToken {
  if (!isValidJwtFormat(token)) {
    throw new UnauthorizedError('Malformed JWT token structure');
  }
  return jwt.verify(token, config.JWT_REFRESH_SECRET, {
    issuer: 'kontagi',
    audience: 'kontagi-client',
  }) as DecodedToken;
}

/**
 * Parse expiry string (e.g. "7d", "15m") to milliseconds.
 */
export function parseExpiryToMs(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid expiry format: ${expiry}`);

  const value = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return value * multipliers[unit];
}
