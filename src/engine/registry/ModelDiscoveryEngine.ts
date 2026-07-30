export type ModelCategory = 
  | 'SPEECH_TO_TEXT'
  | 'VISION'
  | 'OCR'
  | 'EMBEDDINGS'
  | 'LLM'
  | 'PREDICTION'
  | 'RANKING'
  | 'CALIBRATION';

export interface DiscoveredModelMetadata {
  id: string;
  name: string;
  category: ModelCategory;
  version: string;
  weightsPath: string;
  fallbackModelId?: string;
  vramRequirementMb: number;
}

export class ModelDiscoveryEngine {
  public scanLocalModels(): DiscoveredModelMetadata[] {
    return [
      { id: 'stt_whisper_v3', name: 'Whisper-v3 Large', category: 'SPEECH_TO_TEXT', version: '3.0.0', weightsPath: '/models/stt/whisper_v3.pt', vramRequirementMb: 12000 },
      { id: 'vis_clip_vit_l', name: 'CLIP-ViT-L/14', category: 'VISION', version: '1.4.0', weightsPath: '/models/vision/clip_vit_l.pt', vramRequirementMb: 8500 },
      { id: 'ocr_trocr_large', name: 'TrOCR Large Stage 1', category: 'OCR', version: '1.1.0', weightsPath: '/models/ocr/trocr_large.pt', vramRequirementMb: 6200 },
      { id: 'emb_multimodal_1024d', name: 'AuraCore 1024D Embedder', category: 'EMBEDDINGS', version: '2.4.0', weightsPath: '/models/embeddings/dna_1024d.pt', vramRequirementMb: 14000 },
      { id: 'llm_llama3_70b', name: 'Llama-3-70B Instruct', category: 'LLM', version: '3.0.0', weightsPath: '/models/llm/llama3_70b.gguf', fallbackModelId: 'llm_llama3_8b', vramRequirementMb: 42000 },
      { id: 'llm_llama3_8b', name: 'Llama-3-8B Fallback', category: 'LLM', version: '3.0.0', weightsPath: '/models/llm/llama3_8b.gguf', vramRequirementMb: 16000 },
      { id: 'pred_suite_11', name: 'AuraCore 11-Model Suite', category: 'PREDICTION', version: '3.5.0', weightsPath: '/models/prediction/suite_11.onnx', vramRequirementMb: 18000 },
      { id: 'rank_dcn_v2', name: 'Multi-Task DCN-v2 Ranker', category: 'RANKING', version: '2.1.0', weightsPath: '/models/ranking/dcn_v2.onnx', vramRequirementMb: 15000 },
      { id: 'calib_temp_scaler', name: 'Temperature Scaler Calibrator', category: 'CALIBRATION', version: '1.2.0', weightsPath: '/models/calibration/temp_scaler.bin', vramRequirementMb: 2000 }
    ];
  }
}
