import { PredictionInput } from './ModelTypes';

export class RetentionModel {
  public predictRetentionCurve(input: PredictionInput, hookSuccess: number): number[] {
    const decayRate = 0.035 - (hookSuccess - 0.5) * 0.02;

    return new Array(30).fill(1.0).map((val, sec) => {
      const retention = val * Math.exp(-decayRate * sec);
      return Number(Math.max(0.05, retention).toFixed(3));
    });
  }
}
