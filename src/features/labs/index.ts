// ──────────────────────────────────────────────
// KONTAGI Labs Architecture — Experimental & Future Modules
//
// All components, services, and hooks in Labs remain 100% intact,
// fully typed, and compilable. To activate any module in production,
// change its flag stage to 'LAUNCH_READY' in featureRegistry.ts.
// ──────────────────────────────────────────────

import { FEATURE_REGISTRY, FeatureMetadata } from '../../services/featureRegistry';

export interface LabsModule {
  id: string;
  name: string;
  stage: string;
  targetRelease: string;
  description: string;
}

export const LABS_MODULES: LabsModule[] = [
  {
    id: 'labs_creative_lib',
    name: 'Creative Asset Library',
    stage: 'BETA',
    targetRelease: 'v1.1.0',
    description: 'Video asset cloud storage and media indexing.'
  },
  {
    id: 'labs_perf_mem',
    name: 'Performance Memory Bank',
    stage: 'BETA',
    targetRelease: 'v1.1.0',
    description: 'Historical performance variance tracking.'
  },
  {
    id: 'labs_pred_retention',
    name: 'Predictive Retention Simulator',
    stage: 'BETA',
    targetRelease: 'v1.1.0',
    description: '0–3s viewer retention forecasting curve.'
  },
  {
    id: 'labs_thumb_intel',
    name: 'Thumbnail Intelligence Heatmaps',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v1.2.0',
    description: 'Visual thumbnail heatmap forecasting.'
  },
  {
    id: 'labs_audio_intel',
    name: 'Audio Intelligence & Speech Pacing',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v1.2.0',
    description: 'Speech pacing and audio clarity metrics.'
  },
  {
    id: 'labs_visual_intel',
    name: 'Visual Scene & Cut Rate Analyzer',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v1.2.0',
    description: 'Frame composition and scene cut rate analyzer.'
  },
  {
    id: 'labs_target_aud',
    name: 'Target Audience Resonance Scoring',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v1.2.0',
    description: 'Demographic resonance scoring.'
  },
  {
    id: 'labs_aura_ai',
    name: 'Aura AI Agent Drawer',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v1.2.0',
    description: 'Interactive AI drawer chat assistant.'
  },
  {
    id: 'labs_analytics_v2',
    name: 'AI Creator Coach & Viral Trend Radar',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v2.0.0',
    description: 'Predictive audience trend radar and automated coaching.'
  },
  {
    id: 'labs_workspaces',
    name: 'Multi-Creator Brand Kits & Influencer CRM',
    stage: 'EXPERIMENTAL',
    targetRelease: 'v2.0.0',
    description: 'Brand asset management and creator relationship management.'
  },
  {
    id: 'labs_enterprise',
    name: 'Enterprise Teams & White-Label Client Portal',
    stage: 'INCOMPLETE',
    targetRelease: 'v2.0.0',
    description: 'Agency client portal with white-label domain configuration.'
  },
  {
    id: 'labs_mobile',
    name: 'Native Mobile Companion Sync',
    stage: 'INCOMPLETE',
    targetRelease: 'v2.0.0',
    description: 'iOS & Android mobile pairing protocol.'
  }
];

export function getLabsCatalog(): FeatureMetadata[] {
  return Object.values(FEATURE_REGISTRY).filter(f => f.stage !== 'LAUNCH_READY' && f.stage !== 'ADMIN_ONLY');
}
