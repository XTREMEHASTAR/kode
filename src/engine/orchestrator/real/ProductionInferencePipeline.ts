import { FFmpegProcessor } from '../FFmpegProcessor';
import { VisualExtractor } from './VisualExtractor';
import { SpeechExtractor } from './SpeechExtractor';
import { OcrExtractor } from './OcrExtractor';
import { AudioExtractor } from './AudioExtractor';
import { NomicEmbedder } from './NomicEmbedder';
import { QwenReasoningEngine } from './QwenReasoningEngine';
import { ProductionContentDnaEngine, ProductionContentDNA } from './ProductionContentDnaEngine';
import { PredictionModelSuite } from '../../models/PredictionModelSuite';
import { DynamicOllamaRegistry, OllamaCapability } from '../../registry/DynamicOllamaRegistry';
import { ProductionGpuMonitor, ProductionGpuTelemetryLog } from '../../telemetry/ProductionGpuMonitor';
import { ProductionArtifactExporter } from '../../telemetry/ProductionArtifactExporter';
import { CreatorAgent } from '../../creator/CreatorAgent';
import { EnvironmentState } from '../../environment/EnvironmentState';

export interface ProductionInferenceRequest {
  assetId: string;
  videoPath: string;
  durationSec?: number;
  creatorProfile: CreatorAgent;
  environmentState: EnvironmentState;
}

export interface ProductionInferenceResult {
  assetId: string;
  contentDna: ProductionContentDNA;
  predictionOutput: any;
  outputDirectory: string;
  gpuTrace: ProductionGpuTelemetryLog[];
  runtimeTrace: any[];
}

export class ProductionInferencePipeline {
  private ffmpeg: FFmpegProcessor;
  private visualExtractor: VisualExtractor;
  private speechExtractor: SpeechExtractor;
  private ocrExtractor: OcrExtractor;
  private audioExtractor: AudioExtractor;
  private nomicEmbedder: NomicEmbedder;
  private qwenReasoning: QwenReasoningEngine;
  private predictionSuite: PredictionModelSuite;
  private registry: DynamicOllamaRegistry;

  constructor() {
    this.ffmpeg = new FFmpegProcessor();
    this.visualExtractor = new VisualExtractor();
    this.speechExtractor = new SpeechExtractor();
    this.ocrExtractor = new OcrExtractor();
    this.audioExtractor = new AudioExtractor();
    this.nomicEmbedder = new NomicEmbedder();
    this.qwenReasoning = new QwenReasoningEngine();
    this.predictionSuite = new PredictionModelSuite();
    this.registry = new DynamicOllamaRegistry('http://127.0.0.1:11434');
  }

