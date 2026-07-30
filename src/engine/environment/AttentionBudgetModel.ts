export class AttentionBudgetModel {
  private totalCapacity: number;
  private availableCapacity: number;
  private fatigueRate: number;

  constructor(totalCapacity: number = 100000, fatigueRate: number = 0.015) {
    this.totalCapacity = totalCapacity;
    this.availableCapacity = totalCapacity;
    this.fatigueRate = fatigueRate;
  }

  public tick(dtMinutes: number = 1.0, seasonalityFactor: number = 1.0): void {
    const fatigue = Math.exp(-this.fatigueRate * dtMinutes);
    this.availableCapacity = Math.round(this.totalCapacity * fatigue * seasonalityFactor);
  }

  public getBudget() {
    return {
      totalCapacity: this.totalCapacity,
      availableCapacity: this.availableCapacity,
      fatigueRate: this.fatigueRate
    };
  }
}
