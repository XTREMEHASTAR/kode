import { GroundTruthSample, GroundTruthPerformanceLabels } from './GroundTruthSample';

export class AnalyticsImporter {
  public attachLabels(sample: GroundTruthSample, labels: GroundTruthPerformanceLabels): GroundTruthSample {
    return {
      ...sample,
      labels: { ...labels },
      metadata: {
        ...sample.metadata,
        labelVersion: 'l1.1.0'
      }
    };
  }
}
