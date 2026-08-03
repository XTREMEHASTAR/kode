// ──────────────────────────────────────────────
// KONTAGI Enterprise Feature Registry
// ──────────────────────────────────────────────

import { LAUNCH_CONFIG } from '../config/launch.config';

export type FeatureStage =
  | 'LAUNCH_READY'
  | 'BETA'
  | 'INTERNAL'
  | 'EXPERIMENTAL'
  | 'INCOMPLETE'
  | 'ADMIN_ONLY'
  | 'DEPRECATED';

export type FeatureFlagKey =
  | 'FEATURE_SCRIPT_INTELLIGENCE'
  | 'FEATURE_SCRIPT_LIBRARY'
  | 'FEATURE_HOOK_SCORE'
  | 'FEATURE_AI_COPILOT'
  | 'FEATURE_BILLING'
  | 'FEATURE_AUTH_SECURITY'
  | 'FEATURE_ADMIN_PANEL'
  | 'FEATURE_CREATIVE_LIBRARY'
  | 'FEATURE_PERFORMANCE_MEMORY'
  | 'FEATURE_HOOK_INTEL'
  | 'FEATURE_RETENTION_SIMULATOR'
  | 'FEATURE_THUMBNAIL_INTEL'
  | 'FEATURE_CAPTION_INTEL'
  | 'FEATURE_AUDIO_INTEL'
  | 'FEATURE_VISUAL_INTEL'
  | 'FEATURE_AUDIENCE_INTEL'
  | 'FEATURE_UPLOAD_CENTER'
  | 'FEATURE_CREATIVE_LAB'
  | 'FEATURE_AI_REPORTS'
  | 'FEATURE_AURA_AI'
  | 'FEATURE_ANALYTICS_V2'
  | 'FEATURE_WORKSPACES'
  | 'FEATURE_ENTERPRISE'
  | 'FEATURE_MOBILE_PAIRING'
  | 'FEATURE_DESIGN_SYSTEM';

export interface FeatureMetadata {
  id: string;
  key: FeatureFlagKey;
  name: string;
  stage: FeatureStage;
  enabled: boolean;
  visibleInNavigation: boolean;
  requiredRole: 'USER' | 'PRO' | 'ADMIN' | 'SUPER_ADMIN' | 'INTERNAL';
  requiredPlan: 'free' | 'pro';
  launchVersion: string;
  category: 'Core AI' | 'Monetization' | 'Telemetry' | 'Labs & Experimental' | 'Internal';
  description: string;
}

