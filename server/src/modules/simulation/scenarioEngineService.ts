import { v4 as uuidv4 } from 'uuid';
import { getPrisma } from '../../config/database.js';

export interface ScenarioDeltaPayload {
  scoreDelta: number;
  scrollStopDelta: number;
  viewDelta: number;
  completionDelta: number;
}

export interface ScenarioVariantData {
  id: string;
  sessionId: string;
  variantName: string;
  modifications: Record<string, any>;
  overallScore: number;
  metrics: {
    scrollStop: number;
    watch3s: number;
    completion: number;
    estimatedViews: number;
  };
  retentionCurve: Array<{ second: number; percentage: number }>;
  deltaFromBaseline: ScenarioDeltaPayload;
  whyOutperforms: string;
  isBestVersion: boolean;
  createdAt: string;
}

export interface ScenarioSessionData {
  id: string;
  sessionName: string;
  creatorId?: string;
  baseContentRefId: string;
  bestVariantId?: string;
  variants: ScenarioVariantData[];
  createdAt: string;
  updatedAt: string;
}

export class ScenarioEngineService {
  private static SESSIONS_CACHE: Map<string, ScenarioSessionData> = new Map();

  /**
   * Initializes a new counterfactual scenario comparison session with a baseline variant.
   */
  public static async createComparisonSession(input: {
    sessionName: string;
    creatorId?: string;
    baseContentRefId: string;
    baselineName?: string;
    baselineScores?: Partial<ScenarioVariantData['metrics']>;
  }): Promise<ScenarioSessionData> {
    const sessionId = uuidv4();
    const now = new Date().toISOString();

    const baselineVariantId = uuidv4();
    const baselineMetrics = {
      scrollStop: input.baselineScores?.scrollStop ?? 0.65,
      watch3s: input.baselineScores?.watch3s ?? 0.52,
      completion: input.baselineScores?.completion ?? 0.32,
      estimatedViews: input.baselineScores?.estimatedViews ?? 45000
    };

    const baselineRetentionCurve = [
      { second: 0, percentage: 100 },
      { second: 3, percentage: Math.round(baselineMetrics.scrollStop * 100) },
      { second: 8, percentage: Math.round(baselineMetrics.watch3s * 100) },
      { second: 15, percentage: Math.round(baselineMetrics.watch3s * 82) },
      { second: 30, percentage: Math.round(baselineMetrics.completion * 100) }
    ];

    const baselineVariant: ScenarioVariantData = {
      id: baselineVariantId,
      sessionId,
      variantName: input.baselineName || 'Baseline (Original Cut)',
      modifications: { type: 'baseline' },
      overallScore: 68.0,
      metrics: baselineMetrics,
      retentionCurve: baselineRetentionCurve,
      deltaFromBaseline: { scoreDelta: 0, scrollStopDelta: 0, viewDelta: 0, completionDelta: 0 },
      whyOutperforms: 'Original baseline video content.',
      isBestVersion: true,
      createdAt: now
    };

    const session: ScenarioSessionData = {
      id: sessionId,
      sessionName: input.sessionName,
      creatorId: input.creatorId,
      baseContentRefId: input.baseContentRefId,
      bestVariantId: baselineVariantId,
      variants: [baselineVariant],
      createdAt: now,
      updatedAt: now
    };

    this.SESSIONS_CACHE.set(sessionId, session);

    // Save to PostgreSQL via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).scenarioComparisonSession) {
        await (prisma as any).scenarioComparisonSession.create({
          data: {
            id: sessionId,
            sessionName: input.sessionName,
            creatorId: input.creatorId || undefined,
            baseContentRefId: input.baseContentRefId,
            bestVariantId: baselineVariantId,
            variants: {
              create: {
                id: baselineVariantId,
                variantName: baselineVariant.variantName,
                modifications: baselineVariant.modifications,
                overallScore: baselineVariant.overallScore,
                metrics: baselineVariant.metrics as any,
                retentionCurve: baselineVariant.retentionCurve as any,
                deltaFromBaseline: baselineVariant.deltaFromBaseline as any,
                whyOutperforms: baselineVariant.whyOutperforms,
                isBestVersion: true
              }
            }
          }
        });
      }
    } catch (err) {}

    return session;
  }

  /**
   * Adds a new counterfactual scenario variant (e.g. "Scenario A: Better Hook") and computes deltas relative to baseline.
   */
  public static async addScenarioVariant(input: {
    sessionId: string;
    variantName: string;
    modifications: Record<string, any>;
    overrideScores?: {
      overallScore?: number;
      scrollStop?: number;
      watch3s?: number;
      completion?: number;
      estimatedViews?: number;
    };
  }): Promise<ScenarioVariantData> {
    const session = this.SESSIONS_CACHE.get(input.sessionId);
    if (!session) {
      throw new Error(`Scenario session ${input.sessionId} not found`);
    }

    const baseline = session.variants.find(v => v.deltaFromBaseline.scoreDelta === 0) || session.variants[0];

    const overallScore = input.overrideScores?.overallScore ?? 82.0;
    const metrics = {
      scrollStop: input.overrideScores?.scrollStop ?? 0.82,
      watch3s: input.overrideScores?.watch3s ?? 0.70,
      completion: input.overrideScores?.completion ?? 0.44,
      estimatedViews: input.overrideScores?.estimatedViews ?? 82000
    };

    const deltaFromBaseline: ScenarioDeltaPayload = {
      scoreDelta: Number((overallScore - baseline.overallScore).toFixed(1)),
      scrollStopDelta: Number((metrics.scrollStop - baseline.metrics.scrollStop).toFixed(2)),
      viewDelta: metrics.estimatedViews - baseline.metrics.estimatedViews,
      completionDelta: Number((metrics.completion - baseline.metrics.completion).toFixed(2))
    };

    let whyOutperforms = `Higher overall virality score (+${deltaFromBaseline.scoreDelta} pts). `;
    if (input.variantName.toLowerCase().includes('hook')) {
      whyOutperforms += 'Dynamic kinetic text overlays & curiosity question in first 2s boost 3s retention by +' + Math.round(deltaFromBaseline.scrollStopDelta * 100) + '%.';
    } else if (input.variantName.toLowerCase().includes('thumbnail')) {
      whyOutperforms += 'High contrast facial emotion thumbnail increases initial organic CTR by +' + Math.round(deltaFromBaseline.scrollStopDelta * 80) + '%.';
    } else {
      whyOutperforms += 'Explicit verbal and visual CTA prompt increases completion & share saves by +' + Math.round(deltaFromBaseline.completionDelta * 100) + '%.';
    }

    const variantId = uuidv4();
    const now = new Date().toISOString();

    const retentionCurve = [
      { second: 0, percentage: 100 },
      { second: 3, percentage: Math.round(metrics.scrollStop * 100) },
      { second: 8, percentage: Math.round(metrics.watch3s * 100) },
      { second: 15, percentage: Math.round(metrics.watch3s * 86) },
      { second: 30, percentage: Math.round(metrics.completion * 100) }
    ];

    const variant: ScenarioVariantData = {
      id: variantId,
      sessionId: input.sessionId,
      variantName: input.variantName,
      modifications: input.modifications,
      overallScore,
      metrics,
      retentionCurve,
      deltaFromBaseline,
      whyOutperforms,
      isBestVersion: false,
      createdAt: now
    };

    session.variants.push(variant);
    session.updatedAt = now;

    // Save to DB via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).scenarioVariant) {
        await (prisma as any).scenarioVariant.create({
          data: {
            id: variantId,
            sessionId: input.sessionId,
            variantName: variant.variantName,
            modifications: variant.modifications,
            overallScore: variant.overallScore,
            metrics: variant.metrics as any,
            retentionCurve: variant.retentionCurve as any,
            deltaFromBaseline: variant.deltaFromBaseline as any,
            whyOutperforms: variant.whyOutperforms,
            isBestVersion: false
          }
        });
      }
    } catch (err) {}

    // Recalculate best version winner
    await this.compareScenarios(input.sessionId);

    return variant;
  }

  /**
   * Evaluates all variants in a session, flags the best version winner, and updates rankings.
   */
  public static async compareScenarios(sessionId: string): Promise<ScenarioSessionData> {
    const session = this.SESSIONS_CACHE.get(sessionId);
    if (!session || session.variants.length === 0) {
      throw new Error(`Scenario session ${sessionId} not found or empty`);
    }

    // Sort descending by overallScore
    session.variants.sort((a, b) => b.overallScore - a.overallScore);

    const winningVariant = session.variants[0];
    session.bestVariantId = winningVariant.id;

    session.variants.forEach(v => {
      v.isBestVersion = v.id === winningVariant.id;
    });

    session.updatedAt = new Date().toISOString();

    // Update DB bestVariantId via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).scenarioComparisonSession) {
        await (prisma as any).scenarioComparisonSession.update({
          where: { id: sessionId },
          data: { bestVariantId: winningVariant.id }
        });
      }
    } catch (err) {}

    return session;
  }

  /**
   * Retrieves full scenario comparison session.
   */
  public static getComparisonSession(sessionId: string): ScenarioSessionData | null {
    return this.SESSIONS_CACHE.get(sessionId) || null;
  }
}
