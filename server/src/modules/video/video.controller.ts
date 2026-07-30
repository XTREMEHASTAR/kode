import type { Request, Response, NextFunction } from 'express';
import { VideoService } from './video.service.js';

// ──────────────────────────────────────────────
// Video Controller
// ──────────────────────────────────────────────

export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const projectId = String(req.query.project_id ?? '');
      const videos = await this.videoService.listByProject(projectId);
      res.json({ success: true, data: videos });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const video = await this.videoService.getById(String(req.params.id));
      res.json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      const video = await this.videoService.create({
        projectId: req.body.project_id,
        title: req.body.title || file?.originalname || 'Untitled',
        filename: file?.filename || req.body.filename,
        storagePath: file?.path,
      });
      res.status(201).json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  };

  updateAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const video = await this.videoService.updateAnalysis(String(req.params.id), req.body);
      res.json({ success: true, data: video });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.videoService.delete(String(req.params.id));
      res.json({ success: true, data: null, message: 'Video deleted' });
    } catch (error) {
      next(error);
    }
  };
}
