import { Router } from 'express';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { UserRepository } from './user.repository.js';
import { authenticate } from '../../middleware/authenticate.js';

// ──────────────────────────────────────────────
// User Routes
// ──────────────────────────────────────────────

export function createUserRouter(): Router {
  const router = Router();

  const userRepo = new UserRepository();
  const userService = new UserService(userRepo);
  const userController = new UserController(userService);

  // All user routes require authentication
  router.use(authenticate);

  router.get('/profile', userController.getProfile);
  router.patch('/profile', userController.updateProfile);
  router.delete('/account', userController.deleteAccount);

  return router;
}
