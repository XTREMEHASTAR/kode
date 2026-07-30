import React from 'react';
import { FeatureFlagKey, FeatureRegistryService } from '../../services/featureRegistry';
import { FeatureFlagService } from '../../services/featureFlags';

interface FeatureGateProps {
  feature: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallback = null }) => {
  const isEnabled = FeatureFlagService.isEnabled(feature as any) || FeatureRegistryService.isNavVisible(feature);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
