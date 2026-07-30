import { Router } from 'express';
import { AiController } from './ai.controller.js';
import { AiService } from './ai.service.js';
import { authenticate } from '../../middleware/authenticate.js';
import { optionalAuth } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { rateLimiter } from '../../middleware/rateLimiter.js';
import { enforceUsageLimit } from '../usage/usage.middleware.js';
import {
  analyzeSchema,
  rewriteSchema,
  improveSchema,
  chatSchema,
} from './ai.validation.js';

// ──────────────────────────────────────────────
// AI Gateway Routes
//
// All AI operations route through here.
// The frontend never calls Ollama directly.
// Usage limits are enforced per action.
// ──────────────────────────────────────────────

export function createAiRouter(): Router {
  const router = Router();

  const aiService = new AiService();
  const aiController = new AiController(aiService);

  // Rate limiting tiers
  const analyzeRateLimit = rateLimiter({
    windowMs: 60_000,
    maxRequests: 10,
    keyPrefix: 'rl:ai:analyze',
  });

  const rewriteRateLimit = rateLimiter({
    windowMs: 60_000,
    maxRequests: 15,
    keyPrefix: 'rl:ai:rewrite',
  });

  const chatRateLimit = rateLimiter({
    windowMs: 60_000,
    maxRequests: 30,
    keyPrefix: 'rl:ai:chat',
  });

  // ── Public (optional auth for free tier) ──────

  router.post(
    '/analyze',
    optionalAuth,
    analyzeRateLimit,
    enforceUsageLimit('analyses'),
    validate({ body: analyzeSchema }),
    aiController.analyze,
  );

  // ── Protected (requires auth + usage limits) ──

  router.post(
    '/rewrite',
    authenticate,
    rewriteRateLimit,
    enforceUsageLimit('rewrites'),
    validate({ body: rewriteSchema }),
    aiController.rewrite,
  );

  router.post(
    '/improve',
    authenticate,
    rewriteRateLimit,
    enforceUsageLimit('rewrites'),
    validate({ body: improveSchema }),
    aiController.improve,
  );

  router.post(
    '/script/improve',
    authenticate,
    rewriteRateLimit,
    enforceUsageLimit('rewrites'),
    validate({ body: improveSchema }),
    aiController.improve,
  );

  router.post(
    '/hook/improve',
    authenticate,
    rewriteRateLimit,
    enforceUsageLimit('rewrites'),
    validate({ body: improveSchema }),
    aiController.improve,
  );

  router.post(
    '/chat',
    authenticate,
    chatRateLimit,
    enforceUsageLimit('chats'),
    validate({ body: chatSchema }),
    aiController.chat,
  );

  // ── Health (no auth, no limits) ───────────────

  router.get('/health', aiController.health);

  return router;
}
