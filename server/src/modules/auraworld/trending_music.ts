import { WorldEventBus } from './event_bus.js';
import { TrendingMusicTrack } from './types.js';

export class TrendingMusicEngine {
  private eventBus: WorldEventBus;
  private tracks: Map<string, TrendingMusicTrack> = new Map();

  constructor(eventBus: WorldEventBus) {
    this.eventBus = eventBus;
    this.initializeDefaultTracks();
  }

  private initializeDefaultTracks(): void {
    const defaults: TrendingMusicTrack[] = [
      {
        id: 'aud_lofi_focus',
        trackName: 'Midnight Chill Lofi',
        artistName: 'SynthWave Labs',
        bpm: 85,
        usageCount: 450000,
        viralityVelocity: 1250,
        vibeTag: 'Educational / Deep Work'
      },
      {
        id: 'aud_phonk_surge',
        trackName: 'Hyperdrive Phonk',
        artistName: 'Drift Masters',
        bpm: 140,
        usageCount: 890000,
        viralityVelocity: 3400,
        vibeTag: 'High Energy / Fast Cuts'
      },
      {
        id: 'aud_ambient_story',
        trackName: 'Cinematic Dawn',
        artistName: 'Aura Sound',
        bpm: 110,
        usageCount: 280000,
        viralityVelocity: 800,
        vibeTag: 'Storytelling / Emotional'
      }
    ];

    defaults.forEach(t => this.tracks.set(t.id, t));
  }

  public async processTick(simTimeSec: number): Promise<TrendingMusicTrack[]> {
    for (const track of this.tracks.values()) {
      track.usageCount += Math.round(track.viralityVelocity * 0.1);
      if (track.viralityVelocity > 3000) {
        await this.eventBus.publish({
          type: 'MUSIC_VIRAL',
          timestamp: new Date().toISOString(),
          simulatedTimeSec: simTimeSec,
          payload: { trackName: track.trackName, usageCount: track.usageCount }
        });
      }
    }
    return Array.from(this.tracks.values());
  }

  public getTracks(): TrendingMusicTrack[] {
    return Array.from(this.tracks.values());
  }
}
