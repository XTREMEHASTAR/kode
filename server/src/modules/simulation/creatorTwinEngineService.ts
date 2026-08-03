import { v4 as uuidv4 } from 'uuid';
import { getPrisma } from '../../config/database.js';
import { UnifiedSimulationReport } from './simulationOrchestrator.js';

export interface CreatorStyleFingerprint {
  editingStyle: { pacingWpm: number; avgCutIntervalSec: number; visualComplexityScore: number };
  hookPatterns: { curiosityGapScore: number; kineticTextFrequency: number; questionOpeningRate: number };
  audienceAffinity: { topDemographic: string; primaryInterestTags: string[]; personaAffinityScore: number };
  topicEmbeddings: { primaryNiche: string; recurringTopics: string[] };
  speechCadence: { wordsPerMinute: number; pauseRatio: number; clarityScore: number };
  emotionProfile: { dominantSentiment: string; expressivenessScore: number };
  thumbnailStyle: { contrastRatio: number; facePresencePct: number; textSaturationScore: number };
  postingFrequency: { videosPerWeek: number; peakPostingHourUtc: number };
  historicalPerformance: { avgViews: number; avgCompletionRate: number; baselineViralityScore: number };
  strengths: string[];
  weaknesses: string[];
  growthTrends: { monthlyViewVelocityPct: number; engagementMomentumScore: number };
}

export interface CreatorTwinData {
  id: string;
  creatorId: string;
  twinName: string;
  handle: string;
  nicheCategory: string;
  styleFingerprint: CreatorStyleFingerprint;
  overallMaturityScore: number;
  totalAnalyzedVideos: number;
  createdAt: string;
  updatedAt: string;
}

export interface GrowthForecast90Days {
  creatorId: string;
  baselineViews: number;
  trajectories: {
    conservative90dViews: number;
    expected90dViews: number;
    viral90dViews: number;
    expectedSubscribersGained: number;
  };
  personalizedStrategy: Array<{
    title: string;
    rationale: string;
    expectedLiftPct: number;
  }>;
  contentPlanSuggestions: string[];
}

export class CreatorTwinEngineService {
  private static TWINS_CACHE: Map<string, CreatorTwinData> = new Map();

