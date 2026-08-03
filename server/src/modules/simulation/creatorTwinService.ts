import { v4 as uuidv4 } from 'uuid';

export interface CreatorTwinProfile {
  id: string;
  userId: string;
  handle: string;
  styleFingerprint: {
    pacingSyllablesPerSec: number;
    visualCutRateSec: number;
    authorityScorePct: number;
    primaryHookStyle: string;
    toneCategory: string;
  };
  audienceComposition: {
    topCountries: Array<{ country: string; sharePct: number }>;
    primaryAgeBands: Array<{ ageBand: string; sharePct: number }>;
    topInterests: string[];
  };
  historicalMetrics: {
    totalSimulationsRun: number;
    averageScore: number;
    hitRatePct: number;
    viralSpikeCount: number;
  };
  calibrationParams: {
    biasOffset: number;
    confidenceMultiplier: number;
  };
  updatedAt: string;
}

export class CreatorTwinService {
  private static TWINS: Map<string, CreatorTwinProfile> = new Map();

  static {
    // Seed default Creator Twin profile
    const defaultUserId = '00000000-0000-0000-0000-000000000000';
    this.TWINS.set(defaultUserId, {
      id: uuidv4(),
      userId: defaultUserId,
      handle: '@veer_workspace',
      styleFingerprint: {
        pacingSyllablesPerSec: 3.84,
        visualCutRateSec: 1.4,
        authorityScorePct: 92,
        primaryHookStyle: 'Counter-Intuitive Value Question',
        toneCategory: 'High-Density Practical SaaS'
      },
      audienceComposition: {
        topCountries: [
          { country: 'US', sharePct: 48 },
          { country: 'IN', sharePct: 24 },
          { country: 'GB', sharePct: 14 }
        ],
        primaryAgeBands: [
          { ageBand: '18-24', sharePct: 42 },
          { ageBand: '25-34', sharePct: 44 }
        ],
        topInterests: ['Creator Economy', 'AI Software', 'SaaS Growth']
      },
      historicalMetrics: {
        totalSimulationsRun: 28,
        averageScore: 86.4,
        hitRatePct: 82.1,
        viralSpikeCount: 6
      },
      calibrationParams: {
        biasOffset: 0.02,
        confidenceMultiplier: 1.05
      },
      updatedAt: new Date().toISOString()
    });
  }

  public static async getCreatorTwin(userId: string): Promise<CreatorTwinProfile> {
    const existing = this.TWINS.get(userId);
    if (existing) return existing;

    const newTwin: CreatorTwinProfile = {
      id: uuidv4(),
      userId,
      handle: `@creator_${userId.slice(0, 6)}`,
      styleFingerprint: {
        pacingSyllablesPerSec: 3.5,
        visualCutRateSec: 1.8,
        authorityScorePct: 85,
        primaryHookStyle: 'Direct Benefit Hook',
        toneCategory: 'Educational & Creative'
      },
      audienceComposition: {
        topCountries: [
          { country: 'US', sharePct: 55 },
          { country: 'IN', sharePct: 20 }
        ],
        primaryAgeBands: [
          { ageBand: '18-24', sharePct: 50 },
          { ageBand: '25-34', sharePct: 35 }
        ],
        topInterests: ['Technology', 'Media', 'Business']
      },
      historicalMetrics: {
        totalSimulationsRun: 1,
        averageScore: 78.0,
        hitRatePct: 75.0,
        viralSpikeCount: 0
      },
      calibrationParams: {
        biasOffset: 0.0,
        confidenceMultiplier: 1.0
      },
      updatedAt: new Date().toISOString()
    };

    this.TWINS.set(userId, newTwin);
    return newTwin;
  }

  public static async updateCreatorTwin(userId: string, updates: Partial<CreatorTwinProfile>): Promise<CreatorTwinProfile> {
    const current = await this.getCreatorTwin(userId);
    const updated: CreatorTwinProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.TWINS.set(userId, updated);
    return updated;
  }
}
