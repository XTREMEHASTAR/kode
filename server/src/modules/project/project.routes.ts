import { Router } from 'express';
import { ProjectController } from './project.controller.js';
import { ProjectService } from './project.service.js';
import { ProjectRepository } from './project.repository.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from './project.validation.js';

// ──────────────────────────────────────────────
// Project Routes
// ──────────────────────────────────────────────

export function createProjectRouter(): Router {
  const router = Router();

  const projectRepo = new ProjectRepository();
  const projectService = new ProjectService(projectRepo);
  const projectController = new ProjectController(projectService);

  router.use(authenticate);

  router.get('/', projectController.list);
  router.get('/:id', validate({ params: projectIdParamSchema }), projectController.getById);
  router.post('/', validate({ body: createProjectSchema }), projectController.create);
  router.patch('/:id', validate({ params: projectIdParamSchema, body: updateProjectSchema }), projectController.update);
  router.delete('/:id', validate({ params: projectIdParamSchema }), projectController.delete);

  return router;
}
