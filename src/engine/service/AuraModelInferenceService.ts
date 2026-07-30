import { ModelRegistry, ModelCategory, ModelMetadata } from './ModelRegistry';
import { InferenceCache } from './InferenceCache';
import { GpuScheduler, GpuNode } from './GpuScheduler';

export interface InferenceRequest {
  modelCategory: ModelCategory;
  payload: any;
  fallbackAllowed?: boolean;
}

export interface InferenceResponse {
  modelId: string;
  modelVersion: string;
  category: ModelCategory;
  allocatedGpuId: string;
  output: any;
  latencyMs: number;
  cached: boolean;
  usedFallback: boolean;
}

export interface InferenceAuditLog {
  timestamp: number;
  requestCategory: ModelCategory;
  modelId: string;
  gpuId: string;
  latencyMs: number;
  status: 'SUCCESS' | 'FALLBACK_USED' | 'FAILED';
}

/**
 * AuraCore Central Production Inference Service Gateway
 */
export class AuraModelInferenceService {
  private registry: ModelRegistry;
  private cache: InferenceCache;
  private scheduler: GpuScheduler;
  private auditLogs: InferenceAuditLog[] = [];

  constructor() {
    this.registry = new ModelRegistry();
    this.cache = new InferenceCache(1000);
    this.scheduler = new GpuScheduler();
  }

  /**
   * Unified Production Inference Gateway
   */
  public async runInference(request: InferenceRequest): Promise<InferenceResponse> {
    const start = performance.now();
    const cacheKey = `${request.modelCategory}_${JSON.stringify(request.payload)}`;

    // 1. Check LRU Response Cache
    const cachedOutput = this.cache.get(cacheKey);
    if (cachedOutput) {
      return {
        modelId: 'cached',
        modelVersion: 'cached',
        category: request.modelCategory,
        allocatedGpuId: 'gpu-cache',
        output: cachedOutput,
        latencyMs: Number((performance.now() - start).toFixed(2)),
        cached: true,
        usedFallback: false
      };
    }

    // 2. Resolve Active Model & GPU Allocation
    let model = this.registry.getActiveModel(request.modelCategory);
    const allocatedNode = this.scheduler.allocateNode();
    let usedFallback = false;

    // 3. Fallback Degradation check
    if (model.status !== 'HEALTHY' && request.fallbackAllowed && model.fallbackModelId) {
      const fallback = this.registry.getModel(model.fallbackModelId);
      if (fallback) {
        model = fallback;
        usedFallback = true;
      }
    }

    // 4. Perform Simulated Inference Execution
    const output = this.executeInference(model, request.payload);
    const latencyMs = Number((performance.now() - start).toFixed(2));

    // 5. Store in Cache
    this.cache.set(cacheKey, output);

    // 6. Record Audit Log
    this.auditLogs.push({
      timestamp: Date.now(),
      requestCategory: request.modelCategory,
      modelId: model.id,
      gpuId: allocatedNode.gpuId,
      latencyMs,
      status: usedFallback ? 'FALLBACK_USED' : 'SUCCESS'
    });

    return {
      modelId: model.id,
      modelVersion: model.version,
      category: request.modelCategory,
      allocatedGpuId: allocatedNode.gpuId,
      output,
      latencyMs,
      cached: false,
      usedFallback
    };
  }

  public getModelRegistry(): ModelRegistry {
    return this.registry;
  }

  public getGpuScheduler(): GpuScheduler {
    return this.scheduler;
  }

  public getAuditLogs(): InferenceAuditLog[] {
    return [...this.auditLogs];
  }

  private executeInference(model: ModelMetadata, payload: any): any {
    switch (model.category) {
      case 'EMBEDDINGS':
        return new Array(1024).fill(0).map((_, i) => Number(Math.sin(i * 0.1).toFixed(4)));
      case 'SPEECH_TO_TEXT':
        return { text: 'Transcribed speech text payload', confidence: 0.98 };
      case 'VISION':
        return { visualQualityScore: 0.88, compositionScore: 0.92 };
      case 'PREDICTION':
        return { views: 45200, shares: 1250, likes: 3800 };
      default:
        return { status: 'SUCCESS', result: payload };
    }
  }
}
