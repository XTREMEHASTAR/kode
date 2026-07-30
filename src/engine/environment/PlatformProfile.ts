import { AlgorithmWeights } from './EnvironmentState';

export interface PlatformProfile {
  id: string;
  name: string;
  defaultAlgorithmWeights: AlgorithmWeights;
  baseCreatorDensity: number;
  feedSlotCapacity: number;
  avgAttentionSpanSec: number;
}

export const PLATFORM_PROFILES: Record<string, PlatformProfile> = {
  instagram_reels: {
    id: 'instagram_reels',
    name: 'Instagram Reels',
    defaultAlgorithmWeights: {
      watchTime: 0.35,
      shares: 0.40,
      comments: 0.10,
      repeatPlays: 0.05,
      saves: 0.08,
      clickThroughRate: 0.02
    },
    baseCreatorDensity: 420,
    feedSlotCapacity: 5000,
    avgAttentionSpanSec: 42.0
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    defaultAlgorithmWeights: {
      watchTime: 0.25,
      shares: 0.20,
      comments: 0.05,
      repeatPlays: 0.45,
      saves: 0.03,
      clickThroughRate: 0.02
    },
    baseCreatorDensity: 850,
    feedSlotCapacity: 12000,
    avgAttentionSpanSec: 34.0
  },
  youtube_shorts: {
    id: 'youtube_shorts',
    name: 'YouTube Shorts',
    defaultAlgorithmWeights: {
      watchTime: 0.50,
      shares: 0.10,
      comments: 0.15,
      repeatPlays: 0.10,
      saves: 0.05,
      clickThroughRate: 0.10
    },
    baseCreatorDensity: 310,
    feedSlotCapacity: 3500,
    avgAttentionSpanSec: 52.0
  }
};
