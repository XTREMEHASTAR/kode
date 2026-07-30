import { getPrisma } from '../../config/database.js';
import type { Workspace } from '@prisma/client';

// ──────────────────────────────────────────────
// Workspace Repository
// ──────────────────────────────────────────────

export class WorkspaceRepository {
  private get db() {
    return getPrisma();
  }

  async findAll(): Promise<Workspace[]> {
    return this.db.workspace.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.db.workspace.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    return this.db.workspace.findUnique({ where: { slug } });
  }

  async create(data: {
    name: string;
    slug: string;
    avatarText: string;
    avatarBg?: string;
    avatarColor?: string;
    tagline?: string;
    prohibitedTerms?: string;
  }): Promise<Workspace> {
    return this.db.workspace.create({ data });
  }

  async update(id: string, data: Partial<Omit<Workspace, 'id' | 'createdAt'>>): Promise<Workspace> {
    return this.db.workspace.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.workspace.delete({ where: { id } });
  }
}
