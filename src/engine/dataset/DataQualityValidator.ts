import { GroundTruthSample } from './GroundTruthSample';

export interface DataQualityReport {
  sampleId: string;
  isValid: boolean;
  issues: string[];
}

export class DataQualityValidator {
  public validateSample(sample: GroundTruthSample): DataQualityReport {
    const issues: string[] = [];

    if (!sample.contentDna || sample.contentDna.length !== 1024) {
      issues.push('Invalid or missing 1024D Content DNA vector');
    }

    if (sample.durationSec <= 0) {
      issues.push('Corrupted media duration (<= 0s)');
    }

    if (!sample.labels) {
      issues.push('Missing ground truth performance labels');
    } else {
      if (sample.labels.views < 0) issues.push('Negative view count label');
      if (sample.labels.completionRate < 0 || sample.labels.completionRate > 1.0) {
        issues.push('Invalid completion rate label (must be in [0, 1])');
      }
    }

    return {
      sampleId: sample.sampleId,
      isValid: issues.length === 0,
      issues
    };
  }
}
