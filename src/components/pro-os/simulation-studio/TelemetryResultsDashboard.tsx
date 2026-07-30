import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuraCoreSimulationTelemetry } from '../../../../server/src/modules/auracore/types';

interface TelemetryResultsDashboardProps {
  telemetry: AuraCoreSimulationTelemetry;
}

export const TelemetryResultsDashboard: React.FC<TelemetryResultsDashboardProps> = ({ telemetry }) => {
  const [hoverSecond, setHoverSecond] = useState<number | null>(null);

  const activeSecondData = hoverSecond !== null
    ? telemetry.timeline.find(t => t.second === hoverSecond)
    : telemetry.timeline[telemetry.timeline.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}
    >
      {/* 4 Summary Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        
        <div className="pro-glass-card" style={metricCardStyle}>
          <span style={metricLabelStyle}>Predicted Reel Reach & Views</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="pro-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF' }}>
              {telemetry.predictedTotalViews.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#4ADE80', fontWeight: 800 }}>
              +{Math.round((telemetry.viralityIndex / 40) * 100)}%
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            AI Feed Distribution Simulation
          </span>
        </div>

        <div className="pro-glass-card" style={metricCardStyle}>
          <span style={metricLabelStyle}>Hook Strength (3s Stop Rate)</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="pro-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: telemetry.predicted3sHookRetention >= 70 ? '#38BDF8' : '#FACC15' }}>
              {telemetry.predicted3sHookRetention}%
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Scroll Stop Probability
          </span>
        </div>

        <div className="pro-glass-card" style={metricCardStyle}>
          <span style={metricLabelStyle}>Audience Retention Rate</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="pro-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF' }}>
              {telemetry.predictedAverageRetention}%
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Replay Rate &bull; Watch Time: {telemetry.predictedWatchTimeSec}s
          </span>
        </div>

        <div className="pro-glass-card" style={metricCardStyle}>
          <span style={metricLabelStyle}>Viral Potential Score</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="pro-mono" style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F13A1E' }}>
              {telemetry.viralityIndex} / 100
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#F13A1E', fontWeight: 800 }}>
            {telemetry.confidenceScore} AI Viewer Personas Swarm
          </span>
        </div>

      </div>

      {/* Retention Curve Chart Panel */}
      <div className="pro-glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'rgba(15, 23, 42, 0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
              📈 Second-by-Second Audience Retention Profile
            </h4>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Hover over graph points to inspect second micro-metrics
            </span>
          </div>

          {activeSecondData && (
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <span>Second: <strong style={{ color: '#38BDF8' }}>{activeSecondData.second}s</strong></span>
              <span>Active Viewers: <strong style={{ color: '#FFFFFF' }}>{activeSecondData.activeViewersCount}</strong></span>
              <span>Retention: <strong style={{ color: '#4ADE80' }}>{activeSecondData.retentionPercentage}%</strong></span>
            </div>
          )}
        </div>

        {/* SVG Interactive Retention Graph */}
        <div style={{ height: '140px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '4px', paddingTop: '10px' }}>
          {telemetry.timeline.map((pt) => {
            const heightPct = Math.max(10, pt.retentionPercentage);
            const isSelected = hoverSecond === pt.second;
            return (
              <div
                key={pt.second}
                onMouseEnter={() => setHoverSecond(pt.second)}
                onMouseLeave={() => setHoverSecond(null)}
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  cursor: 'pointer'
                }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.3, delay: pt.second * 0.02 }}
                  style={{
                    width: '100%',
                    backgroundColor: isSelected ? '#FACC15' : pt.second <= 3 ? '#F13A1E' : '#38BDF8',
                    opacity: isSelected ? 1 : pt.second <= 3 ? 1 : 0.75,
                    borderRadius: '4px 4px 0 0',
                    boxShadow: isSelected ? '0 0 12px #FACC15' : pt.second <= 3 ? '0 0 8px rgba(241, 58, 30, 0.4)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Distribution Waves & Top Reactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
        {/* Distribution Waves */}
        <div className="pro-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'rgba(15, 23, 42, 0.85)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
            🚀 Algorithmic Distribution Waves
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {telemetry.distributionWaves.map(wave => (
              <div
                key={wave.waveNumber}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: wave.qualifiedForNextWave ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  border: wave.qualifiedForNextWave ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                    Wave {wave.waveNumber}: {wave.waveName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    Cohort Size: {wave.cohortSize.toLocaleString()} • {wave.qualificationReason}
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: wave.qualifiedForNextWave ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                  color: wave.qualifiedForNextWave ? '#4ADE80' : '#F87171'
                }}>
                  {wave.qualifiedForNextWave ? 'QUALIFIED' : 'CAPPED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Synthetic Reactions */}
        <div className="pro-glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: 'rgba(15, 23, 42, 0.85)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
            💬 AI Comments & Viewer Persona Reactions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {telemetry.topSyntheticReactions.slice(0, 3).map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8' }}>
                    {r.archetype}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>
                    {r.action}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#FFFFFF', fontStyle: 'italic' }}>
                  "{r.commentText}"
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const metricCardStyle: React.CSSProperties = {
  padding: '18px 20px',
  borderRadius: '12px',
  backgroundColor: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 800,
  color: '#94A3B8',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};
