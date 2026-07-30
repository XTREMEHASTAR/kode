import { VideoRepository } from './video.repository.js';
import { NotFoundError } from '../../utils/apiError.js';
import type { Video, VideoStatus, Prisma } from '@prisma/client';

// ──────────────────────────────────────────────
// Video Service
// ──────────────────────────────────────────────

export class VideoService {
  constructor(private readonly videoRepo: VideoRepository) {}

  async listByProject(projectId: string): Promise<Video[]> {
    return this.videoRepo.findByProject(projectId);
  }

  async getById(id: string): Promise<Video> {
    const video = await this.videoRepo.findById(id);
    if (!video) throw new NotFoundError('Video not found');
    return video;
  }

  async create(data: {
    projectId: string;
    title: string;
    filename: string;
    storagePath?: string;
  }): Promise<Video> {
    return this.videoRepo.create(data);
  }

  async updateStatus(
    id: string,
    status: VideoStatus,
    errorMessage?: string,
  ): Promise<Video> {
    await this.getById(id);
    return this.videoRepo.updateStatus(id, status, errorMessage);
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
    await this.getById(id);
    return this.videoRepo.updateAnalysis(id, analysis);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.videoRepo.delete(id);
  }
}
