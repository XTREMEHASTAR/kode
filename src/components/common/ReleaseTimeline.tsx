import React from 'react';
import { ReleaseUpdateItem } from '../../services/comingSoonService';

interface ReleaseTimelineProps {
  items: ReleaseUpdateItem[];
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

export const ReleaseTimeline: React.FC<ReleaseTimelineProps> = ({
  items,
  theme = 'off-white'
}) => {
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
      <div style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B3D', letterSpacing: '0.1em' }}>
          LIVE DEV CHANGELOG
        </span>
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 0 0', color: textColor }}>
          Latest Engineering Updates
        </h3>
      </div>

      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Timeline Vertical Line */}
        <div
          style={{
            position: 'absolute',
            left: '7px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            backgroundColor: 'rgba(255, 107, 61, 0.3)'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {items.map((item) => (
            <div key={item.id} style={{ position: 'relative' }}>
              {/* Timeline Node Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: item.completed ? '#10B981' : '#FF6B3D',
                  border: '2px solid ' + cardBg,
                  boxShadow: item.completed ? '0 0 8px #10B981' : '0 0 8px #FF6B3D'
                }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF6B3D', fontFamily: 'monospace' }}>
                  {item.date}
                </span>

                {item.badge && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(255, 107, 61, 0.12)',
                      color: '#FF6B3D',
                      border: '1px solid rgba(255, 107, 61, 0.2)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '4px 0 2px 0', color: textColor }}>
                {item.completed ? '✓ ' : ''}{item.title}
              </h4>

              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
