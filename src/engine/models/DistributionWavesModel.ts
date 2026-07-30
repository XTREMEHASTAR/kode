export class DistributionWavesModel {
  public predictPeakWave(viralityProbability: number): number {
    if (viralityProbability > 0.85) return 5;
    if (viralityProbability > 0.65) return 4;
    if (viralityProbability > 0.45) return 3;
    if (viralityProbability > 0.25) return 2;
    return 1;
  }
}
