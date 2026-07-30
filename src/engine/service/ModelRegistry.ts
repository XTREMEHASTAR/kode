export type ModelCategory = 
  | 'SPEECH_TO_TEXT'
  | 'VISION'
  | 'OCR'
  | 'EMBEDDINGS'
  | 'LLM'
  | 'PREDICTION'
  | 'RANKING'
  | 'CALIBRATION';

export type ModelHealthStatus = 'HEALTHY' | 'DEGRADED' | 'OFFLINE';

export interface ModelMetadata {
  id: string;
  name: string;
  category: ModelCategory;
  version: string;
  fallbackModelId?: string;
  status: ModelHealthStatus;
  vramRequirementMb: number;
}

export class ModelRegistry {
  private models: Map<string, ModelMetadata> = new Map();
  private activeCategoryPointers: Map<ModelCategory, string> = new Map();

  constructor() {
    this.bootstrapRegistry();
  }

  public registerModel(model: ModelMetadata): void {
    this.models.set(model.id, model);
    if (!this.activeCategoryPointers.has(model.category)) {
      this.activeCategoryPointers.set(model.category, model.id);
    }
  }

  /**
   * Zero-Downtime Hot Swapping (< 10ms)
   */
  public hotSwapModel(category: ModelCategory, newModelId: string): void {
    if (!this.models.has(newModelId)) {
      throw new Error(`Cannot hot swap model: Model ID ${newModelId} not registered in registry`);
    }
    this.activeCategoryPointers.set(category, newModelId);
  }

  public getActiveModel(category: ModelCategory): ModelMetadata {
    const activeId = this.activeCategoryPointers.get(category);
    if (!activeId || !this.models.has(activeId)) {
      throw new Error(`No active model registered for category: ${category}`);
    }
    return this.models.get(activeId)!;
  }

  public getModel(id: string): ModelMetadata | undefined {
    return this.models.get(id);
  }

  public getAllModels(): ModelMetadata[] {
    return Array.from(this.models.values());
  }

  private bootstrapRegistry(): void {
    const initialModels: ModelMetadata[] = [
      { id: 'stt_whisper_v3', name: 'Whisper-v3 Large', category: 'SPEECH_TO_TEXT', version: '3.0.0', status: 'HEALTHY', vramRequirementMb: 12000 },
      { id: 'vis_clip_vit_l', name: 'CLIP-ViT-L/14', category: 'VISION', version: '1.4.0', status: 'HEALTHY', vramRequirementMb: 8500 },
      { id: 'ocr_trocr_large', name: 'TrOCR Large Stage 1', category: 'OCR', version: '1.1.0', status: 'HEALTHY', vramRequirementMb: 6200 },
      { id: 'emb_multimodal_1024d', name: 'AuraCore 1024D Embedder', category: 'EMBEDDINGS', version: '2.4.0', status: 'HEALTHY', vramRequirementMb: 14000 },
      { id: 'llm_llama3_70b', name: 'Llama-3-70B Instruct', category: 'LLM', version: '3.0.0', fallbackModelId: 'llm_llama3_8b', status: 'HEALTHY', vramRequirementMb: 42000 },
      { id: 'llm_llama3_8b', name: 'Llama-3-8B Fallback', category: 'LLM', version: '3.0.0', status: 'HEALTHY', vramRequirementMb: 16000 },
      { id: 'pred_suite_11', name: 'AuraCore 11-Model Suite', category: 'PREDICTION', version: '3.5.0', status: 'HEALTHY', vramRequirementMb: 18000 },
      { id: 'rank_dcn_v2', name: 'Multi-Task DCN-v2 Ranker', category: 'RANKING', version: '2.1.0', status: 'HEALTHY', vramRequirementMb: 15000 },
      { id: 'calib_temp_scaler', name: 'Temperature Scaler Calibrator', category: 'CALIBRATION', version: '1.2.0', status: 'HEALTHY', vramRequirementMb: 2000 }
    ];

    initialModels.forEach(m => this.registerModel(m));
  }
}
