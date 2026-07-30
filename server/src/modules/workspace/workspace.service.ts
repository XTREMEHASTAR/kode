import { WorkspaceRepository } from './workspace.repository.js';
import { NotFoundError, ConflictError } from '../../utils/apiError.js';
import type { Workspace } from '@prisma/client';

// ──────────────────────────────────────────────
// Workspace Service
// ──────────────────────────────────────────────

export class WorkspaceService {
  constructor(private readonly workspaceRepo: WorkspaceRepository) {}

  async listAll(): Promise<Workspace[]> {
    return this.workspaceRepo.findAll();
  }

  async getById(id: string): Promise<Workspace> {
    const workspace = await this.workspaceRepo.findById(id);
    if (!workspace) throw new NotFoundError('Workspace not found');
    return workspace;
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
    const existing = await this.workspaceRepo.findBySlug(data.slug);
    if (existing) throw new ConflictError('Workspace with this slug already exists');

    return this.workspaceRepo.create(data);
  }

  async update(
    id: string,
    data: Partial<Omit<Workspace, 'id' | 'createdAt'>>,
  ): Promise<Workspace> {
    await this.getById(id); // Throws if not found
    return this.workspaceRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.workspaceRepo.delete(id);
  }
}
