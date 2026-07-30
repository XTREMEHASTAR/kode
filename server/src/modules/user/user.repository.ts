import { getPrisma } from '../../config/database.js';
import type { User } from '@prisma/client';

// ──────────────────────────────────────────────
// User Repository — Data Access Layer
// ──────────────────────────────────────────────

export class UserRepository {
  private get db() {
    return getPrisma();
  }

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async update(
    id: string,
    data: Partial<Pick<User, 'firstName' | 'lastName' | 'email'>>,
  ): Promise<User> {
    return this.db.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.db.user.count();
  }
}
