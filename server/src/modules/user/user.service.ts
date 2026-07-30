import { UserRepository } from './user.repository.js';
import { NotFoundError } from '../../utils/apiError.js';

// ──────────────────────────────────────────────
// User Service
// ──────────────────────────────────────────────

interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
}

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string },
  ): Promise<UserProfileResponse> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const updated = await this.userRepo.update(userId, data);

    return {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role,
      emailVerified: updated.emailVerified,
      createdAt: updated.createdAt,
    };
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    await this.userRepo.delete(userId);
  }
}
