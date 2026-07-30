import type { Request, Response, NextFunction } from 'express';
import { WorkspaceService } from './workspace.service.js';

// ──────────────────────────────────────────────
// Workspace Controller
// ──────────────────────────────────────────────

export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaces = await this.workspaceService.listAll();
      res.json({ success: true, data: workspaces });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspace = await this.workspaceService.getById(String(req.params.id));
      res.json({ success: true, data: workspace });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspace = await this.workspaceService.create(req.body);
      res.status(201).json({ success: true, data: workspace });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspace = await this.workspaceService.update(String(req.params.id), req.body);
      res.json({ success: true, data: workspace });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.workspaceService.delete(String(req.params.id));
      res.json({ success: true, data: null, message: 'Workspace deleted' });
    } catch (error) {
      next(error);
    }
  };
}
