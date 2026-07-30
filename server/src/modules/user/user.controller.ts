import type { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service.js';

// ──────────────────────────────────────────────
// User Controller
// ──────────────────────────────────────────────

export class UserController {
  constructor(private readonly userService: UserService) {}

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getProfile(req.user!.userId);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.updateProfile(req.user!.userId, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  deleteAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteAccount(req.user!.userId);
      res.json({ success: true, data: null, message: 'Account deleted' });
    } catch (error) {
      next(error);
    }
  };
}
