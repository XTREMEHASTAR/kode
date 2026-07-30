import { StateTransitionLog } from './EnvironmentState';

/**
 * Seeded PRNG (Mulberry32) for 100% deterministic reproducibility
 */
export class SeededPRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  public nextFloat(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export class EnvironmentTelemetry {
  private logs: StateTransitionLog[] = [];

  public logTransition(log: StateTransitionLog): void {
    this.logs.push(log);
  }

  public getLogs(): StateTransitionLog[] {
    return [...this.logs];
  }

  public clear(): void {
    this.logs = [];
  }
}
