export class CompetitionSubsystem {
  private creatorDensity: number;
  private feedSlotCapacity: number;

  constructor(baseCreatorDensity: number = 420, feedSlotCapacity: number = 5000) {
    this.creatorDensity = baseCreatorDensity;
    this.feedSlotCapacity = feedSlotCapacity;
  }

  public tick(dtMinutes: number = 1.0, prngDelta: number = 0): void {
    // Dynamic fluctuation based on PRNG
    const fluctuation = (prngDelta - 0.5) * 20;
    this.creatorDensity = Math.max(50, Math.round(this.creatorDensity + fluctuation));
  }

  public getCompetitionIndex(): number {
    return Number(Math.min(1.0, (this.creatorDensity * 10) / this.feedSlotCapacity).toFixed(3));
  }

  public getCreatorDensity(): number {
    return this.creatorDensity;
  }
}
