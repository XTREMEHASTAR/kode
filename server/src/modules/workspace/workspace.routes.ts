import { Router } from 'express';
import { WorkspaceController } from './workspace.controller.js';
import { WorkspaceService } from './workspace.service.js';
import { WorkspaceRepository } from './workspace.repository.js';
import { authenticate } from '../../middleware/authenticate.js';

// ──────────────────────────────────────────────
// Workspace Routes
// ──────────────────────────────────────────────

export function createWorkspaceRouter(): Router {
  const router = Router();

  const workspaceRepo = new WorkspaceRepository();
  const workspaceService = new WorkspaceService(workspaceRepo);
  const workspaceController = new WorkspaceController(workspaceService);

  router.use(authenticate);

  router.get('/', workspaceController.list);
  router.get('/:id', workspaceController.getById);
  router.post('/', workspaceController.create);
  router.patch('/:id', workspaceController.update);
  router.delete('/:id', workspaceController.delete);

  return router;
}
