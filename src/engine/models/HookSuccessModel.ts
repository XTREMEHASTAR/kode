import { PredictionInput } from './ModelTypes';

export class HookSuccessModel {
  public predictHookSuccess(input: PredictionInput): number {
    const creatorAuth = input.creatorProfile.authorityScore;
    const baseHook = input.hookScore ?? 0.75;
    const trendBoost = input.environmentState.activeTrends.length > 0 ? 0.10 : 0.0;

    return Number(Math.min(1.0, Math.max(0.1, baseHook * 0.7 + creatorAuth * 0.2 + trendBoost)).toFixed(3));
  }
}
