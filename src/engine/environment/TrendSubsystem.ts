import { TrendItem } from './EnvironmentState';

export class TrendSubsystem {
  private trends: TrendItem[] = [];

  constructor(initialTrends: TrendItem[] = []) {
    this.trends = initialTrends.length > 0 ? initialTrends : [
      { id: 't1', name: 'Trending Synthwave Drop', category: 'AUDIO', viralityMultiplier: 4.28, decayRate: 0.05, ageHours: 12 },
      { id: 't2', name: 'Pattern Interrupt Hook', category: 'TOPIC', viralityMultiplier: 2.14, decayRate: 0.02, ageHours: 24 },
      { id: 't3', name: '#SaaSGrowth2026', category: 'HASHTAG', viralityMultiplier: 1.85, decayRate: 0.04, ageHours: 48 }
    ];
  }

  public tick(dtHours: number = 1.0): void {
    this.trends = this.trends.map(t => {
      const newAge = t.ageHours + dtHours;
      const newMultiplier = Math.max(1.0, t.viralityMultiplier * Math.exp(-t.decayRate * dtHours));
      return { ...t, ageHours: newAge, viralityMultiplier: Number(newMultiplier.toFixed(3)) };
    });
  }

  public getActiveTrends(): TrendItem[] {
    return [...this.trends];
  }

  public addTrend(trend: TrendItem): void {
    this.trends.push(trend);
  }
}
