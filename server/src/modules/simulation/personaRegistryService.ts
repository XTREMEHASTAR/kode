import { v4 as uuidv4 } from 'uuid';

export interface DemographicCell {
  country: string;
  platform: string;
  ageBand: string;
  gender: string;
  language: string;
  deviceCategory: string;
}

export interface InterestAffinity {
  category: string;
  affinityScore: number; // 0.0 to 1.0
}

export interface BehavioralPriors {
  hookSensitivity: number;           // 0.0-1.0
  scrollToleranceSeconds: number;     // 1 to 10 seconds
  savePropensity: number;             // 0.0-1.0
  sharePropensity: number;            // 0.0-1.0
  commentPropensity: number;          // 0.0-1.0
  followPropensity: number;           // 0.0-1.0
  clickbaitTolerance: number;         // 0.0-1.0
}

export interface PersonaProfile {
  personaId: string;
  versionId: string;
  representsUsersCount: number;
  weightPct: number;
  demographicCell: DemographicCell;
  interestVector: InterestAffinity[];
  behavioralPriors: BehavioralPriors;
  narrativeProfile: string;
}

export class PersonaRegistryService {
  private static REGISTRY_VERSION = 'e4e5f6a7-89b0-4c11-9d22-3e4f5a6b7c8d';

  private static BASE_PERSONAS: Array<Omit<PersonaProfile, 'personaId' | 'versionId'>> = [
    {
      representsUsersCount: 850000,
      weightPct: 0.15,
      demographicCell: {
        country: 'US',
        platform: 'instagram',
        ageBand: '18-24',
        gender: 'Male',
        language: 'en',
        deviceCategory: 'mobile_ios'
      },
      interestVector: [
        { category: 'Gaming', affinityScore: 0.9 },
        { category: 'Meme Culture', affinityScore: 0.85 },
        { category: 'Short-Form Comedy', affinityScore: 0.8 }
      ],
      behavioralPriors: {
        hookSensitivity: 0.95,
        scrollToleranceSeconds: 2.2,
        savePropensity: 0.12,
        sharePropensity: 0.65,
        commentPropensity: 0.40,
        followPropensity: 0.15,
        clickbaitTolerance: 0.70
      },
      narrativeProfile: "19-year-old college student who spends 2.5h daily on Reels. High scroll velocity; needs visual pattern interrupt in first 1.5 seconds."
    },
    {
      representsUsersCount: 1200000,
      weightPct: 0.22,
      demographicCell: {
        country: 'US',
        platform: 'instagram',
        ageBand: '25-34',
        gender: 'Female',
        language: 'en',
        deviceCategory: 'mobile_ios'
      },
      interestVector: [
        { category: 'Business & SaaS', affinityScore: 0.92 },
        { category: 'Productivity & AI', affinityScore: 0.88 },
        { category: 'Self-Improvement', affinityScore: 0.75 }
      ],
      behavioralPriors: {
        hookSensitivity: 0.75,
        scrollToleranceSeconds: 4.5,
        savePropensity: 0.58,
        sharePropensity: 0.45,
        commentPropensity: 0.25,
        followPropensity: 0.35,
        clickbaitTolerance: 0.20
      },
      narrativeProfile: "30-year-old startup founder & productivity builder. Values high-density practical insights, clear subtitles, and structured frameworks."
    },
    {
      representsUsersCount: 950000,
      weightPct: 0.18,
      demographicCell: {
        country: 'IN',
        platform: 'instagram',
        ageBand: '18-24',
        gender: 'Male',
        language: 'hi-en',
        deviceCategory: 'mobile_android'
      },
      interestVector: [
        { category: 'Creator Economy', affinityScore: 0.95 },
        { category: 'Fitness & Health', affinityScore: 0.80 },
        { category: 'Side Hustles', affinityScore: 0.85 }
      ],
      behavioralPriors: {
        hookSensitivity: 0.85,
        scrollToleranceSeconds: 3.0,
        savePropensity: 0.50,
        sharePropensity: 0.72,
        commentPropensity: 0.60,
        followPropensity: 0.45,
        clickbaitTolerance: 0.50
      },
      narrativeProfile: "22-year-old creator in Mumbai looking for actionable video growth hacks. High comment and share rate for high-value breakdown scripts."
    },
    {
      representsUsersCount: 600000,
      weightPct: 0.10,
      demographicCell: {
        country: 'GB',
        platform: 'youtube_shorts',
        ageBand: '35-44',
        gender: 'Female',
        language: 'en',
        deviceCategory: 'mobile_ios'
      },
      interestVector: [
        { category: 'Storytelling & Documentary', affinityScore: 0.90 },
        { category: 'Design & Aesthetics', affinityScore: 0.85 }
      ],
      behavioralPriors: {
        hookSensitivity: 0.60,
        scrollToleranceSeconds: 5.0,
        savePropensity: 0.40,
        sharePropensity: 0.30,
        commentPropensity: 0.20,
        followPropensity: 0.30,
        clickbaitTolerance: 0.15
      },
      narrativeProfile: "38-year-old creative director. Patient watcher if story hook resonates; intolerant of superficial fluff or exaggerated claims."
    }
  ];

  public static getRegistryVersion(): string {
    return this.REGISTRY_VERSION;
  }

  public static getPersonasForTier(tier: string, targetCount?: number): PersonaProfile[] {
    const desiredCount = targetCount || (
      tier === 'quick' ? 100 :
      tier === 'deep' ? 10000 :
      tier === 'exhaustive' ? 100000 : 1000
    );

    const generated: PersonaProfile[] = [];
    const baseLen = this.BASE_PERSONAS.length;

    for (let i = 0; i < Math.min(desiredCount, 1000); i++) {
      const base = this.BASE_PERSONAS[i % baseLen];
      const variance = (i * 17) % 20 / 100; // deterministic slight shift per persona sample

      generated.push({
        personaId: uuidv4(),
        versionId: this.REGISTRY_VERSION,
        representsUsersCount: Math.round(base.representsUsersCount * (1 + variance)),
        weightPct: Number((base.weightPct / Math.max(1, Math.min(desiredCount, 1000) / baseLen)).toFixed(6)),
        demographicCell: { ...base.demographicCell },
        interestVector: base.interestVector.map(iv => ({
          ...iv,
          affinityScore: Math.min(1.0, Math.max(0.1, Number((iv.affinityScore + variance * 0.1).toFixed(2))))
        })),
        behavioralPriors: {
          ...base.behavioralPriors,
          scrollToleranceSeconds: Number(Math.min(10, Math.max(1, base.behavioralPriors.scrollToleranceSeconds + variance)).toFixed(1)),
          hookSensitivity: Math.min(1.0, Math.max(0.1, Number((base.behavioralPriors.hookSensitivity + variance * 0.05).toFixed(2))))
        },
        narrativeProfile: base.narrativeProfile
      });
    }

    return generated;
  }
}
