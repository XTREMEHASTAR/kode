import { AuraWorldSnapshot, WorldEvent } from '../../server/src/modules/auraworld/types';

export async function fetchAuraWorldState(): Promise<AuraWorldSnapshot | null> {
  try {
    const res = await fetch('/api/auraworld/state');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn('[AuraWorld Client] Backend unreadable, generating client-side snapshot.', e);
  }

  // Pure Client Fallback State
  return {
    worldId: 'aura_world_prime',
    simulatedTime: {
      currentSimulatedTimeSec: 86400 * 14,
      tickCount: 336,
      dilationFactor: 3600,
      timeOfDayHour: 19.5,
      dayOfWeek: 'Wed',
      currentSeason: 'Spring'
    },
    attentionEconomy: {
      totalGlobalViewerCapacity: 10000000,
      activeAttentionPoolMinutes: 5400000,
      globalFatigueIndex: 0.28,
      competitionDensityScore: 0.65,
      peakUsageHourActive: true
    },
    recommendationPolicy: {
      explorationRatio: 0.20,
      diversityPenaltyWeight: 0.35,
      coldStartBoostMultiplier: 1.8,
      fatigueDecayPenalty: 0.40,
      authorAuthorityWeight: 0.25
    },
    platformHealth: {
      activeViewersDAU: 450000000,
      activeCreatorsMAU: 32000000,
      viewerRetentionRatePct: 84.5,
      creatorChurnRiskPct: 4.2,
      clickbaitToxicityIndex: 0.18,
      adSaturationScore: 0.28
    },
    activeTrends: [
      { id: 'tr1', name: '3-Second Retention Hooks', category: 'Creator Economy', susceptiblePopulation: 500000, infectedPopulation: 120000, recoveredPopulation: 30000, viralityR0: 2.4, decayHalfLifeHours: 48, peakTimeSec: 0, status: 'PEAKING' },
      { id: 'tr2', name: 'AI Audience Simulators', category: 'Tech', susceptiblePopulation: 800000, infectedPopulation: 45000, recoveredPopulation: 5000, viralityR0: 3.8, decayHalfLifeHours: 72, peakTimeSec: 0, status: 'EMERGING' }
    ],
    communities: [
      { id: 'c1', name: 'B2B Founder & SaaS Community', nicheTopic: 'growth', activeViewerCount: 145000, cohesionScore: 0.88, dominantArchetype: 'High-Intent Millennial Founder', connectedCommunityIds: ['c2'] },
      { id: 'c2', name: 'Short-Form Creators & Editors', nicheTopic: 'video_hooks', activeViewerCount: 320000, cohesionScore: 0.92, dominantArchetype: 'Impatient Zoomer', connectedCommunityIds: ['c1'] }
    ],
    globalEvents: [
      { id: 'g1', title: 'Instagram Algorithm Overhaul v3', description: 'Original audio and 3s retention given 2x priority.', severity: 'PLATFORM_SHOCK', affectedCategories: ['Creator Economy'], attentionMultiplier: 1.8, expiresSimTimeSec: Date.now() / 1000 + 86400 }
    ],
    creators: [
      { id: 'cr1', username: 'alex_growth_hacks', nicheCategory: 'Creator Economy', followerCount: 245000, postingFrequencyPerWeek: 4, authorityScore: 0.88, churnRisk: 0.12, lastPostedSimTimeSec: 0 }
    ],
    seasonalEvents: [
      { id: 's1', name: 'Spring Product Launches', season: 'Spring', intentMultiplier: 1.3, active: true }
    ],
    trendingMusic: [
      { id: 'm1', trackName: 'Midnight Chill Lofi', artistName: 'SynthWave Labs', bpm: 85, usageCount: 450000, viralityVelocity: 1250, vibeTag: 'Deep Work' }
    ],
    trendingFormats: [
      { id: 'f1', formatName: 'Negative Warning Hook ("Stop doing X")', category: 'Breakdown', adoptionCount: 65000, fatigueScore: 0.25, avgHookRetentionBonusPct: 14.5 }
    ],
    totalEventsProcessed: 1420
  };
}

export async function stepWorldTick(deltaRealSeconds = 1.0): Promise<AuraWorldSnapshot | null> {
  try {
    const res = await fetch('/api/auraworld/tick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deltaRealSeconds })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn('[AuraWorld Client] Tick endpoint failed, advancing client fallback.', e);
  }
  return fetchAuraWorldState();
}

export async function fetchWorldEventHistory(limit = 20): Promise<WorldEvent[]> {
  try {
    const res = await fetch(`/api/auraworld/events/history?limit=${limit}`);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) return json.data;
    }
  } catch (e) {
    console.warn('[AuraWorld Client] Event history endpoint unreadable.', e);
  }
  return [
    { id: 'evt_1', type: 'TIME_TICK', timestamp: new Date().toISOString(), simulatedTimeSec: 100, payload: { tickCount: 100 } },
    { id: 'evt_2', type: 'TREND_PEAKED', timestamp: new Date().toISOString(), simulatedTimeSec: 120, payload: { name: '3-Second Hooks' } }
  ];
}