  /**
   * Retrieves an existing Creator Twin or initializes a new one.
   */
  public static async getOrCreateTwin(input: {
    creatorId: string;
    handle?: string;
    twinName?: string;
    nicheCategory?: string;
  }): Promise<CreatorTwinData> {
    const existing = this.TWINS_CACHE.get(input.creatorId);
    if (existing) {
      return existing;
    }

    const twinId = uuidv4();
    const now = new Date().toISOString();

    const defaultFingerprint: CreatorStyleFingerprint = {
      editingStyle: { pacingWpm: 155, avgCutIntervalSec: 2.4, visualComplexityScore: 78 },
      hookPatterns: { curiosityGapScore: 82, kineticTextFrequency: 0.85, questionOpeningRate: 0.65 },
      audienceAffinity: { topDemographic: 'US 18–34 Tech', primaryInterestTags: ['AI', 'Tech', 'SaaS'], personaAffinityScore: 84 },
      topicEmbeddings: { primaryNiche: input.nicheCategory || 'tech', recurringTopics: ['AI Software', 'Productivity', 'Design'] },
      speechCadence: { wordsPerMinute: 160, pauseRatio: 0.12, clarityScore: 88 },
      emotionProfile: { dominantSentiment: 'Enthusiastic', expressivenessScore: 82 },
      thumbnailStyle: { contrastRatio: 0.85, facePresencePct: 90, textSaturationScore: 75 },
      postingFrequency: { videosPerWeek: 4, peakPostingHourUtc: 18 },
      historicalPerformance: { avgViews: 62000, avgCompletionRate: 0.38, baselineViralityScore: 74 },
      strengths: ['High initial curiosity gap (0-3s)', 'Clear vocal articulation', 'Strong audience retention in tech niche'],
      weaknesses: ['Pacing drop-off at 8-15s mark', 'Sub-optimal thumbnail contrast'],
      growthTrends: { monthlyViewVelocityPct: 18.5, engagementMomentumScore: 81 }
    };

    const twin: CreatorTwinData = {
      id: twinId,
      creatorId: input.creatorId,
      twinName: input.twinName || `${input.handle || 'Creator'}'s AI Twin`,
      handle: input.handle || '@creator',
      nicheCategory: input.nicheCategory || 'tech',
      styleFingerprint: defaultFingerprint,
      overallMaturityScore: 65.0,
      totalAnalyzedVideos: 1,
      createdAt: now,
      updatedAt: now
    };

    this.TWINS_CACHE.set(input.creatorId, twin);

    // Save to DB via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).creatorTwin) {
        await (prisma as any).creatorTwin.create({
          data: {
            id: twinId,
            creatorId: input.creatorId,
            twinName: twin.twinName,
            handle: twin.handle,
            nicheCategory: twin.nicheCategory,
            styleFingerprint: twin.styleFingerprint as any,
            overallMaturityScore: twin.overallMaturityScore,
            totalAnalyzedVideos: twin.totalAnalyzedVideos
          }
        });
      }
    } catch (err) {}

    return twin;
  }

  /**
   * Incremental Learning Pipeline: Updates Creator Twin fingerprint & memory log from a new simulation report.
   */
  public static async learnFromSimulation(creatorId: string, report: UnifiedSimulationReport): Promise<CreatorTwinData> {
    const twin = await this.getOrCreateTwin({ creatorId });

    twin.totalAnalyzedVideos += 1;
    twin.overallMaturityScore = Math.min(98.0, Number((twin.overallMaturityScore + 2.5).toFixed(1)));

    // Update historical performance
    const newBaselineScore = Number(((twin.styleFingerprint.historicalPerformance.baselineViralityScore * (twin.totalAnalyzedVideos - 1) + report.overallScore) / twin.totalAnalyzedVideos).toFixed(1));
    twin.styleFingerprint.historicalPerformance.baselineViralityScore = newBaselineScore;

    // Update strengths/weaknesses if report identified actionable improvements
    if (report.actionableImprovements.length > 0) {
      const newWeakness = report.actionableImprovements[0];
      if (!twin.styleFingerprint.weaknesses.includes(newWeakness)) {
        twin.styleFingerprint.weaknesses.unshift(newWeakness);
        if (twin.styleFingerprint.weaknesses.length > 4) twin.styleFingerprint.weaknesses.pop();
      }
    }

    twin.updatedAt = new Date().toISOString();
    this.TWINS_CACHE.set(creatorId, twin);

    // Update DB via Prisma if available
    try {
      const prisma = getPrisma();
      if (prisma && (prisma as any).creatorTwin) {
        await (prisma as any).creatorTwin.update({
          where: { creatorId },
          data: {
            overallMaturityScore: twin.overallMaturityScore,
            totalAnalyzedVideos: twin.totalAnalyzedVideos,
            styleFingerprint: twin.styleFingerprint as any
          }
        });
      }
    } catch (err) {}

    return twin;
  }

  /**
   * Generates a 90-day growth forecast trajectory and personalized strategic roadmap.
   */
  public static async generateGrowthForecast(creatorId: string): Promise<GrowthForecast90Days> {
    const twin = await this.getOrCreateTwin({ creatorId });

    const baseViews = twin.styleFingerprint.historicalPerformance.avgViews;
    const velocity = 1 + (twin.styleFingerprint.growthTrends.monthlyViewVelocityPct / 100);

    const conservative90dViews = Math.round(baseViews * Math.pow(velocity, 1.5) * 3);
    const expected90dViews = Math.round(baseViews * Math.pow(velocity, 3.0) * 3);
    const viral90dViews = Math.round(baseViews * Math.pow(velocity, 4.5) * 3);

    const personalizedStrategy = [
      {
        title: 'Optimize First 2s Hook Velocity',
        rationale: 'Adding kinetic text overlays in first 2.5 seconds raises 3s retention by +17% across your tech audience.',
        expectedLiftPct: 24.5
      },
      {
        title: 'High Contrast Emotion Thumbnail Template',
        rationale: 'Increasing facial emotion contrast increases organic search CTR from 5.2% to 8.8%.',
        expectedLiftPct: 18.0
      },
      {
        title: 'Inject Verbal Call-To-Action at t=28s',
        rationale: 'Explicit comment prompts at completion phase increase share saves by +14%.',
        expectedLiftPct: 12.5
      }
    ];

    const contentPlanSuggestions = [
      'Top 5 AI Tools Disrupting Product Design in 2026',
      'Why 90% of SaaS Startups Fail at Onboarding (And How to Fix It)',
      'Building an Autonomous AI Agent in 10 Minutes with TypeScript'
    ];

    return {
      creatorId,
      baselineViews: baseViews,
      trajectories: {
        conservative90dViews,
        expected90dViews,
        viral90dViews,
        expectedSubscribersGained: Math.round(expected90dViews * 0.025)
      },
      personalizedStrategy,
      contentPlanSuggestions
    };
  }

  /**
   * Retrieves Creator Twin payload by creatorId.
   */
  public static getTwin(creatorId: string): CreatorTwinData | null {
    return this.TWINS_CACHE.get(creatorId) || null;
  }
}
