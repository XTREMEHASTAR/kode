import { MultimodalContentDNA } from '../orchestrator/MultimodalFusionEngine';

export interface ContentDnaValidationReport {
  assetId: string;
  timestamp: number;
  isValid: boolean;
  validationScore: number;
  passedChecks: string[];
  rejectionReasons: string[];
}

export class ContentDnaValidator {
  public static validateContentDna(dna: MultimodalContentDNA): ContentDnaValidationReport {
    const passedChecks: string[] = [];
    const rejectionReasons: string[] = [];

    // 1. Corrupted Embedding Check
    if (!dna.dnaVector || dna.dnaVector.length !== 1024) {
      rejectionReasons.push(`Corrupted embedding: vector length is ${dna.dnaVector?.length || 0}, expected 1024D`);
    } else if (dna.dnaVector.some(v => Number.isNaN(v) || !Number.isFinite(v))) {
      rejectionReasons.push('Corrupted embedding: vector contains NaN or Infinite values');
    } else {
      passedChecks.push('EMBEDDING_INTEGRITY');
    }

    // 2. Missing Features Check
    if (!dna.visualDna || !dna.audioDna || !dna.narrativeDna || !dna.hookDna || !dna.emotionDna) {
      rejectionReasons.push('Missing features: one or more required DNA sub-blocks are missing');
    } else {
      passedChecks.push('MISSING_FEATURES_CHECK');
    }

    // 3. Confidence Threshold Check
    if (dna.overallConfidence < 0.85) {
      rejectionReasons.push(`Confidence threshold failure: overall confidence is ${dna.overallConfidence}, required >= 0.85`);
    } else {
      passedChecks.push('CONFIDENCE_THRESHOLD_CHECK');
    }

    // 4. Conflicting Outputs Check
    if (dna.audioDna?.voiceClarity > 0.80 && !dna.narrativeDna?.storyStructure) {
      rejectionReasons.push('Conflicting outputs: high voice clarity detected without narrative story structure');
    } else {
      passedChecks.push('CONFLICTING_OUTPUTS_CHECK');
    }

    // 5. OCR & Subtitle Quality Check
    if (dna.hookDna?.oneSecStopProb < 0.0 || dna.hookDna?.overallHookScore < 0.0) {
      rejectionReasons.push('OCR/Hook quality failure: negative hook scores detected');
    } else {
      passedChecks.push('OCR_QUALITY_CHECK');
    }

    // 6. Transcript Quality Check
    if (dna.overallConfidence >= 0.85 && dna.narrativeDna && !dna.narrativeDna.intent) {
      rejectionReasons.push('Transcript quality failure: missing narrative intent descriptor');
    } else {
      passedChecks.push('TRANSCRIPT_QUALITY_CHECK');
    }

    // 7. Scene Detection Quality Check
    if (!dna.editingDna || dna.editingDna.sceneCount <= 0) {
      rejectionReasons.push('Scene detection quality failure: no scene boundaries detected');
    } else {
      passedChecks.push('SCENE_DETECTION_QUALITY');
    }

    // 8. Audio Quality Check
    if (!dna.audioDna || dna.audioDna.bpm < 40 || dna.audioDna.bpm > 220) {
      rejectionReasons.push(`Audio quality failure: BPM ${dna.audioDna?.bpm} outside valid range [40..220]`);
    } else {
      passedChecks.push('AUDIO_QUALITY_CHECK');
    }

    const isValid = rejectionReasons.length === 0;
    const validationScore = Number((passedChecks.length / (passedChecks.length + rejectionReasons.length)).toFixed(2));

    return {
      assetId: dna.assetId,
      timestamp: Date.now(),
      isValid,
      validationScore,
      passedChecks,
      rejectionReasons
    };
  }
}
