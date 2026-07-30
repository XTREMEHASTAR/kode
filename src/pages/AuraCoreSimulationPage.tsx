import React from 'react';
import { AuraCoreSimulationDashboard } from '../components/auracore/AuraCoreSimulationDashboard';

export const AuraCoreSimulationPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--aura-navy-background, #F9FAFB)', minHeight: '100vh' }}>
      <AuraCoreSimulationDashboard />
    </div>
  );
};
