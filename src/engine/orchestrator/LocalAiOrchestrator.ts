import { FFmpegProcessor } from './FFmpegProcessor';
import { FrameAnalysisService } from './subsystems/FrameAnalysisService';
import { OcrExtractionService } from './subsystems/OcrExtractionService';
import { AudioAnalysisService } from './subsystems/AudioAnalysisService';
import { TranscriptionService } from './subsystems/TranscriptionService';
import { ScriptIntelligenceService } from './subsystems/ScriptIntelligenceService';
import { VisualIntelligenceService } from './subsystems/VisualIntelligenceService';
import { AudioIntelligenceService } from './subsystems/AudioIntelligenceService';
import { HookEngine } from './subsystems/HookEngine';
import { EmotionEngine } from './subsystems/EmotionEngine';
import { MultimodalFusionEngine, MultimodalContentDNA } from './MultimodalFusionEngine';

export interface OrchestrationRequest {
  assetId: string;
  videoPath: string;
  durationSec?: number;
  archetype?: string;
}

/**
 * Master Local AI Production Inference Orchestrator
 */
export class LocalAiOrchestrator {
  private ffmpeg: FFmpegProcessor;
  private frameService: FrameAnalysisService;
  private ocrService: OcrExtractionService;
  private audioService: AudioAnalysisService;
  private transcriptionService: TranscriptionService;
  private scriptService: ScriptIntelligenceService;
  private visualIntelService: VisualIntelligenceService;
  private audioIntelService: AudioIntelligenceService;
  private hookEngine: HookEngine;
  private emotionEngine: EmotionEngine;
  private fusionEngine: MultimodalFusionEngine;
  private cache: Map<string, MultimodalContentDNA> = new Map();

  constructor() {
    this.ffmpeg = new FFmpegProcessor();
    this.frameService = new FrameAnalysisService();
    this.ocrService = new OcrExtractionService();
    this.audioService = new AudioAnalysisService();
    this.transcriptionService = new TranscriptionService();
    this.scriptService = new ScriptIntelligenceService();
    this.visualIntelService = new VisualIntelligenceService();
    this.audioIntelService = new AudioIntelligenceService();
    this.hookEngine = new HookEngine();
    this.emotionEngine = new EmotionEngine();
    this.fusionEngine = new MultimodalFusionEngine();
  }

  public async processVideoAsset(req: OrchestrationRequest): Promise<MultimodalContentDNA> {
    const startTime = performance.now();
    const durationSec = req.durationSec || 30;

    // 1. Check LRU Cache
    if (this.cache.has(req.assetId)) {
      return this.cache.get(req.assetId)!;
    }

    // 2. Pre-processing: Demux frames, audio PCM, container metadata
    const mediaPayload = await this.ffmpeg.extractMediaPayload(req.assetId, req.videoPath, durationSec);

    // 3. Dispatch Parallel Subsystem AI Models (Promise.all)
    const [
      frameData,
      ocrData,
      audioData,
      transcriptData,
      emotionData
    ] = await Promise.all([
      this.frameService.analyzeFrames(mediaPayload),
      this.ocrService.extractOcr(mediaPayload),
      this.audioService.analyzeAudio(mediaPayload),
      this.transcriptionService.transcribeSpeech(mediaPayload),
      this.emotionEngine.estimateEmotions(durationSec)
    ]);

    // 4. Secondary Parallel Intelligence Passes
    const [
      scriptData,
      visualIntelData,
      audioIntelData
    ] = await Promise.all([
      this.scriptService.analyzeScript(transcriptData),
      this.visualIntelService.analyzeVisuals(frameData),
      this.audioIntelService.analyzeAudioIntelligence(audioData)
    ]);

    // 5. Hook Engine Window Scoring
    const hookData = await this.hookEngine.analyzeHook(
      scriptData.hookQualityScore,
      visualIntelData.hookVisualsScore
    );

    const processingLatencyMs = Number((performance.now() - startTime).toFixed(2));

    // 6. Multimodal Signal Fusion Engine
    const fusedDna = await this.fusionEngine.fuseSubsystems(
      req.assetId,
      durationSec,
      frameData,
      ocrData,
      audioData,
      transcriptData,
      scriptData,
      visualIntelData,
      audioIntelData,
      hookData,
      emotionData,
      processingLatencyMs
    );

    // Cache result
    this.cache.set(req.assetId, fusedDna);

    return fusedDna;
  }
}
