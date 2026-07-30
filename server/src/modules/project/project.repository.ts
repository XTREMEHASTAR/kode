import { getPrisma } from '../../config/database.js';
import type { Project } from '@prisma/client';

// ──────────────────────────────────────────────
// Project Repository
// ──────────────────────────────────────────────

export class ProjectRepository {
  private get db() {
    return getPrisma();
  }

  async findByWorkspace(workspaceId: string): Promise<Project[]> {
    return this.db.project.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Project | null> {
    return this.db.project.findUnique({
      where: { id },
      include: { workspace: true },
    });
  }

  async create(data: {
    workspaceId: string;
    name: string;
    description?: string;
  }): Promise<Project> {
    return this.db.project.create({ data });
  }

  async update(id: string, data: Partial<Pick<Project, 'name' | 'description'>>): Promise<Project> {
    return this.db.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.project.delete({ where: { id } });
  }
}
