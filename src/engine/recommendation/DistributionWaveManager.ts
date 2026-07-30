import { ContentEntity } from '../content/ContentEntity';

export class DistributionWaveManager {
  public checkWaveExpansion(content: ContentEntity): { nextWave: number; expanded: boolean } {
    const currentWave = content.distribution.distributionWave;
    const views = content.engagementMetrics.views;
    const shares = content.engagementMetrics.shares;

    let expanded = false;
    let nextWave = currentWave;

    if (currentWave === 1 && views >= 500 && shares >= 25) {
      nextWave = 2;
      expanded = true;
    } else if (currentWave === 2 && views >= 5000 && shares >= 250) {
      nextWave = 3;
      expanded = true;
    } else if (currentWave === 3 && views >= 50000 && shares >= 2500) {
      nextWave = 4;
      expanded = true;
    } else if (currentWave === 4 && views >= 250000 && shares >= 15000) {
      nextWave = 5; // Mass Distribution
      expanded = true;
    }

    if (expanded) {
      content.distribution.distributionWave = nextWave;
    }

    return { nextWave, expanded };
  }
}
