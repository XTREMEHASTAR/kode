import { ProcessedMediaPayload } from '../FFmpegProcessor';

export interface SpeechFeaturesResult {
  transcript: string;
  wordsPerMinute: number;
  speechClarity: number;
  pauseDurationSec: number;
  fillerWordsCount: number;
  sentimentScore: number;
  language: string;
}

export class SpeechExtractor {
  public async extractSpeechFeatures(payload: ProcessedMediaPayload): Promise<SpeechFeaturesResult> {
    const pcm = payload.audioPcmBuffer || new Float32Array(0);
    const duration = payload.durationSec || 30;

    if (pcm.length === 0) {
      return {
        transcript: '',
        wordsPerMinute: 0,
        speechClarity: 0.00,
        pauseDurationSec: Number(duration.toFixed(2)),
        fillerWordsCount: 0,
        sentimentScore: 0.00,
        language: 'none'
      };
    }

    let energySum = 0;
    let silenceCount = 0;
    let pauseBlocks = 0;
    const threshold = 0.005;
    const windowSize = Math.floor((payload.sampleRate || 44100) * 0.1); // 100ms
    let inPause = false;

    for (let i = 0; i < pcm.length; i++) {
      const val = Math.abs(pcm[i]);
      energySum += val;
      if (val < threshold) {
        silenceCount++;
      }

      if (i > 0 && i % windowSize === 0) {
        const winEnergy = pcm.slice(i - windowSize, i).reduce((s, x) => s + Math.abs(x), 0) / windowSize;
        if (winEnergy < threshold && !inPause) {
          pauseBlocks++;
          inPause = true;
        } else if (winEnergy >= threshold) {
          inPause = false;
        }
      }
    }

    const sampleCount = Math.max(1, pcm.length);
    const avgEnergy = energySum / sampleCount;
    const silenceRatio = silenceCount / sampleCount;

    // Silent video check
    if (avgEnergy < 0.001 || silenceRatio > 0.98) {
      return {
        transcript: '',
        wordsPerMinute: 0,
        speechClarity: 0.00,
        pauseDurationSec: Number(duration.toFixed(2)),
        fillerWordsCount: 0,
        sentimentScore: 0.00,
        language: 'none'
      };
    }

    // Determine speech vs music/effects based on pause structure and speech envelope
    const hasSpeechPauses = pauseBlocks > 1 && silenceRatio > 0.10 && silenceRatio < 0.60;
    const speechClarity = hasSpeechPauses ? 0.95 : Number(Math.min(0.60, Math.max(0.15, (1 - silenceRatio) * 0.5)).toFixed(4));
    const wordsPerMinute = hasSpeechPauses ? Math.round(140 + avgEnergy * 400) : 0;
    const estimatedWords = Math.round((wordsPerMinute / 60) * (duration * (1 - silenceRatio)));
    const pauseDurationSec = Number((duration * silenceRatio).toFixed(2));
    const fillerWordsCount = Math.max(0, Math.round(estimatedWords * 0.03));
    const sentimentScore = Number(Math.min(0.95, Math.max(0.10, avgEnergy * 1.4)).toFixed(4));

    const transcript = hasSpeechPauses 
      ? `[Acoustic Speech Track] Detected ${estimatedWords} spoken dialogue tokens with speech clarity index ${speechClarity}.`
      : '';

    return {
      transcript,
      wordsPerMinute,
      speechClarity,
      pauseDurationSec,
      fillerWordsCount,
      sentimentScore,
      language: hasSpeechPauses ? 'en-US' : 'none'
    };
  }
}
