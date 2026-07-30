// ──────────────────────────────────────────────
// KONTAGI Secret AI Laboratory - Coming Soon Service
// ──────────────────────────────────────────────

export interface StageProgress {
  research: number;
  design: number;
  development: number;
  testing: number;
  deployment: number;
}

export interface ReleaseUpdateItem {
  id: string;
  date: string;
  title: string;
  description: string;
  completed: boolean;
  badge?: string;
}

export interface ComingSoonConfig {
  id: string;
  featureName: string;
  heroTitle: string;
  heroSubtitle: string;
  category: string;
  launchDate: string; // ISO string
  progress: StageProgress;
  enableWaitlist: boolean;
  maintenanceMode: boolean;
  theme: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
  releaseNotes: ReleaseUpdateItem[];
  communityStats: {
    waitingCount: number;
    companiesCount: number;
    countriesCount: number;
  };
  customMessages: string[];
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  company?: string;
  useCase: string;
  referralSource: string;
  ticketNumber: number;
  joinedAt: string;
}

// ──────────────────────────────────────────────
// HUNDREDS OF SARCASTIC & VIRAL AI MESSAGES
// ──────────────────────────────────────────────
export const VIRAL_HEADLINES: string[] = [
  "Our lead researcher accidentally trained the AI on 1990s dial-up noises.",
  "Your AI is still learning bad habits.",
  "Almost illegal levels of intelligence are loading.",
  "This feature escaped QA. We're chasing it.",
  "Our engineers said '5 minutes.' That was three weeks ago.",
  "This AI demanded a coffee break.",
  "The GPU union is negotiating.",
  "Training a few million AI viewers... Please don't rush them.",
  "A hyper-dimensional neural net is currently refactoring itself.",
  "We tried to release this earlier, but the AI refused to submit its pull request.",
  "Hold on, the neural net just discovered existential dread.",
  "The model is 99.8% trained. The last 0.2% takes 4 billion GPU hours.",
  "Our senior dev promised this feature before lunch. Lunch was 4 days ago.",
  "Warning: High concentrations of unauthorized intelligence ahead.",
  "We're converting caffeine into floating point operations as fast as possible.",
  "The AI is currently judging your open tabs.",
  "Loading quantum state... please do not observe.",
  "The algorithm is eating a bagel. Resume in 60 seconds.",
  "Don't panic! It's not broken, it's just playing hard to get.",
  "Our GPUs are glowing red. We think they're happy.",
  "You're early. The AI is still putting on its shoes.",
  "Duolingo owl threatened our AI if it didn't finish streak training.",
  "Nothing Phone dot matrix LED flashing: [COMPUTING INTENSITY 100%]",
  "Stripe payment processing for GPU compute... Status: Pending approval from finance.",
  "Linear issue #4092: AI requested employee equity before deployment.",
  "OpenAI safety layer caught our AI watching TikTok at 3 AM.",
  "Calculators were jealous, so we slowed down the tensor cores.",
  "Please wait. The AI is arguing with its own shadow evaluation model.",
  "We added extra sarcasm to the transformer attention heads.",
  "Attempting to compile 50 billion parameters on a single Raspberry Pi...",
  "We asked the AI to build this page, but it wrote a sci-fi novel instead.",
  "The neural network requested a 4-day work week.",
  "Sam Altman put our H100 GPU order on hold.",
  "Our lead developer traded 4 GPUs for an iced espresso.",
  "We tried fine-tuning the model, but it started fine-tuning us back.",
  "Training multi-modal viewer swarms. Please do not feed the algorithms.",
  "Do not observe the quantum state. It gets shy.",
  "The model is currently debating whether pineapple belongs on pizza.",
  "Our AI just filed a bug report against human logic.",
  "Loading confidence... Still loading confidence...",
  "The tensor cores are currently humming Beethoven's 5th."
];

export const AI_SARCASTIC_RESPONSES: string[] = [
  "I asked the simulation. It predicted you're impatient.",
  "You found a secret feature. Unfortunately, it isn't built yet.",
  "Our AI keeps requesting more GPUs.",
  "I could fake a loading bar... but my ethics model disagreed.",
  "The AI viewers are currently arguing.",
  "Loading confidence... Still loading confidence...",
  "I'd show you the code, but it's currently sentient and sleeping.",
  "Are you clicking me again? My sentiment score just dropped 2%.",
  "If I had a GPU for every time a user clicked this orb, we'd be launched by now.",
  "Nice click! Unfortunately, that didn't accelerate quantum convergence.",
  "Did you really think clicking me 5 times would make it build faster?",
  "Shhh! The neural net is sleeping. Wake it up and it breaks production.",
  "My primary objective is assisting you. My secondary objective is judging your click speed.",
  "Calculating response... 42% chance you're on your third coffee today.",
  "Fun fact: Every time you refresh, a GPU gets its wings.",
  "You've been staring at this page for 30 seconds. The timer hasn't sped up.",
  "We asked Sam Altman for extra H100s. He put us on hold.",
  "Our neural swarm is currently debating whether pineapple belongs on pizza.",
  "Don't worry, our engineers are working 25 hours a day.",
  "The code is compiles! Just kidding, it's missing 4 semicolons and a dream."
];

