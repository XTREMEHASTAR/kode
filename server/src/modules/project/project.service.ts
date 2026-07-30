import { ProjectRepository } from './project.repository.js';
import { NotFoundError } from '../../utils/apiError.js';
import type { Project } from '@prisma/client';

// ──────────────────────────────────────────────
// Project Service
// ──────────────────────────────────────────────

export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  async listByWorkspace(workspaceId: string): Promise<Project[]> {
    return this.projectRepo.findByWorkspace(workspaceId);
  }

  async getById(id: string): Promise<Project> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  async create(data: {
    workspaceId: string;
    name: string;
    description?: string;
  }): Promise<Project> {
    return this.projectRepo.create(data);
  }

  async update(id: string, data: { name?: string; description?: string }): Promise<Project> {
    await this.getById(id);
    return this.projectRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.projectRepo.delete(id);
  }
}
