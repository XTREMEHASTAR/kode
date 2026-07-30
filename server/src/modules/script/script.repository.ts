import { getPrisma } from '../../config/database.js';
import type { ScriptAnalysis, Prisma } from '@prisma/client';

// ──────────────────────────────────────────────
// Script Repository
// ──────────────────────────────────────────────

interface ListOptions {
  userId: string;
  page: number;
  pageSize: number;
  favorite?: boolean;
  sort: string;
  order: 'asc' | 'desc';
}

export class ScriptRepository {
  private get db() {
    return getPrisma();
  }

  async findByUser(options: ListOptions): Promise<{ scripts: ScriptAnalysis[]; total: number }> {
    const { userId, page, pageSize, favorite, sort, order } = options;

    const safePage = page && !isNaN(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const safePageSize = pageSize && !isNaN(Number(pageSize)) && Number(pageSize) > 0 ? Number(pageSize) : 50;
    const safeSort = sort && sort !== 'undefined' ? sort : 'createdAt';
    const safeOrder = order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.ScriptAnalysisWhereInput = { userId };
    if (favorite !== undefined) {
      where.isFavorite = favorite;
    }

    const [scripts, total] = await Promise.all([
      this.db.scriptAnalysis.findMany({
        where,
        orderBy: { [safeSort]: safeOrder },
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
      }),
      this.db.scriptAnalysis.count({ where }),
    ]);

    return { scripts, total };
  }

  async findById(id: string): Promise<ScriptAnalysis | null> {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(id)) {
      return null;
    }
    try {
      return await this.db.scriptAnalysis.findUnique({
        where: { id },
        include: {
          versions: { orderBy: { createdAt: 'desc' } },
        },
      });
    } catch {
      return null;
    }
  }

  async create(data: {
    id: string;
    userId: string;
    title: string;
    scriptText: string;
    originalScriptText?: string;
    contentType?: string;
    hookScore?: number;
    wordCount?: number;
    characterCount?: number;
    estimatedSpeakingTime?: number;
    hookText?: string;
    signals?: Prisma.InputJsonValue;
    analysisResult: Prisma.InputJsonValue;
  }): Promise<ScriptAnalysis> {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const finalId = UUID_REGEX.test(data.id) ? data.id : undefined;
    const createData = finalId ? { ...data, id: finalId } : { ...data, id: undefined };
    return this.db.scriptAnalysis.create({ data: createData as any });
  }

  async update(
    id: string,
    data: Prisma.ScriptAnalysisUpdateInput,
  ): Promise<ScriptAnalysis> {
    return this.db.scriptAnalysis.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.db.scriptAnalysis.delete({ where: { id } });
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<ScriptAnalysis> {
    return this.db.scriptAnalysis.update({
      where: { id },
      data: { isFavorite },
    });
  }
}
