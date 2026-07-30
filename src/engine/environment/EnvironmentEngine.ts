import { EnvironmentState, TrendItem } from './EnvironmentState';
import { PLATFORM_PROFILES, PlatformProfile } from './PlatformProfile';
import { TrendSubsystem } from './TrendSubsystem';
import { CompetitionSubsystem } from './CompetitionSubsystem';
import { AttentionBudgetModel } from './AttentionBudgetModel';
import { EnvironmentTelemetry, SeededPRNG } from './EnvironmentTelemetry';

export interface EnvironmentEngineConfig {
  seed?: number;
  platformId?: string;
  region?: string;
  initialTrends?: TrendItem[];
}

/**
 * AuraWorld Central Environment Simulation Core Engine
 */
export class EnvironmentEngine {
  private state: EnvironmentState;
  private platformProfile: PlatformProfile;
  private trendSubsystem: TrendSubsystem;
  private competitionSubsystem: CompetitionSubsystem;
  private attentionBudgetModel: AttentionBudgetModel;
  private telemetry: EnvironmentTelemetry;
  private prng: SeededPRNG;

  constructor(config: EnvironmentEngineConfig = {}) {
    const seed = config.seed ?? 1024;
    const platformId = config.platformId ?? 'instagram_reels';
    const region = config.region ?? 'US_EAST';

    this.prng = new SeededPRNG(seed);
    this.platformProfile = PLATFORM_PROFILES[platformId] || PLATFORM_PROFILES['instagram_reels'];
    
    this.trendSubsystem = new TrendSubsystem(config.initialTrends);
    this.competitionSubsystem = new CompetitionSubsystem(
      this.platformProfile.baseCreatorDensity,
      this.platformProfile.feedSlotCapacity
    );
    this.attentionBudgetModel = new AttentionBudgetModel();
    this.telemetry = new EnvironmentTelemetry();

    this.state = {
      timestamp: Date.now(),
      tickIndex: 0,
      seed,
      region,
      platformId: this.platformProfile.id,
      competitionIndex: this.competitionSubsystem.getCompetitionIndex(),
      creatorDensity: this.competitionSubsystem.getCreatorDensity(),
      audienceMood: { valence: 0.42, arousal: 0.78 },
      attentionBudget: this.attentionBudgetModel.getBudget(),
      seasonalityFactor: 1.15,
      algorithmWeights: { ...this.platformProfile.defaultAlgorithmWeights },
      activeTrends: this.trendSubsystem.getActiveTrends()
    };

    // Log initial state
    this.recordTelemetry();
  }

  /**
   * Deterministic World Tick Loop
   */
  public tick(dtMinutes: number = 1.0): EnvironmentState {
    this.state.tickIndex += 1;
    this.state.timestamp += dtMinutes * 60 * 1000;

    const prngDelta = this.prng.nextFloat();

    // 1. Subsystem Ticks
    this.trendSubsystem.tick(dtMinutes / 60);
    this.competitionSubsystem.tick(dtMinutes, prngDelta);
    this.attentionBudgetModel.tick(dtMinutes, this.state.seasonalityFactor);

    // 2. State Recalculation
    this.state.competitionIndex = this.competitionSubsystem.getCompetitionIndex();
    this.state.creatorDensity = this.competitionSubsystem.getCreatorDensity();
    this.state.attentionBudget = this.attentionBudgetModel.getBudget();
    this.state.activeTrends = this.trendSubsystem.getActiveTrends();

    // 3. Record Telemetry Transition Log
    this.recordTelemetry();

    return this.getState();
  }

  public setPlatform(platformId: string): void {
    if (PLATFORM_PROFILES[platformId]) {
      this.platformProfile = PLATFORM_PROFILES[platformId];
      this.state.platformId = this.platformProfile.id;
      this.state.algorithmWeights = { ...this.platformProfile.defaultAlgorithmWeights };
    }
  }

  public getState(): EnvironmentState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public getPlatformProfile(): PlatformProfile {
    return { ...this.platformProfile };
  }

  public getTelemetryLogs() {
    return this.telemetry.getLogs();
  }

  private recordTelemetry(): void {
    this.telemetry.logTransition({
      tickIndex: this.state.tickIndex,
      timestamp: this.state.timestamp,
      platformId: this.state.platformId,
      competitionIndex: this.state.competitionIndex,
      availableAttention: this.state.attentionBudget.availableCapacity,
      activeTrendCount: this.state.activeTrends.length
    });
  }
}
