import { GroundTruthSample, GroundTruthPerformanceLabels } from './GroundTruthSample';
import { AnalyticsImporter } from './AnalyticsImporter';
import { DataQualityValidator, DataQualityReport } from './DataQualityValidator';
import { DatasetVersionManager, DatasetVersionConfig } from './DatasetVersionManager';

export interface SampleFilterQuery {
  platformId?: string;
  niche?: string;
  language?: string;
  minViews?: number;
  maxDurationSec?: number;
  creatorId?: string;
}

export interface SupervisedDatasetExport {
  datasetVersion: string;
  featureVersion: string;
  labelVersion: string;
  sampleCount: number;
  samples: GroundTruthSample[];
}

export class GroundTruthDatasetPlatform {
  private samples: Map<string, GroundTruthSample> = new Map();
  private importer: AnalyticsImporter;
  private validator: DataQualityValidator;
  private versionManager: DatasetVersionManager;

  constructor(versionConfig?: DatasetVersionConfig) {
    this.importer = new AnalyticsImporter();
    this.validator = new DataQualityValidator();
    this.versionManager = new DatasetVersionManager(versionConfig);
  }

  public registerSample(sample: Omit<GroundTruthSample, 'metadata'>): GroundTruthSample {
    const version = this.versionManager.getActiveVersion();
    const fullSample: GroundTruthSample = {
      ...sample,
      metadata: {
        datasetVersion: version.datasetVersion,
        featureVersion: version.featureVersion,
        labelVersion: version.labelVersion,
        experimentTag: version.experimentTag
      }
    };

    this.samples.set(fullSample.sampleId, fullSample);
    return fullSample;
  }

  public importAnalytics(sampleId: string, labels: GroundTruthPerformanceLabels): GroundTruthSample {
    const sample = this.samples.get(sampleId);
    if (!sample) throw new Error(`Sample not found: ${sampleId}`);

    const updated = this.importer.attachLabels(sample, labels);
    this.samples.set(sampleId, updated);
    return updated;
  }

  public validateSample(sampleId: string): DataQualityReport {
    const sample = this.samples.get(sampleId);
    if (!sample) throw new Error(`Sample not found: ${sampleId}`);

    return this.validator.validateSample(sample);
  }

  public searchSamples(query: SampleFilterQuery): GroundTruthSample[] {
    return Array.from(this.samples.values()).filter(sample => {
      if (query.platformId && sample.platformId !== query.platformId) return false;
      if (query.niche && sample.niche !== query.niche) return false;
      if (query.language && sample.language !== query.language) return false;
      if (query.creatorId && sample.creatorId !== query.creatorId) return false;
      if (query.maxDurationSec && sample.durationSec > query.maxDurationSec) return false;
      if (query.minViews && (!sample.labels || sample.labels.views < query.minViews)) return false;
      return true;
    });
  }

  public generateSupervisedDataset(datasetVersion?: string, filter?: SampleFilterQuery): SupervisedDatasetExport {
    const version = this.versionManager.getActiveVersion();
    let samples = filter ? this.searchSamples(filter) : Array.from(this.samples.values());

    // Only include valid samples with ground truth labels
    samples = samples.filter(s => s.labels && this.validator.validateSample(s).isValid);

    return {
      datasetVersion: datasetVersion ?? version.datasetVersion,
      featureVersion: version.featureVersion,
      labelVersion: version.labelVersion,
      sampleCount: samples.length,
      samples
    };
  }

  public getSampleCount(): number {
    return this.samples.size;
  }
}
