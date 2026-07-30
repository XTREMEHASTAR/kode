import type { Request, Response, NextFunction } from 'express';
import { AiService } from './ai.service.js';
import type { AnalyzeInput, RewriteInput, ImproveInput, ChatInput } from './ai.validation.js';
import type { UsageSnapshot } from '../usage/usage.service.js';
import { logger } from '../../utils/logger.js';

// ──────────────────────────────────────────────
// AI Gateway Controller
//
// All AI requests flow through here. The frontend
// never communicates with Ollama directly.
//
// Every response includes `quota` from the usage
// middleware (set in res.locals.usage).
// ──────────────────────────────────────────────

export class AiController {
  constructor(private readonly aiService: AiService) {}

  // ── POST /api/ai/analyze ──────────────────────

  analyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as AnalyzeInput;

      logger.info(
        { userId: req.user?.userId, contentType: input.contentType },
        'AI analyze request',
      );

      const result = await this.aiService.analyze(input);

      res.json({
        success: true,
        data: result,
        quota: this.getQuota(res),
      });
    } catch (error) {
      next(error);
    }
  };

  // ── POST /api/ai/rewrite ──────────────────────

  rewrite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as RewriteInput;

      logger.info(
        { userId: req.user?.userId, contentType: input.contentType },
        'AI rewrite request',
      );

      const result = await this.aiService.rewrite(input);

      res.json({
        success: true,
        data: result,
        quota: this.getQuota(res),
      });
    } catch (error) {
      next(error);
    }
  };

  // ── POST /api/ai/improve ─────────────────────

  improve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as ImproveInput;

      logger.info(
        { userId: req.user?.userId, type: input.type },
        'AI improve request',
      );

      const result = await this.aiService.improve(input);

      res.json({
        success: true,
        data: result,
        quota: this.getQuota(res),
      });
    } catch (error) {
      next(error);
    }
  };

  // ── POST /api/ai/chat ────────────────────────

  chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as ChatInput;

      logger.info(
        { userId: req.user?.userId, stream: input.stream },
        'AI chat request',
      );

      // Streaming response via Server-Sent Events (SSE)
      if (input.stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        let clientDisconnected = false;
        req.on('close', () => {
          clientDisconnected = true;
        });

        try {
          const result = await this.aiService.chat({
            message: input.message,
            context: input.context,
            stream: true,
            onChunk: (chunk, done) => {
              if (clientDisconnected) return;

              if (done) {
                res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                return;
              }

              if (chunk) {
                res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
              }
            },
          });

          if (!clientDisconnected) {
            res.write(
              `data: ${JSON.stringify({
                done: true,
                meta: {
                  provider: result.provider,
                  model: result.model,
                  durationMs: result.durationMs,
                },
                quota: this.getQuota(res),
              })}\n\n`,
            );
            res.end();
          }
        } catch (error) {
          if (!clientDisconnected) {
            res.write(
              `data: ${JSON.stringify({
                error: error instanceof Error ? error.message : 'AI request failed',
              })}\n\n`,
            );
            res.end();
          }
        }

        return;
      }

      // Non-streaming response
      const result = await this.aiService.chat({
        message: input.message,
        context: input.context,
      });

      res.json({
        success: true,
        data: result,
        quota: this.getQuota(res),
      });
    } catch (error) {
      next(error);
    }
  };

  // ── GET /api/ai/health ────────────────────────

  health = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const health = await this.aiService.getHealth();
      const statusCode = health.status === 'healthy' ? 200 : 503;

      res.status(statusCode).json({
        success: health.status === 'healthy',
        data: health,
      });
    } catch (error) {
      next(error);
    }
  };

  // ── Private ───────────────────────────────────

  /**
   * Extract quota snapshot from res.locals (set by usage middleware).
   */
  private getQuota(res: Response): UsageSnapshot | undefined {
    return res.locals.usage as UsageSnapshot | undefined;
  }
}
