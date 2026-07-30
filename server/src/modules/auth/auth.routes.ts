import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthRepository } from './auth.repository.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';
import { csrfProtection } from '../../middleware/csrf.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  revokeSessionSchema,
  logoutSchema,
} from './auth.validation.js';

// ──────────────────────────────────────────────
// Auth Routes
// ──────────────────────────────────────────────

export function createAuthRouter(): Router {
  const router = Router();

  // Dependency injection
  const authRepo = new AuthRepository();
  const authService = new AuthService(authRepo);
  const authController = new AuthController(authService);

  // ── Rate Limiters ─────────────────────────────

  // Strict: registration/login attempts
  const authRateLimit = rateLimiter({
    windowMs: 60_000,    // 1 minute
    maxRequests: 10,     // 10 attempts per minute
    keyPrefix: 'rl:auth',
  });

  // Very strict: password operations
  const passwordRateLimit = rateLimiter({
    windowMs: 300_000,   // 5 minutes
    maxRequests: 5,      // 5 per 5 minutes
    keyPrefix: 'rl:password',
  });

  // Moderate: token refresh
  const refreshRateLimit = rateLimiter({
    windowMs: 60_000,
    maxRequests: 30,
    keyPrefix: 'rl:refresh',
  });

  // ── Public Routes (no auth required) ──────────

  router.post(
    '/register',
    authRateLimit,
    validate({ body: registerSchema }),
    authController.register,
  );

  router.post(
    '/login',
    authRateLimit,
    validate({ body: loginSchema }),
    authController.login,
  );

  router.post(
    '/google',
    authRateLimit,
    authController.googleLogin,
  );

  router.post(
    '/apple',
    authRateLimit,
    authController.appleLogin,
  );

  router.post(
    '/refresh',
    refreshRateLimit,
    authController.refresh,
  );

  router.post(
    '/forgot-password',
    passwordRateLimit,
    validate({ body: forgotPasswordSchema }),
    authController.forgotPassword,
  );

  router.post(
    '/reset-password',
    passwordRateLimit,
    validate({ body: resetPasswordSchema }),
    authController.resetPassword,
  );

  router.post(
    '/verify-email',
    validate({ body: verifyEmailSchema }),
    authController.verifyEmail,
  );

  // ── Protected Routes (auth + CSRF required) ───

  router.post(
    '/logout',
    authenticate,
    validate({ body: logoutSchema }),
    authController.logout,
  );

  router.post(
    '/change-password',
    authenticate,
    csrfProtection,
    passwordRateLimit,
    validate({ body: changePasswordSchema }),
    authController.changePassword,
  );

  router.post(
    '/delete-account',
    authenticate,
    csrfProtection,
    validate({ body: deleteAccountSchema }),
    authController.deleteAccount,
  );

  router.post(
    '/resend-verification',
    authenticate,
    authRateLimit,
    authController.resendVerification,
  );

  // ── Session Management ────────────────────────

  router.get(
    '/sessions',
    authenticate,
    authController.listSessions,
  );

  router.post(
    '/sessions/revoke',
    authenticate,
    csrfProtection,
    validate({ body: revokeSessionSchema }),
    authController.revokeSession,
  );

  // ── Current User ──────────────────────────────

  router.get('/me', authenticate, authController.me);

  return router;
}
