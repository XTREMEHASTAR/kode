export interface AudienceDemographics {
  topAgeGroup: string;
  topGender: string;
  topCountries: string[];
}

export interface GroundTruthPerformanceLabels {
  views: number;
  reach: number;
  impressions: number;
  watchTimeSec: number;
  retentionCurve: number[]; // 30-point retention curve
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  followersGained: number;
  clickThroughRate: number;
  completionRate: number;
  audienceDemographics: AudienceDemographics;
}

export interface GroundTruthSample {
  sampleId: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  hashtags: string[];
  platformId: string;
  postingTimestamp: number;
  region: string;
  niche: string;
  language: string;
  durationSec: number;
  creatorId: string;
  contentDna: number[]; // 1024D Vector
  labels?: GroundTruthPerformanceLabels;
  metadata: {
    datasetVersion: string;
    featureVersion: string;
    labelVersion: string;
    experimentTag?: string;
  };
}
