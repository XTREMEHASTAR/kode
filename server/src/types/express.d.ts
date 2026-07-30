import type { TokenPayload } from '../utils/jwt.js';

// ──────────────────────────────────────────────
// Express Request Augmentation
// ──────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
