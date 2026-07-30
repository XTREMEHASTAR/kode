// ──────────────────────────────────────────────
// Centralized Feature Flag Management System
// ──────────────────────────────────────────────

import { FeatureFlagKey, FEATURE_REGISTRY, FeatureMetadata } from './featureRegistry';

export type FeatureFlag = FeatureFlagKey;

export class FeatureFlagService {
  public static isEnabled(flag: FeatureFlag): boolean {
    const meta = FEATURE_REGISTRY[flag];
    if (!meta) return false;

    // Check runtime localStorage overrides if present (for dev testing)
    if (typeof window !== 'undefined') {
      const override = localStorage.getItem(`kontagi_ff_${flag}`);
      if (override !== null) {
        return override === 'true';
      }
    }
    return meta.enabled;
  }

  public static getMeta(flag: FeatureFlag): FeatureMetadata {
    return FEATURE_REGISTRY[flag] || {
      id: flag,
      key: flag,
      name: 'Advanced Feature',
      stage: 'INCOMPLETE',
      enabled: false,
      visibleInNavigation: false,
      requiredRole: 'SUPER_ADMIN',
      requiredPlan: 'pro',
      launchVersion: '2.0.0',
      category: 'Labs & Experimental',
      description: 'This module is under active internal development.'
    };
  }

  public static getAllFlags(): FeatureMetadata[] {
    return Object.values(FEATURE_REGISTRY);
  }

  public static setOverride(flag: FeatureFlag, enabled: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`kontagi_ff_${flag}`, String(enabled));
    }
  }

  public static clearOverrides(): void {
    if (typeof window !== 'undefined') {
      Object.keys(FEATURE_REGISTRY).forEach((key) => {
        localStorage.removeItem(`kontagi_ff_${key}`);
      });
    }
  }
}
