import { v4 as uuidv4 } from 'uuid';

export interface AudienceFactData {
  id: string;
  platform: string;
  country: string;
  ageBand: string;
  gender?: string;
  language: string;
  deviceCategory: string;
  timezoneBucket: string;
  interestCategory?: string;
  metricType: string;
  value: number;
  unit: string;
  source: string;
  sourceConfidence: number;
  datasetVersionId: string;
}

export class AudienceFactService {
  private static DEFAULT_VERSION = 'c8b0e77d-789a-4c22-b48e-2895f87b8f9e';

  private static MOCK_FACTS: AudienceFactData[] = [
    {
      id: uuidv4(),
      platform: 'instagram',
      country: 'US',
      ageBand: '18-24',
      gender: 'All',
      language: 'en',
      deviceCategory: 'mobile',
      timezoneBucket: 'EST',
      interestCategory: 'Entertainment & Gaming',
      metricType: 'population_share',
      value: 0.28,
      unit: 'ratio',
      source: 'Statista & Meta Ad Planner 2026',
      sourceConfidence: 0.95,
      datasetVersionId: AudienceFactService.DEFAULT_VERSION
    },
    {
      id: uuidv4(),
      platform: 'instagram',
      country: 'US',
      ageBand: '25-34',
      gender: 'All',
      language: 'en',
      deviceCategory: 'mobile',
      timezoneBucket: 'EST',
      interestCategory: 'Business & Tech',
      metricType: 'population_share',
      value: 0.35,
      unit: 'ratio',
      source: 'Statista & Meta Ad Planner 2026',
      sourceConfidence: 0.95,
      datasetVersionId: AudienceFactService.DEFAULT_VERSION
    },
    {
      id: uuidv4(),
      platform: 'instagram',
      country: 'IN',
      ageBand: '18-24',
      gender: 'M',
      language: 'hi',
      deviceCategory: 'mobile',
      timezoneBucket: 'IST',
      interestCategory: 'Creator Economy & Fitness',
      metricType: 'population_share',
      value: 0.22,
      unit: 'ratio',
      source: 'DataReportal India 2026',
      sourceConfidence: 0.92,
      datasetVersionId: AudienceFactService.DEFAULT_VERSION
    },
    {
      id: uuidv4(),
      platform: 'youtube_shorts',
      country: 'US',
      ageBand: '18-24',
      gender: 'All',
      language: 'en',
      deviceCategory: 'mobile',
      timezoneBucket: 'PST',
      interestCategory: 'Gaming',
      metricType: 'population_share',
      value: 0.31,
      unit: 'ratio',
      source: 'YouTube Ad Reach Specs 2026',
      sourceConfidence: 0.94,
      datasetVersionId: AudienceFactService.DEFAULT_VERSION
    }
  ];

  public static getDatasetVersion(): string {
    return this.DEFAULT_VERSION;
  }

  public static getFactsByPlatform(platform: string): AudienceFactData[] {
    return this.MOCK_FACTS.filter(
      f => f.platform.toLowerCase() === platform.toLowerCase()
    );
  }

  public static getAllFacts(): AudienceFactData[] {
    return this.MOCK_FACTS;
  }
}
