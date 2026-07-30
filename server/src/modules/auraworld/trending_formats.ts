import { WorldEventBus } from './event_bus.js';
import { TrendingFormatTemplate } from './types.js';

export class TrendingFormatsEngine {
  private eventBus: WorldEventBus;
  private formats: Map<string, TrendingFormatTemplate> = new Map();

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.initializeDefaultFormats();
  }

  private initializeDefaultFormats(): void {
    const defaults: TrendingFormatTemplate[] = [
      {
        id: 'fmt_stop_doing_x',
        formatName: 'Negative Warning Hook ("Stop doing X if you want Y")',
        category: 'Educational Breakdown',
        adoptionCount: 65000,
        fatigueScore: 0.25,
        avgHookRetentionBonusPct: 14.5
      },
      {
        id: 'fmt_3_secrets',
        formatName: '3 Hidden Tricks Listicle',
        category: 'Value Listicle',
        adoptionCount: 120000,
        fatigueScore: 0.45,
        avgHookRetentionBonusPct: 9.2
      },
      {
        id: 'fmt_before_after',
        formatName: 'Transformation Reveal (Before vs After)',
        category: 'Visual Storytelling',
        adoptionCount: 88000,
        fatigueScore: 0.15,
        avgHookRetentionBonusPct: 18.0
      }
    ];

    defaults.forEach(f => this.formats.set(f.id, f));
  }

  public async processTick(simTimeSec: number): Promise<TrendingFormatTemplate[]> {
    for (const fmt of this.formats.values()) {
      fmt.adoptionCount += Math.floor(Math.random() * 50) + 10;
      if (fmt.adoptionCount % 1000 < 50) {
        await this.eventBus.publish({
          type: 'FORMAT_ADOPTED',
          timestamp: new Date().toISOString(),
          simulatedTimeSec: simTimeSec,
          payload: { formatName: fmt.formatName, adoptionCount: fmt.adoptionCount }
        });
      }
    }
    return Array.from(this.formats.values());
  }

  public getFormats(): TrendingFormatTemplate[] {
    return Array.from(this.formats.values());
  }
}
