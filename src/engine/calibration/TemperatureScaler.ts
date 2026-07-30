export class TemperatureScaler {
  private temperature: number = 1.0;

  public calibrateTemperature(mape: number, bias: number): number {
    if (mape > 15.0 || Math.abs(bias) > 5000) {
      // Adjust temperature scalar T to soften/sharpen distributions
      const adjustment = bias > 0 ? 0.05 : -0.05;
      this.temperature = Number(Math.max(0.5, Math.min(2.5, this.temperature + adjustment)).toFixed(3));
    }
    return this.temperature;
  }

  public getTemperature(): number {
    return this.temperature;
  }

  public setTemperature(t: number): void {
    this.temperature = t;
  }
}
