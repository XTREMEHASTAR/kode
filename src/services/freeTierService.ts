import { FreeTierScript } from '../types/freeTier';
import { analyzeScriptText } from './scriptAnalysisEngine';
import { getAuthHeaders } from './authService';

const STORAGE_KEY = 'kontagi-free-tier-scripts';
const QUOTA_STORAGE_KEY = 'kontagi-free-tier-quota';

let _cachedServerUsage: { used: number; limit: number; remaining: number; resetAt: string; isPro: boolean } | null = null;

// Helper to get date string key (YYYY-MM-DD)
function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
}

// Default pre-populated scripts (enrich with new fields)
const defaultScripts: FreeTierScript[] = [
  {
    id: 'script-1',
    title: 'How I Went From 0 to 10K Followers',
    scriptText: `I went from 0 to 10,000 followers in under 30 days. And no, it wasn't luck. In this video, I'm going to share the exact 3-step strategy that changed everything for me. It's so simple you can start doing it today.\n\nFirst, you need to optimize your profile. Make your bio a billboard that states exactly who you help. Second, create content around 3 core pillars. Stop posting random videos. Third, engage with 10 accounts in your niche every day before posting.\n\nIf you want to grow your audience, make sure to follow for more tips.`,
    contentType: 'TikTok',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    hookScore: 85,
    isFavorite: true,
    wordCount: 152,
    characterCount: 618,
    estimatedSpeakingTime: 61,
    hookText: 'I went from 0 to 10,000 followers in under 30 days. And no, it wasn\'t luck.',
    signals: ['Pattern Interrupt', 'Curiosity Gap', 'Direct Address'],
    engineVersion: '1.0.0',
    analysisMode: 'Rule-Based Analysis',
    analysisConfidence: 'High',
    analysisResult: {
      hookScore: 85,
      hookStatus: 'Excellent Hook',
      hookSupportingText: 'This hook is highly engaging and employs multiple scroll-stopping triggers.',
      scoreBreakdown: {
        attention: 90,
        interest: 85,
        clarity: 85,
        relevance: 80,
        emotionalImpact: 75
      },
      insights: {
        positive: [
          'Strong pattern interrupt opening ("stop", "wait") immediately halts browser scrolling.',
          'The hook introduces an information gap ("secret", "hack") which encourages watch time.'
        ],
        improvement: [
          'Avoid starting with greetings like "Hey everyone" to speed up pacing.'
        ]
      },
      suggestions: [
        {
          title: 'Use visual cues in the first 2 seconds.',
          explanation: 'Overlaying bold text on screen drives higher scroll stop probability.',
          example: 'Example: Display hook keywords as large centered text.'
        }
      ],
      scriptReview: {
        hook: {
          text: 'I went from 0 to 10,000 followers in under 30 days. And no, it wasn\'t luck.',
          works: 'Very strong promise. Stating the 30-day time bound adds high credibility and grabs attention.',
          improve: 'Could benefit from a slightly more emotional hook keyword or sensory element.',
          rewrite: 'Here\'s how I went from 0 to 10,000 followers in just 30 days using a simple 3-step strategy. Best part? You can copy it today.'
        },
        body: {
          text: 'First, you need to optimize your profile. Make your bio a billboard that states exactly who you help. Second, create content around 3 core pillars. Stop posting random videos. Third, engage with 10 accounts in your niche every day before posting.',
          works: 'Clear list formatting. Easy for viewers to follow along and digest the action steps.',
          improve: 'Avoid generic advice. Add a specific visual or concrete metric to support the first step.',
          rewrite: 'Step 1: Bio. Turn it into a billboard showing exactly who you serve. Step 2: Content. Pick 3 pillars and stick to them. Step 3: Engagement. Interact with 10 accounts in your niche daily.'
        },
        cta: {
          text: 'If you want to grow your audience, make sure to follow for more tips.',
          works: 'Clear value alignment with the content topic (growth tips).',
          improve: 'A bit passive. Ask them to take a single, urgent action.',
          rewrite: 'Hit follow if you want to grow your account this month.'
        }
      },
      structure: {
        hook: 'I went from 0 to 10,000 followers in under 30 days. And no, it wasn\'t luck.',
        body: 'First, you need to optimize your profile. Make your bio a billboard that states exactly who you help. Second, create content around 3 core pillars. Stop posting random videos. Third, engage with 10 accounts in your niche every day before posting.',
        cta: 'If you want to grow your audience, make sure to follow for more tips.'
      },
      ctaDetected: true
    }
  },
  {
    id: 'script-2',
    title: '3 Mistakes That Ruin Your Videos',
    scriptText: `Hey guys! Today I'm going to share 3 massive mistakes that are absolutely ruining your video performance. If you aren't getting views, this is probably why.\n\nMistake number one is boring backgrounds. If your background is messy or blank, people scroll. Mistake two is low audio. If they can't hear you clearly, they are gone in two seconds. Mistake three is not having a clear call to action.\n\nSubscribe for more tips!`,
    contentType: 'Instagram Reel',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    hookScore: 72,
    isFavorite: false,
    wordCount: 88,
    characterCount: 395,
    estimatedSpeakingTime: 35,
    hookText: 'Hey guys! Today I\'m going to share 3 massive mistakes that are absolutely ruining your video performance.',
    signals: ['List Hook', 'Direct Address'],
    engineVersion: '1.0.0',
    analysisMode: 'Rule-Based Analysis',
    analysisConfidence: 'High',
    analysisResult: {
      hookScore: 72,
      hookStatus: 'Good Foundation',
      hookSupportingText: 'Your hook is decent but could be polished for higher immediate retention.',
      scoreBreakdown: {
        attention: 75,
        interest: 70,
        clarity: 80,
        relevance: 72,
        emotionalImpact: 65
      },
      insights: {
        positive: [
          'Direct and easy to follow structure.',
          'Clearly promises to solve problems for the viewer.'
        ],
        improvement: [
          'The first line feels a bit slow due to friendly greeting.'
        ]
      },
      suggestions: [
        {
          title: 'Cut the introduction and jump right into the first mistake.',
          explanation: 'Viewers scroll away if you spend the first 3 seconds saying "Hi, my name is..." or "Hey guys!"',
          example: 'Example: "These 3 silent mistakes are killing your video views..."'
        }
      ],
      scriptReview: {
        hook: {
          text: 'Hey guys! Today I\'m going to share 3 massive mistakes that are absolutely ruining your video performance. If you aren\'t getting views, this is probably why.',
          works: 'Directly addresses a common pain point (low views).',
          improve: 'Eliminate the friendly greeting; it delays the main value hook.',
          rewrite: 'These 3 silent mistakes are absolutely killing your video views.'
        },
        body: {
          text: 'Mistake number one is boring backgrounds. If your background is messy or blank, people scroll. Mistake two is low audio. If they can\'t hear you clearly, they are gone in two seconds. Mistake three is not having a clear call to action.',
          works: 'Good pacing, states the problem and negative consequence.',
          improve: 'Provide a quick fix for each mistake instead of just stating them.',
          rewrite: '1. Messy backgrounds (fix: sit in clean lighting). 2. Muffled audio (fix: use a lapel mic). 3. No call to action (fix: tell them what to do next).'
        },
        cta: {
          text: 'Subscribe for more tips!',
          works: 'Clear request.',
          improve: 'Give a specific reason to subscribe.',
          rewrite: 'Follow if you want to double your watch time.'
        }
      },
      structure: {
        hook: 'Hey guys! Today I\'m going to share 3 massive mistakes that are absolutely ruining your video performance. If you aren\'t getting views, this is probably why.',
        body: 'Mistake number one is boring backgrounds. If your background is messy or blank, people scroll. Mistake two is low audio. If they can\'t hear you clearly, they are gone in two seconds. Mistake three is not having a clear call to action.',
        cta: 'Subscribe for more tips!'
      },
      ctaDetected: true
    }
  }
];

