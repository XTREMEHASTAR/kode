import { ModelDiscoveryEngine, ModelCategory, DiscoveredModelMetadata } from './ModelDiscoveryEngine';
import { HealthCheckMonitor } from './HealthCheckMonitor';
import { GpuMemoryMonitor } from './GpuMemoryMonitor';

export interface InferenceRequestPayload {
  modelCategory: ModelCategory;
  payload: any;
  allowFallback?: boolean;
}

export interface RegistryInferenceResponse {
  modelId: string;
  modelVersion: string;
  category: ModelCategory;
  allocatedGpu: string;
  output: any;
  latencyMs: number;
  usedFallback: boolean;
}

export interface PerformanceTelemetryLog {
  timestamp: number;
  modelId: string;
  gpuId: string;
  latencyMs: number;
  status: 'SUCCESS' | 'FALLBACK_USED';
}

/**
 * AuraCore Centralized Local Model Registry Gateway
 * No engine loads models directly; all inference calls pass through this single API.
 */
export class LocalModelRegistry {
  private discovery: ModelDiscoveryEngine;
  private healthMonitor: HealthCheckMonitor;
  private memoryMonitor: GpuMemoryMonitor;
  private registeredModels: Map<string, DiscoveredModelMetadata> = new Map();
  private activeCategoryPointers: Map<ModelCategory, string> = new Map();
  private telemetryLogs: PerformanceTelemetryLog[] = [];

  constructor() {
    this.discovery = new ModelDiscoveryEngine();
    this.healthMonitor = new HealthCheckMonitor();
    this.memoryMonitor = new GpuMemoryMonitor();
    this.initializeRegistry();
  }

  /**
   * Single Centralized Inference Gateway API
   */
  public async infer(req: InferenceRequestPayload): Promise<RegistryInferenceResponse> {
    const startTime = performance.now();
    let activeId = this.activeCategoryPointers.get(req.modelCategory);
    if (!activeId || !this.registeredModels.has(activeId)) {
      throw new Error(`No active model registered for category ${req.modelCategory}`);
    }

    let model = this.registeredModels.get(activeId)!;
    let usedFallback = false;

    // Check health status
    const health = this.healthMonitor.getHealth(model.id);
    if (health && health.status !== 'HEALTHY' && req.allowFallback && model.fallbackModelId) {
      const fallback = this.registeredModels.get(model.fallbackModelId);
      if (fallback) {
        model = fallback;
        usedFallback = true;
      }
    }

    // Allocate GPU node via load balancer
    const allocatedGpuNode = this.memoryMonitor.allocateLeastLoadedGpu();

    // Execute simulated model inference
    const output = this.executeModelInference(model, req.payload);
    const latencyMs = Number((performance.now() - startTime).toFixed(2));

    this.healthMonitor.recordSuccess(model.id);

    // Record performance telemetry
    this.telemetryLogs.push({
      timestamp: Date.now(),
      modelId: model.id,
      gpuId: allocatedGpuNode.gpuId,
      latencyMs,
      status: usedFallback ? 'FALLBACK_USED' : 'SUCCESS'
    });

    return {
      modelId: model.id,
      modelVersion: model.version,
      category: req.modelCategory,
      allocatedGpu: allocatedGpuNode.gpuId,
      output,
      latencyMs,
      usedFallback
    };
  }

  /**
   * Zero-Downtime Hot Swapping (< 10ms)
   */
  public hotSwap(category: ModelCategory, newModelId: string): number {
    const start = performance.now();
    if (!this.registeredModels.has(newModelId)) {
      throw new Error(`Cannot hot swap: Model ${newModelId} not present in registry`);
    }
    this.activeCategoryPointers.set(category, newModelId);
    return Number((performance.now() - start).toFixed(2));
  }

  public getHealthCheckMonitor(): HealthCheckMonitor {
    return this.healthMonitor;
  }

  public getGpuMemoryMonitor(): GpuMemoryMonitor {
    return this.memoryMonitor;
  }

  public getTelemetryLogs(): PerformanceTelemetryLog[] {
    return [...this.telemetryLogs];
  }

  private initializeRegistry(): void {
    const discovered = this.discovery.scanLocalModels();
    discovered.forEach(m => {
      this.registeredModels.set(m.id, m);
      this.healthMonitor.registerModel(m.id);
      if (!this.activeCategoryPointers.has(m.category)) {
        this.activeCategoryPointers.set(m.category, m.id);
      }
    });
  }

  private executeModelInference(model: DiscoveredModelMetadata, payload: any): any {
    switch (model.category) {
      case 'EMBEDDINGS':
        return new Array(1024).fill(0).map((_, i) => Number(Math.sin(i * 0.1).toFixed(4)));
      case 'SPEECH_TO_TEXT':
        return { transcript: 'Sample speech transcript', confidence: 0.98 };
      case 'VISION':
        return { visualScore: 0.92, composition: 0.88 };
      case 'PREDICTION':
        return { predictedViews: 45200, viralityScore: 88 };
      default:
        return { status: 'SUCCESS', modelId: model.id, payload };
    }
  }
}
