import { getPrisma } from '../../config/database.js';
import type { Video, Prisma } from '@prisma/client';

// ──────────────────────────────────────────────
// Video Repository
// ──────────────────────────────────────────────

export class VideoRepository {
  private get db() {
    return getPrisma();
  }

  async findByProject(projectId: string): Promise<Video[]> {
    return this.db.video.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Video | null> {
    return this.db.video.findUnique({ where: { id } });
  }

  async create(data: Prisma.VideoUncheckedCreateInput): Promise<Video> {
    return this.db.video.create({ data });
  }

  async update(id: string, data: Prisma.VideoUpdateInput): Promise<Video> {
    return this.db.video.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: Video['status'], errorMessage?: string): Promise<Video> {
    return this.db.video.update({
      where: { id },
      data: { status, errorMessage },
    });
  }

  async updateAnalysis(
    id: string,
    analysis: {
      score?: number;
      transcript?: string;
      caption?: string;
      tags?: string[];
      hookScore?: number;
      hookAnalysis?: string;
      visualScore?: number;
      visualAnalysis?: string;
      audioScore?: number;
      audioAnalysis?: string;
      retentionProfile?: Prisma.InputJsonValue;
      thumbnailSuggestions?: Prisma.InputJsonValue;
    },
  ): Promise<Video> {
    return this.db.video.update({ where: { id }, data: analysis });
  }

  async delete(id: string): Promise<void> {
    await this.db.video.delete({ where: { id } });
  }
}
