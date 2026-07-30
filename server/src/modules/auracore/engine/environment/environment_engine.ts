import { EnvironmentConfig, EnvironmentTickContext, PlatformType } from '../contracts/engine.types.js';
import { SimulationEventBus } from '../event_bus/event_bus.js';
import { SIMULATION_EVENT_TOPICS } from '../contracts/events.js';

/**
 * Environment Engine Module - Mathematically Grounded
 * Uses Ornstein-Uhlenbeck SDE processes for mean-reverting stochastic platform noise.
 */
export class EnvironmentEngine {
  private config: EnvironmentConfig;
  private currentNoiseX: number = 0.0; // Current state of OU process X_t

  constructor(config?: Partial<EnvironmentConfig>) {
    this.config = {
      environmentId: config?.environmentId || `env_${Date.now()}`,
      platform: config?.platform || 'TIKTOK',
      timeStepMs: config?.timeStepMs || 1000,
      stochasticNoiseFactor: config?.stochasticNoiseFactor ?? 0.15,
      globalAttentionCap: config?.globalAttentionCap || 100000,
      nicheContext: config?.nicheContext || 'Tech & Entrepreneurship'
    };
  }

  /**
   * Ornstein-Uhlenbeck Mean-Reverting Stochastic Differential Equation (SDE)
   * dX_t = theta * (mu - X_t) * dt + sigma * dW_t
   */
  public stepOrnsteinUhlenbeckSDE(
    theta: number = 0.7, // Rate of mean reversion
    mu: number = 0.0,    // Mean equilibrium noise level
    sigma: number = 0.1, // Volatility
    dt: number = 1.0     // Time step
  ): number {
    const dW = (Math.random() - 0.5) * 2 * Math.sqrt(dt); // Gaussian white noise increment dW ~ N(0, dt)
    const dX = theta * (mu - this.currentNoiseX) * dt + sigma * dW;
    this.currentNoiseX += dX;
    return Number(this.currentNoiseX.toFixed(4));
  }

  public getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<EnvironmentConfig>, eventBus?: SimulationEventBus, simulationId?: string): void {
    this.config = { ...this.config, ...newConfig };
    if (eventBus && simulationId) {
      eventBus.publish(SIMULATION_EVENT_TOPICS.ENVIRONMENT_CONFIG_MUTATED, simulationId, this.config);
    }
  }

  public evaluateTickContext(step: number, simulationId: string, eventBus?: SimulationEventBus): EnvironmentTickContext {
    const platformRules = this.getPlatformRules(this.config.platform);

    // Evaluate OU SDE Mean-Reverting Noise Step
    const ouNoise = this.stepOrnsteinUhlenbeckSDE(0.7, 0.0, this.config.stochasticNoiseFactor, 0.5);
    const noiseVector = {
      attentionShift: Number((1.0 + ouNoise * 0.5).toFixed(3)),
      viralMultiplier: Number((1.0 + ouNoise * 0.8).toFixed(3)),
      cringePenalty: Number((1.0 - ouNoise * 0.3).toFixed(3))
    };

    const context: EnvironmentTickContext = {
      environmentId: this.config.environmentId,
      step,
      timestamp: Date.now(),
      noiseVector,
      platformRules
    };

    if (eventBus) {
      eventBus.publish(SIMULATION_EVENT_TOPICS.ENVIRONMENT_TICK_COMPLETED, simulationId, context);
    }

    return context;
  }

  private getPlatformRules(platform: PlatformType) {
    switch (platform) {
      case 'TIKTOK':
        return { maxDurationSec: 180, hookWindowSec: 3, linkPenaltyFactor: 0.4 };
      case 'REELS':
        return { maxDurationSec: 90, hookWindowSec: 3, linkPenaltyFactor: 0.2 };
      case 'YOUTUBE_SHORTS':
        return { maxDurationSec: 60, hookWindowSec: 2, linkPenaltyFactor: 0.1 };
      case 'X_FEED':
        return { maxDurationSec: 140, hookWindowSec: 2, linkPenaltyFactor: 0.5 };
      default:
        return { maxDurationSec: 60, hookWindowSec: 3, linkPenaltyFactor: 0.3 };
    }
  }
}
