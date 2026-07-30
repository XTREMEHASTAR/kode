import { ProcessedMediaPayload } from '../FFmpegProcessor';

export interface AudioFeaturesResult {
  bpm: number;
  loudnessDb: number;
  rmsEnergy: number;
  silenceRatio: number;
  dynamicRangeDb: number;
  spectralCentroidHz: number;
  tempoStabilityScore: number;
}

export class AudioExtractor {
  public async extractAudioFeatures(payload: ProcessedMediaPayload): Promise<AudioFeaturesResult> {
    const pcm = payload.audioPcmBuffer || new Float32Array(0);
    const sampleRate = payload.sampleRate || 44100;

    let sumSq = 0;
    let maxVal = 0;
    let silenceCount = 0;
    let zeroCrossings = 0;
    const threshold = 0.005;

    // Detect transient energy peaks for BPM calculation
    let peakCount = 0;
    const frameSize = Math.floor(sampleRate * 0.05); // 50ms windows
    let prevWindowEnergy = 0;

    for (let i = 0; i < pcm.length; i++) {
      const val = pcm[i];
      const absVal = Math.abs(val);
      sumSq += val * val;
      if (absVal > maxVal) maxVal = absVal;
      if (absVal < threshold) silenceCount++;

      if (i > 0 && ((pcm[i - 1] >= 0 && val < 0) || (pcm[i - 1] < 0 && val >= 0))) {
        zeroCrossings++;
      }

      if (i > 0 && i % frameSize === 0) {
        const windowEnergy = pcm.slice(i - frameSize, i).reduce((s, x) => s + x * x, 0) / frameSize;
        if (windowEnergy > prevWindowEnergy * 1.8 && windowEnergy > 0.02) {
          peakCount++;
        }
        prevWindowEnergy = windowEnergy;
      }
    }

    const sampleCount = Math.max(1, pcm.length);
    const rmsEnergy = Number(Math.sqrt(sumSq / sampleCount).toFixed(4));
    const durationSec = sampleCount / sampleRate;

    if (rmsEnergy < 0.001 || silenceCount / sampleCount > 0.99) {
      return {
        bpm: 0,
        loudnessDb: -60.0,
        rmsEnergy: 0.000,
        silenceRatio: 1.00,
        dynamicRangeDb: 0.0,
        spectralCentroidHz: 50.0,
        tempoStabilityScore: 0.00
      };
    }

    const loudnessDb = Number(Math.max(-60, 20 * Math.log10(rmsEnergy || 0.0001)).toFixed(2));
    const silenceRatio = Number((silenceCount / sampleCount).toFixed(4));
    const dynamicRangeDb = Number(Math.min(40, Math.max(2, 20 * Math.log10((maxVal || 0.01) / (rmsEnergy || 0.001)))).toFixed(2));
    const zcrPerSec = zeroCrossings / Math.max(0.1, durationSec);
    const spectralCentroidHz = Number(Math.min(8000, Math.max(100, zcrPerSec * 15)).toFixed(2));
    const rawBpm = Math.round((peakCount / Math.max(0.1, durationSec)) * 60);
    const bpm = Math.min(200, Math.max(60, rawBpm > 0 ? rawBpm : 110));
    const tempoStabilityScore = Number(Math.min(0.99, Math.max(0.05, 1 - silenceRatio)).toFixed(4));

    return {
      bpm,
      loudnessDb,
      rmsEnergy,
      silenceRatio,
      dynamicRangeDb,
      spectralCentroidHz,
      tempoStabilityScore
    };
  }
}