  public async runProductionInference(req: ProductionInferenceRequest): Promise<ProductionInferenceResult> {
    const gpuTrace: ProductionGpuTelemetryLog[] = [];
    const runtimeTrace: any[] = [];
    const durationSec = req.durationSec || 30;

    // STAGE 1: Discover Models via GET /api/tags
    const discoverStart = performance.now();
    await this.registry.initializeAndDiscover();
    const discoverEnd = performance.now();

    // Map capabilities (Halts if unavailable)
    const reasoningModel = this.registry.selectModelForCapability(OllamaCapability.TEXT_ANALYSIS);
    const embeddingModel = this.registry.selectModelForCapability(OllamaCapability.EMBEDDINGS);

    runtimeTrace.push({
      stage: 'MODEL_REGISTRY_DISCOVERY',
      endpoint: 'http://127.0.0.1:11434/api/tags',
      reasoningModel,
      embeddingModel,
      wallClockMs: Number((discoverEnd - discoverStart).toFixed(2))
    });
    gpuTrace.push(ProductionGpuMonitor.sampleGpuTelemetry('MODEL_REGISTRY_DISCOVERY'));

    // STAGE 2: Demux Video & Audio Keyframes
    const mediaPayload = await this.ffmpeg.extractMediaPayload(req.assetId, req.videoPath, durationSec);

    // STAGE 3: Run FOUR Independent Pipelines Simultaneously (Promise.all)
    const parallelStart = performance.now();

    const [visual, speech, ocr, audio] = await Promise.all([
      this.visualExtractor.extractVisualFeatures(mediaPayload),
      this.speechExtractor.extractSpeechFeatures(mediaPayload),
      this.ocrExtractor.extractOcrFeatures(mediaPayload),
      this.audioExtractor.extractAudioFeatures(mediaPayload)
    ]);

    const parallelEnd = performance.now();
    runtimeTrace.push({
      stage: '4_PARALLEL_PIPELINES_EXECUTION',
      wallClockMs: Number((parallelEnd - parallelStart).toFixed(2)),
      visualExtracted: Boolean(visual),
      speechExtracted: Boolean(speech),
      ocrExtracted: Boolean(ocr),
      audioExtracted: Boolean(audio)
    });
    gpuTrace.push(ProductionGpuMonitor.sampleGpuTelemetry('4_PARALLEL_PIPELINES'));

    // STAGE 4: Generate nomic-embed-text Embeddings
    const embedText = `${speech.transcript} ${ocr.screenText} Topic:${visual.detectedObjects.join(', ')}`;
    const embedStart = performance.now();
    const embedding = await this.nomicEmbedder.generateEmbedding(embedText);
    const embedEnd = performance.now();

    runtimeTrace.push({
      stage: 'NOMIC_EMBED_TEXT',
      modelName: embeddingModel,
      vectorLength: embedding.length,
      wallClockMs: Number((embedEnd - embedStart).toFixed(2))
    });

    // STAGE 5: Qwen3.5 Reasoning on Structured Features
    const structuredPayload = { visual, speech, ocr, audio };
    const qwenStart = performance.now();
    const qwenReasoning = await this.qwenReasoning.analyzeStructuredFeatures(structuredPayload);
    const qwenEnd = performance.now();

    runtimeTrace.push({
      stage: 'QWEN_REASONING_ENGINE',
      modelName: reasoningModel,
      topic: qwenReasoning.topic,
      wallClockMs: Number((qwenEnd - qwenStart).toFixed(2))
    });
    gpuTrace.push(ProductionGpuMonitor.sampleGpuTelemetry('QWEN_REASONING'));

    // STAGE 6: Production Content DNA Fusion & Completion Validation
    const contentDna = ProductionContentDnaEngine.fuseProductionContentDna(
      req.assetId,
      visual,
      speech,
      ocr,
      audio,
      qwenReasoning,
      embedding
    );

    if (!ProductionContentDnaEngine.validateContentDnaComplete(contentDna)) {
      throw new Error('[CONTENT_DNA_INCOMPLETE] Content DNA payload is missing mandatory provenanced fields. Halting pipeline.');
    }

    // STAGE 7: Prediction Engine Execution (Consumes ONLY Content DNA)
    const predInput = {
      contentDna: contentDna.dnaVector,
      platformId: 'TIKTOK',
      creatorProfile: req.creatorProfile,
      environmentState: req.environmentState,
      hookScore: contentDna.hookScore.value,
      qualityScore: contentDna.visualNovelty.value
    };

    const predStart = performance.now();
    const predictionOutput = this.predictionSuite.predictPerformance(predInput);
    const predEnd = performance.now();

    runtimeTrace.push({
      stage: 'PREDICTION_ENGINE',
      predictedViews: predictionOutput.predictedViews,
      viralityProbability: predictionOutput.viralityProbability,
      wallClockMs: Number((predEnd - predStart).toFixed(2))
    });

    // STAGE 8: Write All 13 Output Files to analysis/<video_id>/
    const outputDirectory = ProductionArtifactExporter.exportAll13AnalysisFiles(
      req.assetId,
      visual,
      speech,
      ocr,
      audio,
      qwenReasoning,
      embedding,
      contentDna,
      predInput,
      predictionOutput,
      runtimeTrace,
      gpuTrace
    );

    // STAGE 9: Write 10 Debug Files to /debug/pipeline/timestamp-videoId/
    const { PipelineDebugger } = await import('../../telemetry/PipelineDebugger');
    PipelineDebugger.exportDebugFiles(
      req.assetId,
      mediaPayload,
      visual,
      speech,
      ocr,
      audio,
      embedding,
      qwenReasoning,
      contentDna,
      predInput,
      predictionOutput
    );

    return {
      assetId: req.assetId,
      contentDna,
      predictionOutput,
      outputDirectory,
      gpuTrace,
      runtimeTrace
    };
  }
}
