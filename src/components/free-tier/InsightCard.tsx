import React from 'react';
import { InsightData } from '../../types/freeTier';

interface InsightCardProps {
  data: InsightData;
}

export const InsightCard: React.FC<InsightCardProps> = ({ data }) => {
  return (
    <div className="aura-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 className="ft-card-title" style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '16px' }}>Key Insights</h3>
      <div className="ft-insight-list">
        {data.positive.map((insight, idx) => (
          <div key={`pos-${idx}`} className="ft-insight-item positive">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{insight}</span>
          </div>
        ))}
        {data.improvement.map((insight, idx) => (
          <div key={`imp-${idx}`} className="ft-insight-item improvement">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
