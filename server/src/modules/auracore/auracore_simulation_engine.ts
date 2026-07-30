import { AuraCoreSimulationEnvironment } from './engine/auracore_simulation_environment.js';
import { AuraCoreSimulationTelemetry } from './types.js';

export class AuraCoreSimulationEngine {
  private environment = new AuraCoreSimulationEnvironment();

  /**
   * Main entry point: Executes a Monte Carlo Agent Swarm Simulation over video input using AuraCore Simulation Environment
   */
  public async runSimulation(input: {
    title: string;
    scriptText: string;
    durationSec?: number;
    populationSize?: number;
    contentType?: string;
    platform?: 'TIKTOK' | 'REELS' | 'YOUTUBE_SHORTS' | 'X_FEED';
  }): Promise<AuraCoreSimulationTelemetry> {
    // Delegate execution to the modular 12-Engine Simulation Environment Runtime
    const result = await this.environment.runSimulation(input);
    return result as unknown as AuraCoreSimulationTelemetry;
  }
}
