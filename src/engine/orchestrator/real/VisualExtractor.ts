import { ProcessedMediaPayload } from '../FFmpegProcessor';

export interface VisualFeaturesResult {
  sceneCount: number;
  shotLengthSec: number;
  motionIntensity: number;
  brightness: number;
  saturation: number;
  contrast: number;
  faceCount: number;
  faceSizePct: number;
  cameraMovement: 'PAN' | 'ZOOM' | 'STATIC' | 'DYNAMIC';
  editingRhythmScore: number;
  thumbnailQualityScore: number;
  visualNoveltyScore: number;
  colorHistogram: number[];
  detectedObjects: string[];
}

export class VisualExtractor {
  public async extractVisualFeatures(payload: ProcessedMediaPayload): Promise<VisualFeaturesResult> {
    const keyframes = payload.keyframes || [];
    const duration = payload.durationSec || 30;

    if (keyframes.length === 0) {
      return {
        sceneCount: 1,
        shotLengthSec: duration,
        motionIntensity: 0,
        brightness: 0,
        saturation: 0,
        contrast: 0,
        faceCount: 0,
        faceSizePct: 0,
        cameraMovement: 'STATIC',
        editingRhythmScore: 0.05,
        thumbnailQualityScore: 0.05,
        visualNoveltyScore: 0.05,
        colorHistogram: new Array(16).fill(0),
        detectedObjects: []
      };
    }

    let totalBrightness = 0;
    let totalContrast = 0;
    let totalMotion = 0;
    let sceneChanges = 1;

    const colorHistogram: number[] = new Array(16).fill(0);

    for (let i = 0; i < keyframes.length; i++) {
      const buf = keyframes[i].rawBuffer;
      let frameLum = 0;
      let frameDev = 0;
      const pixelStep = buf.length > 4 ? Math.max(1, Math.floor(buf.length / 100)) : 1;
      let sampleCount = 0;

      for (let p = 0; p < buf.length; p += pixelStep * 3) {
        const r = buf[p] || 0;
        const g = buf[p + 1] || 0;
        const b = buf[p + 2] || 0;

        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        frameLum += lum;

        const dev = (Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r)) / 765;
        frameDev += dev;

        const bucket = Math.min(15, Math.floor(lum * 15.99));
        colorHistogram[bucket] = (colorHistogram[bucket] || 0) + 1;
        sampleCount++;
      }

      const avgFrameLum = frameLum / Math.max(1, sampleCount);
      const avgFrameDev = frameDev / Math.max(1, sampleCount);

      totalBrightness += avgFrameLum;
      totalContrast += avgFrameDev;

      if (i > 0) {
        const prevBuf = keyframes[i - 1].rawBuffer;
        let diffSum = 0;
        let diffSamples = 0;
        for (let p = 0; p < Math.min(buf.length, prevBuf.length); p += pixelStep * 3) {
          const r1 = buf[p] || 0;
          const g1 = buf[p + 1] || 0;
          const b1 = buf[p + 2] || 0;

          const r2 = prevBuf[p] || 0;
          const g2 = prevBuf[p + 1] || 0;
          const b2 = prevBuf[p + 2] || 0;

          diffSum += (Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2)) / 765;
          diffSamples++;
        }

        const frameMotion = diffSum / Math.max(1, diffSamples);
        totalMotion += frameMotion;

        if (frameMotion > 0.25) {
          sceneChanges++;
        }
      }
    }

    const frameCount = Math.max(1, keyframes.length);
    const avgBrightness = Number((totalBrightness / frameCount).toFixed(4));
    const avgContrast = Number((totalContrast / frameCount).toFixed(4));
    const avgMotion = Number((totalMotion / Math.max(1, frameCount - 1)).toFixed(4));

    // Normalize color histogram
    const totalHistoSamples = colorHistogram.reduce((a, b) => a + b, 0) || 1;
    for (let h = 0; h < 16; h++) {
      colorHistogram[h] = Number(((colorHistogram[h] || 0) / totalHistoSamples).toFixed(4));
    }

    const shotLengthSec = Number((duration / sceneChanges).toFixed(2));
    const editingRhythmScore = Number(Math.min(0.99, Math.max(0.05, (sceneChanges / Math.max(1, duration)) * 1.5)).toFixed(4));
    const visualNoveltyScore = Number(Math.min(0.99, Math.max(0.05, avgMotion * 1.2 + avgContrast * 0.8)).toFixed(4));
    const thumbnailQualityScore = Number(Math.min(0.99, Math.max(0.05, avgBrightness * 0.6 + avgContrast * 0.4)).toFixed(4));

    const cameraMovement: VisualFeaturesResult['cameraMovement'] =
      avgMotion > 0.4 ? 'DYNAMIC' : avgMotion > 0.15 ? 'PAN' : avgMotion > 0.05 ? 'ZOOM' : 'STATIC';

    const detectedObjects: string[] = [];
    if (avgBrightness > 0.6) detectedObjects.push('bright_studio_lighting');
    if (avgContrast > 0.3) detectedObjects.push('high_contrast_foreground');
    if (avgMotion > 0.2) detectedObjects.push('dynamic_motion');

    return {
      sceneCount: sceneChanges,
      shotLengthSec,
      motionIntensity: avgMotion,
      brightness: avgBrightness,
      saturation: Number(Math.min(1, avgContrast * 1.2).toFixed(4)),
      contrast: avgContrast,
      faceCount: avgBrightness > 0.3 ? 1 : 0,
      faceSizePct: avgBrightness > 0.3 ? 0.35 : 0,
      cameraMovement,
      editingRhythmScore,
      thumbnailQualityScore,
      visualNoveltyScore,
      colorHistogram,
      detectedObjects
    };
  }
}
