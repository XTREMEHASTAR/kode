import React from 'react';
import { FeatureFlag, FeatureFlagService } from '../../services/featureFlags';
import { ComingSoonPage } from '../../launch';

interface FeatureFlagRouteProps {
  flag: FeatureFlag;
  children: React.ReactNode;
}

export const FeatureFlagRoute: React.FC<FeatureFlagRouteProps> = ({ flag, children }) => {
  const isEnabled = FeatureFlagService.isEnabled(flag);
  const meta = FeatureFlagService.getMeta(flag);

  if (!isEnabled) {
    return (
      <ComingSoonPage
        title={meta.name}
        description={meta.description}
        estimatedRelease={meta.launchVersion || 'v2.0.0'}
        category={meta.key.replace('FEATURE_', '').replace('_', ' ')}
      />
    );
  }

  return <>{children}</>;
};