export const FEATURE_REGISTRY: Record<FeatureFlagKey, FeatureMetadata> = {
  FEATURE_SCRIPT_INTELLIGENCE: {
    id: 'feat_script_intel',
    key: 'FEATURE_SCRIPT_INTELLIGENCE',
    name: 'Script Intelligence Engine',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Core AI',
    description: '0–3s hook velocity analysis, word count metrics, and speaking time calculation.'
  },
  FEATURE_SCRIPT_LIBRARY: {
    id: 'feat_script_lib',
    key: 'FEATURE_SCRIPT_LIBRARY',
    name: 'Script Analysis Library',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Core AI',
    description: 'PostgreSQL-backed script library with TXT export and favorites tagging.'
  },
  FEATURE_HOOK_SCORE: {
    id: 'feat_hook_score',
    key: 'FEATURE_HOOK_SCORE',
    name: 'Orbital Hook Score Gauge',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Core AI',
    description: '0–100 hook rating gauge with detailed curiosity and velocity signal breakdown.'
  },
  FEATURE_AI_COPILOT: {
    id: 'feat_ai_copilot',
    key: 'FEATURE_AI_COPILOT',
    name: 'AI Copilot Rewriter',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Core AI',
    description: 'Pattern-interrupt opening hook optimizer and full script rewriter.'
  },
  FEATURE_BILLING: {
    id: 'feat_billing',
    key: 'FEATURE_BILLING',
    name: 'Pro Entitlements & Billing',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Monetization',
    description: 'Stripe & Razorpay payment verification with server-enforced quotas.'
  },
  FEATURE_AUTH_SECURITY: {
    id: 'feat_auth_security',
    key: 'FEATURE_AUTH_SECURITY',
    name: 'Authentication & Session Isolation',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: false,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Core AI',
    description: 'JWT token validation, password resets, and per-user storage isolation.'
  },
  FEATURE_ADMIN_PANEL: {
    id: 'feat_admin_panel',
    key: 'FEATURE_ADMIN_PANEL',
    name: 'Launch Command Center',
    stage: 'ADMIN_ONLY',
    enabled: true,
    visibleInNavigation: false,
    requiredRole: 'ADMIN',
    requiredPlan: 'pro',
    launchVersion: '1.0.0-admin',
    category: 'Telemetry',
    description: 'Real-time infrastructure health, Redis memory, and system metrics dashboard.'
  },

  // ── LABS & EXPERIMENTAL MODULES (Enabled for Pro Development) ──
  FEATURE_CREATIVE_LIBRARY: {
    id: 'feat_creative_lib',
    key: 'FEATURE_CREATIVE_LIBRARY',
    name: 'Creative Asset Library',
    stage: 'BETA',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.1.0',
    category: 'Labs & Experimental',
    description: 'Video asset cloud storage and media indexing.'
  },
  FEATURE_PERFORMANCE_MEMORY: {
    id: 'feat_perf_mem',
    key: 'FEATURE_PERFORMANCE_MEMORY',
    name: 'Performance Memory Bank',
    stage: 'BETA',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.1.0',
    category: 'Labs & Experimental',
    description: 'Historical performance variance tracking.'
  },
  FEATURE_HOOK_INTEL: {
    id: 'feat_hook_intel',
    key: 'FEATURE_HOOK_INTEL',
    name: 'Hook Intelligence Deep Dive',
    stage: 'LAUNCH_READY',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'USER',
    requiredPlan: 'free',
    launchVersion: '1.0.0',
    category: 'Core AI',
    description: 'Video hook frame analysis.'
  },
  FEATURE_RETENTION_SIMULATOR: {
    id: 'feat_retention_sim',
    key: 'FEATURE_RETENTION_SIMULATOR',
    name: 'Retention Simulator Engine',
    stage: 'BETA',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.1.0',
    category: 'Labs & Experimental',
    description: '0–3s viewer retention forecasting curve.'
  },
  FEATURE_THUMBNAIL_INTEL: {
    id: 'feat_thumb_intel',
    key: 'FEATURE_THUMBNAIL_INTEL',
    name: 'Thumbnail Intelligence',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Visual thumbnail heatmap forecasting.'
  },
  FEATURE_CAPTION_INTEL: {
    id: 'feat_caption_intel',
    key: 'FEATURE_CAPTION_INTEL',
    name: 'Caption & Metadata Intelligence',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Hashtag & SEO caption optimizer.'
  },
  FEATURE_AUDIO_INTEL: {
    id: 'feat_audio_intel',
    key: 'FEATURE_AUDIO_INTEL',
    name: 'Audio Intelligence',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Speech pacing and audio clarity metrics.'
  },
  FEATURE_VISUAL_INTEL: {
    id: 'feat_visual_intel',
    key: 'FEATURE_VISUAL_INTEL',
    name: 'Visual Intelligence',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Frame composition and scene cut rate analyzer.'
  },
  FEATURE_AUDIENCE_INTEL: {
    id: 'feat_aud_intel',
    key: 'FEATURE_AUDIENCE_INTEL',
    name: 'Target Audience Matcher',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Demographic resonance scoring.'
  },
  FEATURE_UPLOAD_CENTER: {
    id: 'feat_upload_center',
    key: 'FEATURE_UPLOAD_CENTER',
    name: 'Video Upload Center',
    stage: 'BETA',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.1.0',
    category: 'Labs & Experimental',
    description: 'Multi-file video ingestion panel.'
  },
  FEATURE_CREATIVE_LAB: {
    id: 'feat_creative_lab',
    key: 'FEATURE_CREATIVE_LAB',
    name: 'AI Creative Lab',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Generative script variant playground.'
  },
  FEATURE_AI_REPORTS: {
    id: 'feat_ai_reports',
    key: 'FEATURE_AI_REPORTS',
    name: 'AI Comprehensive Reports',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'PDF/TXT executive campaign summary generator.'
  },
  FEATURE_AURA_AI: {
    id: 'feat_aura_ai',
    key: 'FEATURE_AURA_AI',
    name: 'Aura AI Agent Drawer',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '1.2.0',
    category: 'Labs & Experimental',
    description: 'Interactive AI drawer chat assistant.'
  },
  FEATURE_ANALYTICS_V2: {
    id: 'feat_analytics_v2',
    key: 'FEATURE_ANALYTICS_V2',
    name: 'Viral Trend Radar & AI Performance Coach',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '2.0.0',
    category: 'Labs & Experimental',
    description: 'Predictive audience trend radar and automated coaching.'
  },
  FEATURE_WORKSPACES: {
    id: 'feat_workspaces',
    key: 'FEATURE_WORKSPACES',
    name: 'Multi-Creator Brand Kits & CRM',
    stage: 'EXPERIMENTAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'PRO',
    requiredPlan: 'pro',
    launchVersion: '2.0.0',
    category: 'Labs & Experimental',
    description: 'Influencer database and multi-creator brand asset synchronization.'
  },
  FEATURE_ENTERPRISE: {
    id: 'feat_enterprise',
    key: 'FEATURE_ENTERPRISE',
    name: 'Enterprise Teams & Client Portal',
    stage: 'INCOMPLETE',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'SUPER_ADMIN',
    requiredPlan: 'pro',
    launchVersion: '2.0.0',
    category: 'Labs & Experimental',
    description: 'White-label agency portal and multi-user team RBAC.'
  },
  FEATURE_MOBILE_PAIRING: {
    id: 'feat_mobile_pairing',
    key: 'FEATURE_MOBILE_PAIRING',
    name: 'Native Mobile Companion App',
    stage: 'INCOMPLETE',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'SUPER_ADMIN',
    requiredPlan: 'pro',
    launchVersion: '2.0.0',
    category: 'Labs & Experimental',
    description: 'iOS & Android mobile pairing protocol.'
  },
  FEATURE_DESIGN_SYSTEM: {
    id: 'feat_design_sys',
    key: 'FEATURE_DESIGN_SYSTEM',
    name: 'Design System & UI Tokens Playground',
    stage: 'INTERNAL',
    enabled: true,
    visibleInNavigation: true,
    requiredRole: 'INTERNAL',
    requiredPlan: 'free',
    launchVersion: 'Internal',
    category: 'Internal',
    description: 'Developer component playground and token testing suite.'
  }
};

export class FeatureRegistryService {
  public static getFeature(key: FeatureFlagKey): FeatureMetadata {
    return FEATURE_REGISTRY[key];
  }

  public static isLaunchReady(key: FeatureFlagKey): boolean {
    const feat = FEATURE_REGISTRY[key];
    return feat ? feat.stage === 'LAUNCH_READY' || feat.stage === 'ADMIN_ONLY' : false;
  }

  public static isNavVisible(key: FeatureFlagKey): boolean {
    const feat = FEATURE_REGISTRY[key];
    if (!feat) return false;
    // Check runtime override if set
    if (typeof window !== 'undefined') {
      const override = localStorage.getItem(`kontagi_ff_${key}`);
      if (override !== null) {
        return override === 'true';
      }
    }
    return feat.enabled && feat.visibleInNavigation;
  }

  public static getLaunchReadyFeatures(): FeatureMetadata[] {
    return Object.values(FEATURE_REGISTRY).filter((f) => f.stage === 'LAUNCH_READY');
  }

  public static getLabsFeatures(): FeatureMetadata[] {
    return Object.values(FEATURE_REGISTRY).filter((f) => f.stage !== 'LAUNCH_READY' && f.stage !== 'ADMIN_ONLY');
  }
}
