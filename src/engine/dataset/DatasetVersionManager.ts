export interface DatasetVersionConfig {
  datasetVersion: string;
  featureVersion: string;
  labelVersion: string;
  experimentTag?: string;
}

export class DatasetVersionManager {
  private activeVersion: DatasetVersionConfig;

  constructor(config: DatasetVersionConfig = { datasetVersion: 'v1.0.0', featureVersion: 'f2.4.0', labelVersion: 'l1.1.0' }) {
    this.activeVersion = config;
  }

  public getActiveVersion(): DatasetVersionConfig {
    return { ...this.activeVersion };
  }

  public setVersion(version: DatasetVersionConfig): void {
    this.activeVersion = { ...version };
  }
}
