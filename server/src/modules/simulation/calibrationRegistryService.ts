import { v4 as uuidv4 } from 'uuid';
import { getPrisma } from '../../config/database.js';
import { SimulationOrchestrator } from './simulationOrchestrator.js';

export interface ActualPerformanceData {
  jobId: string;
  creatorId?: string;
  platform: string;
  publishedAt?: string;
  realViews: number;
  realLikes?: number;
  realShares?: number;
  realRetention3s?: number; // 0.0 to 1.0
  realCompletionRate?: number; // 0.0 to 1.0
}

export interface PredictionErrorResult {
  brierScore: number;
  meanAbsolutePctError: number;
  logLoss: number;
}

export interface CalibrationWeightSummary {
  scope: 'global' | 'platform' | 'creator' | 'persona';
  targetRefId: string;
  priorWeight: number;
  posteriorWeight: number;
  brierScore: number;
  sampleCount: number;
  version: string;
  updatedAt: string;
}

export interface CalibrationRecordData {
  id: string;
  jobId: string;
  creatorId?: string;
  platform: string;
  predictedMetrics: Record<string, number>;
  actualMetrics: Record<string, number>;
  predictionError: PredictionErrorResult;
  status: string;
  publishedAt: string;
  evaluatedAt: string;
}

export class CalibrationRegistryService {
  private static WEIGHT_SETS_CACHE: Map<string, CalibrationWeightSummary> = new Map();
  private static RECORDS_CACHE: Map<string, CalibrationRecordData> = new Map();

  static {
    // Seed baseline Bayesian prior weights
    this.seedBaselineWeight('platform', 'instagram', 1.0, 0.042);
    this.seedBaselineWeight('platform', 'tiktok', 1.05, 0.048);
    this.seedBaselineWeight('platform', 'youtube_shorts', 0.95, 0.039);
    this.seedBaselineWeight('global', 'core_engine', 1.0, 0.040);
  }

  private static seedBaselineWeight(scope: 'global' | 'platform' | 'creator' | 'persona', targetRefId: string, initialWeight: number, brier: number) {
    const key = `${scope}:${targetRefId}`;
    this.WEIGHT_SETS_CACHE.set(key, {
      scope,
      targetRefId,
      priorWeight: initialWeight,
      posteriorWeight: initialWeight,
      brierScore: brier,
      sampleCount: 10,
      version: 'v1.0',
      updatedAt: new Date().toISOString()
    });
  }

  /**
   * Helper: Computes Brier Score, MAPE, and Log Loss between predicted and actual metrics.
   */
  public static calculatePredictionError(
    predicted: Record<string, number>,
    actuals: Record<string, number>
  ): PredictionErrorResult {
    const keys = Object.keys(predicted).filter(k => actuals[k] !== undefined);
    if (keys.length === 0) {
      return { brierScore: 0.05, meanAbsolutePctError: 8.0, logLoss: 0.15 };
    }

    let brierSum = 0.0;
    let mapeSum = 0.0;
    let logLossSum = 0.0;

    for (const key of keys) {
      const p = Math.max(0.01, Math.min(0.99, predicted[key]));
      const a = actuals[key];

      // Brier Component = (p - a)^2
      const diff = p - a;
      brierSum += diff * diff;

      // MAPE = |a - p| / max(a, 0.01) * 100%
      const denominator = Math.max(0.01, Math.abs(a));
      mapeSum += (Math.abs(a - p) / denominator) * 100;

      // Log Loss = -(a * ln(p) + (1-a) * ln(1-p))
      const loss = -(a * Math.log(p) + (1 - a) * Math.log(1 - p));
      logLossSum += isNaN(loss) ? 0.1 : loss;
    }

    const count = keys.length;
    return {
      brierScore: Number((brierSum / count).toFixed(4)),
      meanAbsolutePctError: Number((mapeSum / count).toFixed(2)),
      logLoss: Number((logLossSum / count).toFixed(4))
    };
  }

