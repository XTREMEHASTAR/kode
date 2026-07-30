import React from 'react';
import { ProCard } from './ProCard';

interface ProMetricProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  accentColor?: string;
}

export const ProMetric: React.FC<ProMetricProps> = ({
  label,
  value,
  delta,
  deltaType = 'positive',
  subtitle,
  accentColor = '#FFFFFF'
}) => {
  const getDeltaColor = () => {
    if (deltaType === 'positive') return '#4ADE80';
    if (deltaType === 'negative') return '#F87171';
    return 'rgba(255, 255, 255, 0.5)';
  };

  return (
    <ProCard padding="18px 20px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="pro-mono" style={{ fontSize: '2rem', fontWeight: 900, color: accentColor }}>
            {value}
          </span>
          {delta && (
            <span style={{ fontSize: '12px', fontWeight: 800, color: getDeltaColor() }}>
              {delta}
            </span>
          )}
        </div>
        {subtitle && (
          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {subtitle}
          </span>
        )}
      </div>
    </ProCard>
  );
};
