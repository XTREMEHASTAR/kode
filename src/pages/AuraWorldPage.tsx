import React from 'react';
import { AuraWorldDashboard } from '../components/auraworld/AuraWorldDashboard';

export const AuraWorldPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--aura-navy-background, #F9FAFB)', minHeight: '100vh' }}>
      <AuraWorldDashboard />
    </div>
  );
};