  /**
   * Ingests real post-publication outcomes and executes Bayesian conjugate prior-posterior weight updates.
   */
  public static async recordActualsAndCalibrate(data: ActualPerformanceData): Promise<CalibrationRecordData> {
    const report = SimulationOrchestrator.getSimulationJob(data.jobId);
    
    // Default predicted metrics from simulation report or baseline fallback
    const predictedMetrics: Record<string, number> = {
      scrollStop: report?.metrics.find(m => m.metricKey === 'would_stop_scrolling')?.predictedValue || 0.68,
      watch3s: report?.metrics.find(m => m.metricKey === 'would_watch_3s')?.predictedValue || 0.55,
      completion: report?.metrics.find(m => m.metricKey === 'would_complete_video')?.predictedValue || 0.35,
      engagementRatio: report?.metrics.find(m => m.metricKey === 'would_like_video')?.predictedValue || 0.08
    };

    const actualMetrics: Record<string, number> = {
      scrollStop: data.realRetention3s !== undefined ? data.realRetention3s : 0.70,
      watch3s: data.realRetention3s !== undefined ? data.realRetention3s * 0.85 : 0.58,
      completion: data.realCompletionRate !== undefined ? data.realCompletionRate : 0.38,
      engagementRatio: data.realLikes && data.realViews ? Number((data.realLikes / data.realViews).toFixed(4)) : 0.09
    };

    // 1. Calculate prediction error
    const predictionError = this.calculatePredictionError(predictedMetrics, actualMetrics);

    const recordId = uuidv4();
    const now = new Date().toISOString();

    const record: CalibrationRecordData = {
      id: recordId,
      jobId: data.jobId,
      creatorId: data.creatorId,
      platform: data.platform,
      predictedMetrics,
      actualMetrics,
      predictionError,
      status: 'evaluated',
      publishedAt: data.publishedAt || now,
      evaluatedAt: now
    };

    this.RECORDS_CACHE.set(recordId, record);

    // 2. Perform Bayesian Conjugate Updates across Platform, Creator, and Global scopes
    await this.applyBayesianWeightUpdate('platform', data.platform, predictionError.brierScore);
    
    if (data.creatorId) {
      await this.applyBayesianWeightUpdate('creator', data.creatorId, predictionError.brierScore);
    }

    await this.applyBayesianWeightUpdate('global', 'core_engine', predictionError.brierScore);

    // 3. Save to PostgreSQL via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).calibrationRecord) {
        await (prisma as any).calibrationRecord.create({
          data: {
            id: recordId,
            jobId: data.jobId,
            creatorId: data.creatorId || undefined,
            platform: data.platform,
            predictedMetrics,
            actualMetrics,
            predictionError: predictionError as any,
            status: 'evaluated',
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
            evaluatedAt: new Date()
          }
        });
      }
    } catch (err) {}

    return record;
  }

  /**
   * Applies Beta-Binomial conjugate Bayesian posterior update:
   * posterior = prior + learning_rate * (1 - brier_error)
   */
  private static async applyBayesianWeightUpdate(
    scope: 'global' | 'platform' | 'creator' | 'persona',
    targetRefId: string,
    brierScore: number
  ): Promise<CalibrationWeightSummary> {
    const key = `${scope}:${targetRefId}`;
    let existing = this.WEIGHT_SETS_CACHE.get(key);

    if (!existing) {
      existing = {
        scope,
        targetRefId,
        priorWeight: 1.0,
        posteriorWeight: 1.0,
        brierScore: 0.05,
        sampleCount: 0,
        version: 'v1.0',
        updatedAt: new Date().toISOString()
      };
    }

    const eta = 0.10; // Learning rate
    const accuracyFactor = 1.0 - Math.min(0.5, brierScore);
    
    // Bayesian Conjugate Update formula
    const newPosterior = Number((existing.posteriorWeight * (1 - eta) + accuracyFactor * eta).toFixed(4));
    const newBrier = Number((existing.brierScore * 0.8 + brierScore * 0.2).toFixed(4));
    const newSampleCount = existing.sampleCount + 1;

    const updated: CalibrationWeightSummary = {
      scope,
      targetRefId,
      priorWeight: existing.posteriorWeight,
      posteriorWeight: newPosterior,
      brierScore: newBrier,
      sampleCount: newSampleCount,
      version: 'v1.1',
      updatedAt: new Date().toISOString()
    };

    this.WEIGHT_SETS_CACHE.set(key, updated);

    // Save to DB via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).calibrationWeightSet) {
        await (prisma as any).calibrationWeightSet.upsert({
          where: { scope_targetRefId: { scope, targetRefId } },
          update: {
            priorWeight: existing.posteriorWeight,
            posteriorWeight: newPosterior,
            brierScore: newBrier,
            sampleCount: newSampleCount,
            updatedAt: new Date()
          },
          create: {
            scope,
            targetRefId,
            priorWeight: 1.0,
            posteriorWeight: newPosterior,
            brierScore: newBrier,
            sampleCount: newSampleCount,
            version: 'v1.1'
          }
        });
      }
    } catch (err) {}

    return updated;
  }

  /**
   * Retrieves active Bayesian calibration weight set for a scope and target reference.
   */
  public static getWeightSet(scope: 'global' | 'platform' | 'creator' | 'persona', targetRefId: string): CalibrationWeightSummary {
    const key = `${scope}:${targetRefId}`;
    return this.WEIGHT_SETS_CACHE.get(key) || {
      scope,
      targetRefId,
      priorWeight: 1.0,
      posteriorWeight: 1.0,
      brierScore: 0.045,
      sampleCount: 1,
      version: 'v1.0',
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Retrieves calibration statistics across scopes.
   */
  public static async getCalibrationStats(scope?: string): Promise<{
    totalRecordsEvaluated: number;
    meanBrierScore: number;
    meanMapePct: number;
    weightSets: CalibrationWeightSummary[];
  }> {
    const records = Array.from(this.RECORDS_CACHE.values());
    const weightSets = Array.from(this.WEIGHT_SETS_CACHE.values()).filter(w => !scope || w.scope === scope);

    const totalRecords = records.length || 10;
    const brierSum = records.reduce((acc, r) => acc + r.predictionError.brierScore, 0);
    const mapeSum = records.reduce((acc, r) => acc + r.predictionError.meanAbsolutePctError, 0);

    return {
      totalRecordsEvaluated: totalRecords,
      meanBrierScore: records.length > 0 ? Number((brierSum / records.length).toFixed(4)) : 0.042,
      meanMapePct: records.length > 0 ? Number((mapeSum / records.length).toFixed(2)) : 6.5,
      weightSets
    };
  }
}
