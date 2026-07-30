import { VisualFeaturesResult } from './VisualExtractor';
import { SpeechFeaturesResult } from './SpeechExtractor';
import { OcrFeaturesResult } from './OcrExtractor';
import { AudioFeaturesResult } from './AudioExtractor';
import { QwenReasoningOutput } from './QwenReasoningEngine';

export interface ProvenanceField<T> {
  value: T;
  confidence: number;
  source: string;
}

export interface ProductionContentDNA {
  assetId: string;
  timestamp: number;
  hookScore: ProvenanceField<number>;
  visualNovelty: ProvenanceField<number>;
  editingRhythm: ProvenanceField<number>;
  speechClarity: ProvenanceField<number>;
  topic: ProvenanceField<string>;
  niche: ProvenanceField<string>;
  audioEnergy: ProvenanceField<number>;
  bpm: ProvenanceField<number>;
  sceneCount: ProvenanceField<number>;
  motionIntensity: ProvenanceField<number>;
  captionDensity: ProvenanceField<number>;
  transcript: ProvenanceField<string>;
  screenText: ProvenanceField<string>;
  qwenReasoning: ProvenanceField<QwenReasoningOutput>;
  embeddingVector: ProvenanceField<number[]>;
  dnaVector: number[]; // 1024D array
}

export class ProductionContentDnaEngine {
  public static fuseProductionContentDna(
    assetId: string,
    visual: VisualFeaturesResult,
    speech: SpeechFeaturesResult,
    ocr: OcrFeaturesResult,
    audio: AudioFeaturesResult,
    qwen: QwenReasoningOutput,
    embedding: number[]
  ): ProductionContentDNA {
    const rawHookScore = Number(
      (visual.editingRhythmScore * 0.35 +
       ocr.captionDensity * 0.25 +
       speech.speechClarity * 0.25 +
       audio.rmsEnergy * 0.15).toFixed(4)
    );
    const hookScoreVal = Math.min(0.99, Math.max(0.05, rawHookScore));

    const dnaVector: number[] = new Array(1024).fill(0).map((_, idx) => {
      const sig = (idx % 4 === 0) ? hookScoreVal
                : (idx % 4 === 1) ? visual.editingRhythmScore
                : (idx % 4 === 2) ? speech.speechClarity
                : audio.rmsEnergy;
      return Number((Math.sin((idx + 1) * 0.04) * sig).toFixed(4));
    });

    return {
      assetId,
      timestamp: Date.now(),
      hookScore: { value: hookScoreVal, confidence: Number((0.85 + hookScoreVal * 0.1).toFixed(2)), source: 'VisualAnalyzer' },
      visualNovelty: { value: visual.visualNoveltyScore, confidence: 0.95, source: 'VisualAnalyzer' },
      editingRhythm: { value: visual.editingRhythmScore, confidence: 0.94, source: 'VisualAnalyzer' },
      speechClarity: { value: speech.speechClarity, confidence: 0.98, source: 'SpeechAnalyzer' },
      topic: { value: qwen.topic, confidence: 0.95, source: 'QwenReasoningEngine' },
      niche: { value: qwen.niche, confidence: 0.95, source: 'QwenReasoningEngine' },
      audioEnergy: { value: audio.rmsEnergy, confidence: 0.96, source: 'AudioAnalyzer' },
      bpm: { value: audio.bpm, confidence: 0.98, source: 'AudioAnalyzer' },
      sceneCount: { value: visual.sceneCount, confidence: 0.99, source: 'VisualAnalyzer' },
      motionIntensity: { value: visual.motionIntensity, confidence: 0.92, source: 'VisualAnalyzer' },
      captionDensity: { value: ocr.captionDensity, confidence: 0.97, source: 'OcrAnalyzer' },
      transcript: { value: speech.transcript, confidence: speech.speechClarity, source: 'SpeechAnalyzer' },
      screenText: { value: ocr.screenText, confidence: 0.96, source: 'OcrAnalyzer' },
      qwenReasoning: { value: qwen, confidence: 0.95, source: 'QwenReasoningEngine' },
      embeddingVector: { value: embedding, confidence: 0.98, source: 'NomicEmbedder' },
      dnaVector
    };
  }

  public static validateContentDnaComplete(dna: ProductionContentDNA): boolean {
    return Boolean(
      dna &&
      dna.assetId &&
      dna.hookScore?.value !== undefined &&
      dna.visualNovelty?.value !== undefined &&
      dna.editingRhythm?.value !== undefined &&
      dna.speechClarity?.value !== undefined &&
      dna.topic?.value !== undefined &&
      dna.embeddingVector?.value?.length > 0 &&
      dna.dnaVector?.length === 1024
    );
  }
}
