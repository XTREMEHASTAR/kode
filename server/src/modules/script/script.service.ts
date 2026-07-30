import { v4 as uuidv4 } from 'uuid';
import { ScriptRepository } from './script.repository.js';
import { NotFoundError, ForbiddenError } from '../../utils/apiError.js';
import type { ScriptAnalysis } from '@prisma/client';
import type { PaginatedResponse } from '../../types/index.js';
import type { ListScriptsQuery, CreateScriptInput, UpdateScriptInput } from './script.validation.js';

// ──────────────────────────────────────────────
// Script Service
// ──────────────────────────────────────────────

export class ScriptService {
  constructor(private readonly scriptRepo: ScriptRepository) {}

  async list(
    userId: string,
    query: ListScriptsQuery,
  ): Promise<PaginatedResponse<ScriptAnalysis>> {
    const favorite = query.favorite === 'true' ? true : query.favorite === 'false' ? false : undefined;

    const { scripts, total } = await this.scriptRepo.findByUser({
      userId,
      page: query.page,
      pageSize: query.pageSize,
      favorite,
      sort: query.sort,
      order: query.order,
    });

    return {
      data: scripts,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  async getById(id: string, userId: string): Promise<ScriptAnalysis> {
    const script = await this.scriptRepo.findById(id);
    if (!script) throw new NotFoundError('Script analysis not found');

    // Ownership check
    if (script.userId !== userId) {
      throw new ForbiddenError('You do not have access to this script');
    }

    return script;
  }

  async create(
    userId: string,
    data: CreateScriptInput,
  ): Promise<ScriptAnalysis> {
    const id = data.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id) ? data.id : uuidv4();
    const wordCount = data.wordCount ?? data.scriptText.split(/\s+/).filter(Boolean).length;
    const characterCount = data.characterCount ?? data.scriptText.length;
    const estimatedSpeakingTime = data.estimatedSpeakingTime ?? Math.ceil((wordCount / 150) * 60);
    const hookScore = data.hookScore ?? (data.analysisResult?.hookScore || 0);

    return this.scriptRepo.create({
      id,
      userId,
      title: data.title,
      scriptText: data.scriptText,
      originalScriptText: data.scriptText,
      contentType: data.contentType,
      hookScore,
      wordCount,
      characterCount,
      estimatedSpeakingTime,
      hookText: data.hookText || '',
      signals: data.signals || [],
      analysisResult: data.analysisResult || {},
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateScriptInput,
  ): Promise<ScriptAnalysis> {
    await this.getById(id, userId); // Ownership + existence check

    const updateData: Record<string, unknown> = { ...data };

    // Recalculate metrics if script text changed
    if (data.scriptText) {
      const wordCount = data.wordCount ?? data.scriptText.split(/\s+/).filter(Boolean).length;
      updateData.wordCount = wordCount;
      updateData.characterCount = data.characterCount ?? data.scriptText.length;
      updateData.estimatedSpeakingTime = data.estimatedSpeakingTime ?? Math.ceil((wordCount / 150) * 60);
    }

    if (data.analysisResult && data.hookScore === undefined) {
      updateData.hookScore = (data.analysisResult as any).hookScore || 0;
    }

    return this.scriptRepo.update(id, updateData);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.getById(id, userId);
    await this.scriptRepo.delete(id);
  }
}