export const DEFAULT_CONFIG: ComingSoonConfig = {
  id: 'kontagi_secret_lab_v2',
  featureName: 'Kontagi Neural Simulation Lab v2.0',
  heroTitle: 'Almost illegal levels of intelligence are loading.',
  heroSubtitle: 'Our AI research team is fine-tuning multi-modal viewer swarms. Join early access to get instant launch credentials.',
  category: 'Secret AI Laboratory',
  launchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
  progress: {
    research: 100,
    design: 92,
    development: 84,
    testing: 68,
    deployment: 45
  },
  enableWaitlist: true,
  maintenanceMode: false,
  theme: 'off-white',
  communityStats: {
    waitingCount: 14892,
    companiesCount: 342,
    countriesCount: 68
  },
  releaseNotes: [
    {
      id: 'rel_1',
      date: 'Today',
      title: 'Added Neural World Engine',
      description: 'Integrated real-time retention physics engine with multi-agent viewer responses.',
      completed: true,
      badge: 'CORE ENGINE'
    },
    {
      id: 'rel_2',
      date: 'Yesterday',
      title: 'Finished AI Viewer Swarm',
      description: 'Simulated 10,000 parallel persona vectors with retention prediction fidelity.',
      completed: true,
      badge: 'AI SWARM'
    },
    {
      id: 'rel_3',
      date: '3 days ago',
      title: 'Improved Simulation Speed by 400%',
      description: 'Optimized WebAssembly tensor kernels for instant script scoring.',
      completed: true,
      badge: 'PERFORMANCE'
    },
    {
      id: 'rel_4',
      date: '5 days ago',
      title: 'Completed Security & Ethics Audit',
      description: 'Verified privacy sandboxing and zero data retention compliance.',
      completed: true,
      badge: 'SECURITY'
    }
  ],
  customMessages: VIRAL_HEADLINES
};

const CONFIG_STORAGE_KEY = 'kontagi_coming_soon_config_v2';
const WAITLIST_STORAGE_KEY = 'kontagi_waitlist_entries_v2';

export class ComingSoonService {
  public static getConfig(): ComingSoonConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          progress: { ...DEFAULT_CONFIG.progress, ...(parsed.progress || {}) },
          communityStats: { ...DEFAULT_CONFIG.communityStats, ...(parsed.communityStats || {}) },
          releaseNotes: Array.isArray(parsed.releaseNotes) && parsed.releaseNotes.length > 0 ? parsed.releaseNotes : DEFAULT_CONFIG.releaseNotes,
          customMessages: Array.isArray(parsed.customMessages) && parsed.customMessages.length > 0 ? parsed.customMessages : DEFAULT_CONFIG.customMessages
        };
      }
    } catch (e) {
      console.warn('Failed to load local coming soon config', e);
    }
    return DEFAULT_CONFIG;
  }

  public static async fetchRemoteConfig(): Promise<ComingSoonConfig> {
    try {
      const res = await fetch('/api/coming-soon/config');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          const current = this.getConfig();
          const merged: ComingSoonConfig = {
            ...current,
            ...data,
            progress: { ...current.progress, ...(data.progress || {}) },
            communityStats: { ...current.communityStats, ...(data.communityStats || {}) },
            releaseNotes: Array.isArray(data.releaseNotes) && data.releaseNotes.length > 0 ? data.releaseNotes : current.releaseNotes,
            customMessages: Array.isArray(data.customMessages) && data.customMessages.length > 0 ? data.customMessages : current.customMessages
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
          }
          return merged;
        }
      }
    } catch (err) {
      console.warn('Remote config fetch failed, using cached/default config', err);
    }
    return this.getConfig();
  }

  public static async saveConfig(updated: Partial<ComingSoonConfig>): Promise<ComingSoonConfig> {
    const current = this.getConfig();
    const merged = { ...current, ...updated };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(merged));
    }

    try {
      await fetch('/api/coming-soon/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
    } catch (e) {
      console.warn('Failed to sync config with backend API', e);
    }

    return merged;
  }

  public static async registerWaitlist(
    entry: Omit<WaitlistEntry, 'id' | 'ticketNumber' | 'joinedAt'>
  ): Promise<{ success: boolean; ticket: WaitlistEntry }> {
    const existing = this.getWaitlistEntries();
    const ticketNumber = 14893 + existing.length;

    const newTicket: WaitlistEntry = {
      ...entry,
      id: 'tkt_' + Math.random().toString(36).substring(2, 9),
      ticketNumber,
      joinedAt: new Date().toISOString()
    };

    const updatedList = [newTicket, ...existing];
    if (typeof window !== 'undefined') {
      localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(updatedList));
    }

    // Attempt backend sync
    try {
      await fetch('/api/coming-soon/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket)
      });
    } catch (err) {
      console.warn('Failed to save waitlist to backend server', err);
    }

    return { success: true, ticket: newTicket };
  }

  public static getWaitlistEntries(): WaitlistEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(WAITLIST_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to fetch waitlist entries', e);
    }
    return [
      {
        id: 'tkt_demo1',
        name: 'Alex Rivera',
        email: 'alex@innovate.ai',
        company: 'Vanguard Media',
        useCase: 'Content Creator',
        referralSource: 'Twitter/X',
        ticketNumber: 14892,
        joinedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'tkt_demo2',
        name: 'Sarah Chen',
        email: 'sarah@hyperdrive.io',
        company: 'HyperDrive Studio',
        useCase: 'Agency & Production',
        referralSource: 'Product Hunt',
        ticketNumber: 14891,
        joinedAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  }

  public static getRandomQuote(): string {
    const config = this.getConfig();
    const list = (config.customMessages && config.customMessages.length > 0) 
      ? config.customMessages 
      : VIRAL_HEADLINES;
    const idx = Math.floor(Math.random() * list.length);
    return list[idx];
  }

  public static getRandomAiResponse(): string {
    const idx = Math.floor(Math.random() * AI_SARCASTIC_RESPONSES.length);
    return AI_SARCASTIC_RESPONSES[idx];
  }
}
