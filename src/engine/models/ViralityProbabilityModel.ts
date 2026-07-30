import { PredictionInput } from './ModelTypes';

export class ViralityProbabilityModel {
  public predictVirality(input: PredictionInput, hookScore: number): number {
    const quality = input.qualityScore ?? 0.80;
    const followerFactor = Math.min(1.0, input.creatorProfile.followerCount / 100000);
    const trendFactor = input.environmentState.activeTrends.length * 0.05;

    const logits = quality * 0.4 + hookScore * 0.3 + followerFactor * 0.2 + trendFactor;
    return Number(Math.min(0.99, Math.max(0.01, logits)).toFixed(3));
  }
}
