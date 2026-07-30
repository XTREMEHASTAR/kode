import React, { useState } from 'react';

interface FeaturePreviewCardProps {
  featureName?: string;
  theme?: 'off-white' | 'dark-cyber' | 'nothing-glass' | 'stripe-neon';
}

export const FeaturePreviewCard: React.FC<FeaturePreviewCardProps> = ({
  featureName = 'Kontagi Neural Lab v2.0',
  theme = 'off-white'
}) => {
  const [swarmDensity, setSwarmDensity] = useState(8500);
  const [retentionSensitivity, setRetentionSensitivity] = useState(92);
  const [mode, setMode] = useState<'simulated' | 'deep_learning' | 'quantum'>('deep_learning');

  // Calculated predictive metric based on interactive inputs
  const score = Math.round((swarmDensity / 100) * 0.4 + retentionSensitivity * 0.6);

  const cardBg = theme === 'dark-cyber' ? '#0F1C28' : '#162A3B';
  const textColor = '#FFFFFF';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '840px',
        backgroundColor: cardBg,
        borderRadius: '24px',
        border: '1px solid rgba(255, 107, 61, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(255, 107, 61, 0.2), 0 8px 24px rgba(0,0,0,0.2)',
        padding: '32px',
        boxSizing: 'border-box',
        color: textColor,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF6B3D', animation: 'pulseDot 1.5s infinite' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B3D', letterSpacing: '0.1em' }}>
              SECRET AI LABORATORY • LIVE PROTOTYPE SNEAK PEEK
            </span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0 0 0', color: '#F8FAFC' }}>
            {featureName} Simulation Interface
          </h3>
        </div>

        <div
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#CBD5E1'
          }}
        >
          🔒 Beta Build v2.0-RC4
        </div>
      </div>

      {/* Interactive Controls & Live Output Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flexWrap: 'wrap' }}>
        {/* LEFT COLUMN: PARAMETER SLIDERS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>AI Viewer Swarm Vectors</span>
              <span style={{ color: '#FF6B3D', fontFamily: 'monospace' }}>{swarmDensity.toLocaleString()} Persona Nodes</span>
            </div>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={swarmDensity}
              onChange={(e) => setSwarmDensity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#FF6B3D', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#94A3B8' }}>Retention Neural Sensitivity</span>
              <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{retentionSensitivity}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={retentionSensitivity}
              onChange={(e) => setRetentionSensitivity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#4ADE80', cursor: 'pointer' }}
            />
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '8px' }}>
              Simulation Engine Mode
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['simulated', 'deep_learning', 'quantum'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    borderRadius: '8px',
                    backgroundColor: mode === m ? 'rgba(255, 107, 61, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid ' + (mode === m ? '#FF6B3D' : 'rgba(255, 255, 255, 0.1)'),
                    color: mode === m ? '#FF6B3D' : '#94A3B8',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {m.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATED PREDICTIVE AUDIENCE GRAPH */}
        <div
          style={{
            backgroundColor: '#050B11',
            borderRadius: '16px',
            border: '1px solid rgba(255, 107, 61, 0.2)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em' }}>
              PREDICTIVE VIRALITY INDEX
            </span>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
              ● REALTIME INFERENCE
            </span>
          </div>

          <div style={{ margin: '16px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#FF6B3D', fontFamily: 'monospace', lineHeight: 1 }}>
              {score}
              <span style={{ fontSize: '20px', color: '#64748B' }}>/100</span>
            </div>
            <span style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
              High Viral Retention Probability
            </span>
          </div>

          {/* Simulated Animated Waveform */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '36px' }}>
            {Array.from({ length: 18 }).map((_, idx) => {
              const h = 20 + Math.sin(idx + swarmDensity * 0.001) * 15;
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${Math.max(10, Math.min(36, h))}px`,
                    backgroundColor: idx % 3 === 0 ? '#FF6B3D' : '#38BDF8',
                    borderRadius: '2px',
                    transition: 'height 0.3s ease'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};
