import React, { useState, useEffect } from 'react';
import { ProCard } from './shared/ProCard';
import { ProMetric } from './shared/ProMetric';
import { ProBadge } from './shared/ProBadge';

export const ProTwinManagerView: React.FC = () => {
  const [twin, setTwin] = useState({
    handle: '@veer_workspace',
    authorityScorePct: 92,
    pacingSyllablesPerSec: 3.84,
    visualCutRateSec: 1.4,
    primaryHookStyle: 'Counter-Intuitive Value Question',
    toneCategory: 'High-Density Practical SaaS',
    topCountries: [
      { country: 'United States', sharePct: 48 },
      { country: 'India', sharePct: 24 },
      { country: 'United Kingdom', sharePct: 14 }
    ],
    primaryAgeBands: [
      { ageBand: '18–24 Zoomer Creators', sharePct: 42 },
      { ageBand: '25–34 SaaS Founders', sharePct: 44 }
    ],
    totalSimulationsRun: 28,
    averageScore: 86.4,
    hitRatePct: 82.1,
    viralSpikeCount: 6,
    biasOffset: '+0.02',
    confidenceMultiplier: '1.05x'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      {/* Header Bar */}
      <div
        className="pro-glass-card pro-glow-card"
        style={{
          padding: '24px 28px',
          borderRadius: '16px',
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              👤 PERSISTENT CREATOR TWIN MANAGER
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Twin State: <strong style={{ color: '#4ADE80' }}>CALIBRATED (28 JOBS PERSISTED)</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Creator Digital Twin — Style Fingerprint & Audience Profile
          </h1>
          <p style={{ fontSize: '13px', color: '#94A3B8', margin: '4px 0 0 0' }}>
            Your Creator Twin accumulates historical hit/miss precedent to automatically re-weight global audience simulations specifically for your real audience.
          </p>
        </div>

        <button
          onClick={() => alert('Creator Twin calibration updated and synced across all workspace nodes.')}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#A855F7',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)'
          }}
        >
          🔄 RE-CALIBRATE CREATOR TWIN
        </button>
      </div>

      {/* 4 Core Metric Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <ProMetric label="Authority Resonance" value={`${twin.authorityScorePct}%`} subtitle="Profile Trust Match" accentColor="#A855F7" />
        <ProMetric label="Historical Hit Rate" value={`${twin.hitRatePct}%`} subtitle="28 Simulations Tracked" accentColor="#4ADE80" />
        <ProMetric label="Viral Spikes Unlocked" value={`${twin.viralSpikeCount}`} subtitle=">1.0M Reach Posts" accentColor="#38BDF8" />
        <ProMetric label="Bayesian Multiplier" value={twin.confidenceMultiplier} subtitle="Audience Bias Offset: +0.02" accentColor="#FACC15" />
      </div>

      {/* Style Fingerprint & Audience Composition Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Style Fingerprint Card */}
        <ProCard>
          <ProBadge status="SUCCESS" label="STYLE FINGERPRINT V2" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '8px 0 16px 0', color: '#FFFFFF' }}>
            Creator Audio & Visual Delivery Fingerprint
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Speech Pacing Baseline:</span>
              <strong style={{ fontSize: '13px', color: '#4ADE80', fontFamily: 'monospace' }}>{twin.pacingSyllablesPerSec} syllables/sec</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Optical Shot Cut Rate:</span>
              <strong style={{ fontSize: '13px', color: '#38BDF8', fontFamily: 'monospace' }}>{twin.visualCutRateSec} seconds / cut</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Primary Hook Framing:</span>
              <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{twin.primaryHookStyle}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Tone Category:</span>
              <strong style={{ fontSize: '13px', color: '#A855F7' }}>{twin.toneCategory}</strong>
            </div>
          </div>
        </ProCard>

        {/* Real Audience Composition Card */}
        <ProCard>
          <ProBadge status="RUNNING" label="REAL AUDIENCE DEMOGRAPHIC WEIGHTING" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '8px 0 16px 0', color: '#FFFFFF' }}>
            Audience Demographic & Geographic Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Top Geographic Reach</span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {twin.topCountries.map((c, i) => (
                  <div key={i} style={{ flexGrow: 1, padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{c.country}</span>
                    <strong style={{ fontSize: '12px', color: '#4ADE80', fontFamily: 'monospace' }}>{c.sharePct}%</strong>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Primary Age Clusters</span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {twin.primaryAgeBands.map((a, i) => (
                  <div key={i} style={{ flexGrow: 1, padding: '8px 12px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#FFFFFF' }}>{a.ageBand}</span>
                    <strong style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace' }}>{a.sharePct}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProCard>

      </div>
    </div>
  );
};
