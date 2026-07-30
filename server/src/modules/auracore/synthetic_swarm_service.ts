import { SyntheticViewerProfile } from './types.js';

export class SyntheticSwarmService {
  private archetypes = [
    {
      name: 'Impatient Zoomer',
      demographics: { ageGroup: '18-24' as const, gender: 'Non-Binary' as const, geo: 'US', language: 'en', incomeTier: 'Medium' as const, occupation: 'Student' },
      traits: {
        attentionSpanSec: 2.2,
        patienceFactor: 0.2,
        skepticismScore: 0.8,
        emotionalReactivity: { humor: 0.9, curiosity: 0.8, controversy: 0.7, aesthetic: 0.85, relatability: 0.75 },
        socialPropensity: { likeProb: 0.25, commentProb: 0.08, shareProb: 0.12, saveProb: 0.05, followProb: 0.02 }
      }
    },
    {
      name: 'High-Intent Millennial Founder',
      demographics: { ageGroup: '25-34' as const, gender: 'M' as const, geo: 'US', language: 'en', incomeTier: 'High' as const, occupation: 'Entrepreneur' },
      traits: {
        attentionSpanSec: 4.5,
        patienceFactor: 0.6,
        skepticismScore: 0.5,
        emotionalReactivity: { humor: 0.4, curiosity: 0.95, controversy: 0.3, aesthetic: 0.6, relatability: 0.8 },
        socialPropensity: { likeProb: 0.15, commentProb: 0.05, shareProb: 0.08, saveProb: 0.25, followProb: 0.08 }
      }
    },
    {
      name: 'Casual Lifestyle Viewer',
      demographics: { ageGroup: '25-34' as const, gender: 'F' as const, geo: 'UK', language: 'en', incomeTier: 'Medium' as const, occupation: 'Designer' },
      traits: {
        attentionSpanSec: 3.8,
        patienceFactor: 0.5,
        skepticismScore: 0.4,
        emotionalReactivity: { humor: 0.75, curiosity: 0.7, controversy: 0.4, aesthetic: 0.95, relatability: 0.9 },
        socialPropensity: { likeProb: 0.35, commentProb: 0.12, shareProb: 0.18, saveProb: 0.20, followProb: 0.05 }
      }
    },
    {
      name: 'Skeptical Tech Enthusiast',
      demographics: { ageGroup: '35-44' as const, gender: 'M' as const, geo: 'CA', language: 'en', incomeTier: 'Ultra-High' as const, occupation: 'Software Engineer' },
      traits: {
        attentionSpanSec: 3.0,
        patienceFactor: 0.3,
        skepticismScore: 0.9,
        emotionalReactivity: { humor: 0.5, curiosity: 0.9, controversy: 0.8, aesthetic: 0.4, relatability: 0.5 },
        socialPropensity: { likeProb: 0.10, commentProb: 0.15, shareProb: 0.05, saveProb: 0.15, followProb: 0.03 }
      }
    },
    {
      name: 'Viral Trend Hunter',
      demographics: { ageGroup: '13-17' as const, gender: 'F' as const, geo: 'US', language: 'en', incomeTier: 'Low' as const, occupation: 'Student' },
      traits: {
        attentionSpanSec: 1.8,
        patienceFactor: 0.15,
        skepticismScore: 0.3,
        emotionalReactivity: { humor: 0.95, curiosity: 0.85, controversy: 0.9, aesthetic: 0.8, relatability: 0.95 },
        socialPropensity: { likeProb: 0.45, commentProb: 0.20, shareProb: 0.30, saveProb: 0.10, followProb: 0.12 }
      }
    }
  ];

  /**
   * Generates a population of synthetic viewer profiles
   */
  public generateSwarm(count: number): SyntheticViewerProfile[] {
    const swarm: SyntheticViewerProfile[] = [];

    for (let i = 0; i < count; i++) {
      const template = this.archetypes[i % this.archetypes.length];
      const variance = (Math.random() - 0.5) * 0.2; // +/- 10% random variance

      // Generate 1024d interest vector
      const interestEmbedding: number[] = new Array(1024).fill(0);
      for (let k = 0; k < 1024; k++) {
        interestEmbedding[k] = Math.sin((k + i) * 0.05);
      }

      swarm.push({
        id: `viewer_${i + 1}_${Math.random().toString(36).substring(2, 6)}`,
        archetypeName: template.name,
        demographics: { ...template.demographics },
        traits: {
          attentionSpanSec: Number(Math.max(1.0, template.traits.attentionSpanSec + variance * 2).toFixed(2)),
          patienceFactor: Number(Math.min(1.0, Math.max(0.05, template.traits.patienceFactor + variance)).toFixed(2)),
          skepticismScore: Number(Math.min(1.0, Math.max(0.05, template.traits.skepticismScore + variance)).toFixed(2)),
          emotionalReactivity: { ...template.traits.emotionalReactivity },
          socialPropensity: { ...template.traits.socialPropensity }
        },
        interestEmbedding,
        memoryState: {
          workingMemorySessionMin: Math.floor(Math.random() * 25) + 5,
          sessionFatigue: Number((Math.random() * 0.3).toFixed(2)),
          recentTopicsViewed: ['marketing', 'ai_tools', 'creator_economy'],
          ebbinghausDecayStrength: 0.85,
          creatorLoyaltyMap: {}
        }
      });
    }

    return swarm;
  }
}
