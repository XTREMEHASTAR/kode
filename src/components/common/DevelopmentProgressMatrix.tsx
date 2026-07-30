import React from 'react';
import { StageProgress } from '../../services/comingSoonService';

interface DevelopmentProgressMatrixProps {
  progress: StageProgress;
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

export const DevelopmentProgressMatrix: React.FC<DevelopmentProgressMatrixProps> = ({
  progress,
  theme = 'off-white'
}) => {
  // Calculate overall weighted completion percentage
  const stages = [
    { key: 'research', label: 'Research & Model Architecture', icon: '🧪', val: progress.research, weight: 0.15 },
    { key: 'design', label: 'UI/UX & Interactive Design', icon: '🎨', val: progress.design, weight: 0.15 },
    { key: 'development', label: 'Core Neural Engine Development', icon: '⚡', val: progress.development, weight: 0.40 },
    { key: 'testing', label: 'QA, Safety & Load Testing', icon: '🛡️', val: progress.testing, weight: 0.20 },
    { key: 'deployment', label: 'Global Edge Node Deployment', icon: '🚀', val: progress.deployment, weight: 0.10 }
  ];

  const overallProgress = Math.round(
    stages.reduce((acc, stage) => acc + stage.val * stage.weight, 0)
  );

  const cardBg = theme === 'dark-cyber' ? '#162A3B' : '#FFFBF7';
  const borderColor = theme === 'dark-cyber' ? 'rgba(255, 107, 61, 0.3)' : '#E8E3DA';
  const textColor = theme === 'dark-cyber' ? '#F8FAFC' : '#162A3B';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '840px',
        backgroundColor: cardBg,
        borderRadius: '24px',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 20px 40px -10px rgba(255, 107, 61, 0.1), 0 4px 16px rgba(22, 42, 59, 0.04)',
        padding: '32px',
        boxSizing: 'border-box',
        color: textColor
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B3D', letterSpacing: '0.1em' }}>
            TRANSPARENT ROADMAP
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0', color: textColor }}>
            Development Stage Progress
          </h3>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            backgroundColor: 'rgba(255, 107, 61, 0.12)',
            padding: '8px 16px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 107, 61, 0.25)'
          }}
        >
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>OVERALL:</span>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#FF6B3D', fontFamily: 'monospace' }}>
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Main Overall Glowing Progress Bar */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
          <span>Build Status</span>
          <span>Target Release Version v2.0</span>
        </div>

        <div
          style={{
            height: '14px',
            backgroundColor: 'rgba(22, 42, 59, 0.08)',
            borderRadius: '9999px',
            overflow: 'hidden',
            position: 'relative',
            padding: '2px',
            border: '1px solid rgba(22, 42, 59, 0.1)'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, #FF6B3D 0%, #FF541F 60%, #F59E0B 100%)',
              borderRadius: '9999px',
              transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 12px rgba(255, 107, 61, 0.5)'
            }}
          />
        </div>
      </div>

      {/* Stage Breakdown Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {stages.map((stg) => (
          <div
            key={stg.key}
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 16px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              border: '1px solid rgba(232, 227, 218, 0.8)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>{stg.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: textColor }}>{stg.label}</span>
            </div>

            <div style={{ height: '8px', backgroundColor: 'rgba(22, 42, 59, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${stg.val}%`,
                  backgroundColor: stg.val === 100 ? '#10B981' : '#FF6B3D',
                  borderRadius: '9999px',
                  transition: 'width 0.5s ease'
                }}
              />
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 800, color: stg.val === 100 ? '#10B981' : '#FF6B3D' }}>
              {stg.val === 100 ? '✓ 100%' : `${stg.val}%`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
