import type { Request, Response, NextFunction } from 'express';
import { ScriptService } from './script.service.js';
import type { CreateScriptInput, UpdateScriptInput, ListScriptsQuery } from './script.validation.js';

// ──────────────────────────────────────────────
// Script Controller
// ──────────────────────────────────────────────

export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const query = req.query as unknown as ListScriptsQuery;
      const result = await this.scriptService.list(userId, query);

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const script = await this.scriptService.getById(String(req.params.id), req.user!.userId);
      res.json({ success: true, data: script });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as CreateScriptInput;
      const script = await this.scriptService.create(req.user!.userId, input);
      res.status(201).json({ success: true, data: script });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input = req.body as UpdateScriptInput;
      const script = await this.scriptService.update(String(req.params.id), req.user!.userId, input);
      res.json({ success: true, data: script });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.scriptService.delete(String(req.params.id), req.user!.userId);
      res.json({ success: true, data: null, message: 'Script deleted' });
    } catch (error) {
      next(error);
    }
  };
}
