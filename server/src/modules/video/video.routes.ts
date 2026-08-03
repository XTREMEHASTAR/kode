import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { VideoController } from './video.controller.js';
import { VideoService } from './video.service.js';
import { VideoRepository } from './video.repository.js';
import { authenticate } from '../../middleware/authenticate.js';
import { config } from '../../config/index.js';

// ──────────────────────────────────────────────
// Video Routes
// ──────────────────────────────────────────────

export function createVideoRouter(): Router {
  const router = Router();

  const videoRepo = new VideoRepository();
  const videoService = new VideoService(videoRepo);
  const videoController = new VideoController(videoService);

  // Configure multer for file uploads
  const uploadDir = path.resolve(config.UPLOAD_DIR);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: config.MAX_FILE_SIZE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedMimes = ['video/mp4', 'video/quicktime', 'video/webm', 'video/avi'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Unsupported file type: ${file.mimetype}`));
      }
    },
  });

  router.use(authenticate);

  router.get('/', videoController.list);
  router.get('/:id', videoController.getById);
  router.post('/', upload.single('video'), videoController.create);
  router.post('/:id', videoController.updateAnalysis);
  router.post('/:id/analysis', videoController.updateAnalysis);
  router.put('/:id', videoController.updateAnalysis);
  router.patch('/:id', videoController.updateAnalysis);
  router.delete('/:id', videoController.delete);

  return router;
}