function getStoredScripts(): FreeTierScript[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultScripts));
    return defaultScripts;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return defaultScripts;
  }
}

function saveStoredScripts(scripts: FreeTierScript[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
}

// Quota helper functions
function getQuotaData(): { date: string; count: number } {
  const today = getTodayDateString();
  const saved = localStorage.getItem(QUOTA_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed;
      }
    } catch (e) {}
  }
  const newData = { date: today, count: 0 };
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(newData));
  return newData;
}

function saveQuotaData(count: number) {
  const today = getTodayDateString();
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({ date: today, count }));
}

// Helper to get active user ID
function getActiveUserId(): string | undefined {
  try {
    const raw = localStorage.getItem('kontagi_auth_session');
    if (!raw) return undefined;
    const session = JSON.parse(raw);
    return session?.user?.id;
  } catch {
    return undefined;
  }
}

import { scriptCloudService } from './scriptCloudService';

export const freeTierService = {
  getScripts(userId?: string): FreeTierScript[] {
    const activeId = userId || getActiveUserId();
    const all = getStoredScripts();
    if (!activeId) {
      return all;
    }
    return all.filter(s => !s.userId || s.userId === activeId || s.legacyLocal);
  },

  async fetchScriptsAsync(userId?: string): Promise<FreeTierScript[]> {
    const activeId = userId || getActiveUserId();
    if (!activeId) return this.getScripts(userId);
    try {
      const cloudScripts = await scriptCloudService.fetchScripts();
      // Reconcile local storage cache with cloud scripts
      const allStored = getStoredScripts();
      const otherUserScripts = allStored.filter(s => s.userId && s.userId !== activeId && !s.legacyLocal);
      
      // Update or insert cloud scripts for active user
      const updatedList = [...cloudScripts, ...otherUserScripts];
      saveStoredScripts(updatedList);
      return this.getScripts(userId);
    } catch (e) {
      console.warn("[Cloud Sync Warning] Failed to fetch scripts from cloud, using cache.", e);
      return this.getScripts(userId);
    }
  },

  getScript(id: string, userId?: string): FreeTierScript | undefined {
    const all = getStoredScripts();
    const script = all.find(s => s.id === id);
    return script;
  },

  async getScriptAsync(id: string, userId?: string): Promise<FreeTierScript | undefined> {
    const activeId = userId || getActiveUserId();
    try {
      const cloudScript = await scriptCloudService.fetchScriptById(id);
      if (cloudScript) {
        if (cloudScript.userId && activeId && cloudScript.userId !== activeId) {
          console.warn(`[Security Alert] Cloud access denied to script ${id} for user ${activeId}.`);
          return undefined;
        }
        // Update local cache
        const scripts = getStoredScripts();
        const idx = scripts.findIndex(s => s.id === id);
        if (idx !== -1) {
          scripts[idx] = cloudScript;
        } else {
          scripts.unshift(cloudScript);
        }
        saveStoredScripts(scripts);
        return cloudScript;
      }
    } catch (e) {
      console.warn(`[Cloud Sync Warning] Failed to fetch script ${id} from cloud, using cache.`, e);
    }
    return this.getScript(id, userId);
  },

  updateScript(id: string, updates: Partial<FreeTierScript>, userId?: string): FreeTierScript {
    const activeId = userId || getActiveUserId();
    const scripts = getStoredScripts();
    const idx = scripts.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (scripts[idx].userId && activeId && scripts[idx].userId !== activeId) {
        throw new Error('Unauthorized: You do not own this script.');
      }
      scripts[idx] = { 
        ...scripts[idx], 
        ...updates,
        analysisResult: updates.analysisResult 
          ? { ...scripts[idx].analysisResult, ...updates.analysisResult } 
          : scripts[idx].analysisResult
      };
      saveStoredScripts(scripts);

      // Async push to cloud source of truth
      scriptCloudService.updateScript(id, updates).catch(err => {
        console.warn(`[Cloud Sync Error] Failed to update script ${id} on cloud.`, err);
      });

      return scripts[idx];
    }
    throw new Error('Script not found');
  },

  renameScript(id: string, newTitle: string, userId?: string): FreeTierScript {
    const activeId = userId || getActiveUserId();
    const scripts = getStoredScripts();
    const idx = scripts.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (scripts[idx].userId && activeId && scripts[idx].userId !== activeId) {
        throw new Error('Unauthorized: You do not own this script.');
      }
      scripts[idx].title = newTitle;
      saveStoredScripts(scripts);

      // Async push to cloud source of truth
      scriptCloudService.renameScript(id, newTitle).catch(err => {
        console.warn(`[Cloud Sync Error] Failed to rename script ${id} on cloud.`, err);
      });

      return scripts[idx];
    }
    throw new Error('Script not found');
  },

  toggleFavorite(id: string, userId?: string): FreeTierScript {
    const activeId = userId || getActiveUserId();
    const scripts = getStoredScripts();
    const idx = scripts.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (scripts[idx].userId && activeId && scripts[idx].userId !== activeId) {
        throw new Error('Unauthorized: You do not own this script.');
      }
      const newFav = !scripts[idx].isFavorite;
      scripts[idx].isFavorite = newFav;
      saveStoredScripts(scripts);

      // Async push to cloud source of truth
      scriptCloudService.toggleFavorite(id, newFav).catch(err => {
        console.warn(`[Cloud Sync Error] Failed to toggle favorite script ${id} on cloud.`, err);
      });

      return scripts[idx];
    }
    throw new Error('Script not found');
  },

  deleteScript(id: string, userId?: string): void {
    const activeId = userId || getActiveUserId();
    const scripts = getStoredScripts();
    const idx = scripts.findIndex(s => s.id === id);
    if (idx !== -1) {
      if (scripts[idx].userId && activeId && scripts[idx].userId !== activeId) {
        throw new Error('Unauthorized: You do not own this script.');
      }
      const filtered = scripts.filter(s => s.id !== id);
      saveStoredScripts(filtered);

      // Async push to cloud source of truth
      scriptCloudService.deleteScript(id).catch(err => {
        console.warn(`[Cloud Sync Error] Failed to delete script ${id} on cloud.`, err);
      });
    }
  },

  // Quota Methods
  isProActive(): boolean {
    try {
      const globalRaw = localStorage.getItem('kontagi_active_sub');
      if (globalRaw) {
        const sub = JSON.parse(globalRaw);
        if (sub.plan === 'pro' && sub.status === 'active') return true;
      }
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('kontagi_active_sub')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const sub = JSON.parse(raw);
            if (sub.plan === 'pro' && sub.status === 'active') return true;
          }
        }
      }
    } catch (e) {}
    return false;
  },

  async syncBackendUsage(): Promise<{ used: number; limit: number; remaining: number; resetAt: string; isPro: boolean }> {
    const authHeaders = getAuthHeaders();
    if (!authHeaders['Authorization'] && !authHeaders['x-user-id']) {
      return _cachedServerUsage || {
        used: getQuotaData().count,
        limit: 3,
        remaining: Math.max(0, 3 - getQuotaData().count),
        resetAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        isPro: this.isProActive()
      };
    }
    try {
      const res = await fetch('/api/usage', {
        method: 'GET',
        headers: authHeaders,
        credentials: 'include'
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          _cachedServerUsage = json.data;
          saveQuotaData(json.data.used);
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[Usage API] Failed to fetch usage from backend:', e);
    }
    return _cachedServerUsage || {
      used: getQuotaData().count,
      limit: 3,
      remaining: Math.max(0, 3 - getQuotaData().count),
      resetAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      isPro: this.isProActive()
    };
  },

  getRemainingQuota(): number {
    if (this.isProActive()) {
      return 99999;
    }
    if (_cachedServerUsage) {
      return _cachedServerUsage.remaining;
    }
    const quota = getQuotaData();
    return Math.max(0, 3 - quota.count);
  },

  incrementQuota(): void {
    if (this.isProActive()) return;
    if (_cachedServerUsage) {
      _cachedServerUsage.used += 1;
      _cachedServerUsage.remaining = Math.max(0, _cachedServerUsage.limit - _cachedServerUsage.used);
    }
    const quota = getQuotaData();
    saveQuotaData(quota.count + 1);
  },

  hasQuotaRemaining(): boolean {
    if (this.isProActive()) return true;
    return this.getRemainingQuota() > 0;
  },

  resetQuotaForTest(): void {
    const today = getTodayDateString();
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
  },

  createScript(title: string, scriptText: string, contentType: string = 'Other', userId?: string): FreeTierScript {
    if (!this.hasQuotaRemaining()) {
      throw new Error('Daily free limit reached (3/3 used). Resets at midnight UTC.');
    }

    const activeUserId = userId || getActiveUserId();
    const scripts = getStoredScripts();
    
    // 1. Run deterministic real analysis engine
    const analysis = analyzeScriptText(scriptText, contentType);

    // 2. Title generation logic if empty
    let finalTitle = title ? title.trim() : '';
    if (!finalTitle) {
      const sentences = scriptText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
      const firstSentence = sentences[0] || '';
      const words = firstSentence.split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        finalTitle = words.slice(0, 7).join(' ');
        if (words.length > 7) {
          finalTitle += '...';
        }
      } else {
        finalTitle = 'Untitled Script';
      }
    }

    const newScript: FreeTierScript = {
      id: 'script-' + Math.random().toString(36).substring(2, 11),
      userId: activeUserId,
      legacyLocal: true,
      title: finalTitle,
      scriptText,
      originalScriptText: scriptText,
      versions: [
        {
          id: 'v-original',
          name: 'Original Version',
          scriptText,
          hookScore: analysis.hookScore,
          createdAt: new Date().toISOString(),
          type: 'original'
        }
      ],
      contentType,
      createdAt: new Date().toISOString(),
      hookScore: analysis.hookScore,
      isFavorite: false,
      wordCount: analysis.wordCount,
      characterCount: analysis.characterCount,
      estimatedSpeakingTime: analysis.estimatedSpeakingTime,
      hookText: analysis.hookText,
      signals: analysis.signals,
      engineVersion: '1.0.0',
      analysisMode: 'Rule-Based Analysis',
      analysisConfidence: analysis.analysisConfidence,
      analysisResult: {
        hookScore: analysis.hookScore,
        hookStatus: analysis.hookStatus,
        hookSupportingText: analysis.hookSupportingText,
        scoreBreakdown: analysis.scoreBreakdown,
        insights: analysis.insights,
        suggestions: analysis.suggestions,
        scriptReview: analysis.scriptReview,
        structure: analysis.structure,
        ctaDetected: analysis.ctaDetected
      }
    };

    // Increment user quota usage
    this.incrementQuota();

    // Prepend new script to local cache
    scripts.unshift(newScript);
    saveStoredScripts(scripts);

    // Async save to Cloud Source of Truth (enforces backend quota)
    scriptCloudService.saveScript(newScript).catch(err => {
      console.warn("[Cloud Sync Error] Failed to save new script to cloud.", err);
    });

    return newScript;
  },

  async createScriptAsync(title: string, scriptText: string, contentType: string = 'Other', userId?: string): Promise<FreeTierScript> {
    const isPro = this.isProActive();
    if (!isPro && this.getRemainingQuota() <= 0) {
      throw new Error('Daily free limit reached (3/3 used). Resets at midnight UTC.');
    }

    const activeUserId = userId || getActiveUserId();
    const analysis = analyzeScriptText(scriptText, contentType);

    let finalTitle = title ? title.trim() : '';
    if (!finalTitle) {
      const sentences = scriptText.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
      const firstSentence = sentences[0] || '';
      const words = firstSentence.split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        finalTitle = words.slice(0, 7).join(' ');
        if (words.length > 7) {
          finalTitle += '...';
        }
      } else {
        finalTitle = 'Untitled Script';
      }
    }

    const scriptDataPayload: Partial<FreeTierScript> = {
      userId: activeUserId,
      title: finalTitle,
      scriptText,
      originalScriptText: scriptText,
      contentType,
      hookScore: analysis.hookScore,
      wordCount: analysis.wordCount,
      characterCount: analysis.characterCount,
      estimatedSpeakingTime: analysis.estimatedSpeakingTime,
      hookText: analysis.hookText,
      signals: analysis.signals,
      analysisResult: {
        hookScore: analysis.hookScore,
        hookStatus: analysis.hookStatus,
        hookSupportingText: analysis.hookSupportingText,
        scoreBreakdown: analysis.scoreBreakdown,
        insights: analysis.insights,
        suggestions: analysis.suggestions,
        scriptReview: analysis.scriptReview,
        structure: analysis.structure,
        ctaDetected: analysis.ctaDetected
      }
    };

    // Save to backend database via API (triggers enforceUsageLimit('analyses') on server)
    const saved = await scriptCloudService.saveScript(scriptDataPayload);

    this.incrementQuota();
    this.syncBackendUsage().catch(() => {});

    const scripts = getStoredScripts();
    scripts.unshift(saved);
    saveStoredScripts(scripts);

    return saved;
  }
};

