import type { Request, Response, NextFunction } from 'express';
import { ProjectService } from './project.service.js';

// ──────────────────────────────────────────────
// Project Controller
// ──────────────────────────────────────────────

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const workspaceId = String(req.query.workspace_id ?? '');
      const projects = await this.projectService.listByWorkspace(workspaceId);
      res.json({ success: true, data: projects });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectService.getById(String(req.params.id));
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectService.create(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const project = await this.projectService.update(String(req.params.id), req.body);
      res.json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.projectService.delete(String(req.params.id));
      res.json({ success: true, data: null, message: 'Project deleted' });
    } catch (error) {
      next(error);
    }
  };
}
