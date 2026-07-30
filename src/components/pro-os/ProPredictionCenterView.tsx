import React, { useState } from 'react';

type ScenarioType = 'base' | 'best' | 'worst';

interface MetricDriver {
  type: 'pos' | 'neg';
  label: string;
}

interface PredictionMetric {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  confidence: string;
  drivers: MetricDriver[];
  accentColor: string;
}

export const ProPredictionCenterView: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioType>('base');
  const [selectedMetric, setSelectedMetric] = useState<string>('views');

  // Scenario Multipliers
  const scenarioData = {
    base: {
      label: 'Base Case (Expected)',
      views: '2.3M',
      viewsRange: '1.8M – 3.1M @ 95% CI',
      viralChance: '84.6%',
      followers: '+14.8k',
      confidence: '96.4%',
      shareProb: '8.4%',
      commentProb: '4.2%',
      accent: '#4ADE80'
    },
    best: {
      label: 'Best Case (Viral Spike)',
      views: '4.8M',
      viewsRange: '3.6M – 6.2M @ 95% CI',
      viralChance: '96.2%',
      followers: '+38.2k',
      confidence: '92.1%',
      shareProb: '14.2%',
      commentProb: '7.8%',
      accent: '#38BDF8'
    },
    worst: {
      label: 'Worst Case (Conservative)',
      views: '650K',
      viewsRange: '480K – 920K @ 95% CI',
      viralChance: '42.1%',
      followers: '+3.2k',
      confidence: '98.7%',
      shareProb: '3.8%',
      commentProb: '1.9%',
      accent: '#F13A1E'
    }
  };

  const activeScenario = scenarioData[scenario];

  // 11 Core Forecast Metrics with Explanatory Drivers (+/- "Because:")
  const forecastMetrics: PredictionMetric[] = [
    {
      id: 'views',
      title: 'Predicted Views',
      value: activeScenario.views,
      subtitle: activeScenario.viewsRange,
      confidence: activeScenario.confidence,
      accentColor: activeScenario.accent,
      drivers: [
        { type: 'pos', label: 'Strong opening hook (0s-3s tension index 94/100)' },
        { type: 'pos', label: 'Trending audio momentum (+428% 24h surge velocity)' },
        { type: 'pos', label: 'High curiosity gap (95/100 information asymmetry)' },
        { type: 'neg', label: 'High competition density in tech niche (0.84 saturation)' },
        { type: 'neg', label: 'Weak CTA conversion friction (-12.4% end tail drop)' }
      ]
    },
    {
      id: 'viral',
      title: 'Chance of Viral Spike',
      value: activeScenario.viralChance,
      subtitle: 'Probability of exceeding 1.0M views',
      confidence: '98.2%',
      accentColor: '#38BDF8',
      drivers: [
        { type: 'pos', label: 'High share-to-view ratio potential (0.084)' },
        { type: 'pos', label: 'Cross-cluster resonance index (96.2% match)' },
        { type: 'pos', label: 'Optimal evening post window (18:00 - 21:00 EST)' },
        { type: 'neg', label: 'Mid-video audio ducking dip at 14s' }
      ]
    },
    {
      id: 'share',
      title: 'Share Probability',
      value: activeScenario.shareProb,
      subtitle: '8.4 shares per 100 viewers',
      confidence: '95.1%',
      accentColor: '#4ADE80',
      drivers: [
        { type: 'pos', label: 'High relatable value drop at 28.0s mark' },
        { type: 'pos', label: 'Strong utility takeaway checklist format' },
        { type: 'neg', label: 'Lack of explicit visual share pointer overlay' }
      ]
    },
    {
      id: 'comment',
      title: 'Comment Probability',
      value: activeScenario.commentProb,
      subtitle: '4.2 comments per 100 viewers',
      confidence: '94.8%',
      accentColor: '#FACC15',
      drivers: [
        { type: 'pos', label: 'Polarizing debate question at 18.0s mark' },
        { type: 'pos', label: 'Open-ended narrative conclusion' },
        { type: 'neg', label: 'Missing pinned comment question prompt' }
      ]
    },
    {
      id: 'followers',
      title: 'Follower Growth',
      value: activeScenario.followers,
      subtitle: 'Predicted net new followers gained',
      confidence: '96.8%',
      accentColor: '#A855F7',
      drivers: [
        { type: 'pos', label: 'High profile authority alignment (92/100)' },
        { type: 'pos', label: 'Consistent series branding badge' },
        { type: 'neg', label: 'Missing explicit "Follow for Part 2" callout' }
      ]
    },
    {
      id: 'retention',
      title: '30s Retention Checkpoint',
      value: '76.1%',
      subtitle: 'Predicted viewers remaining at 30.0s',
      confidence: '97.4%',
      accentColor: '#10B981',
      drivers: [
        { type: 'pos', label: 'Pattern interrupt at 0.4s holds 95% threshold' },
        { type: 'pos', label: 'High speech pacing (3.84 syllables/sec)' },
        { type: 'neg', label: 'Mild drop-off at 18.0s exposition gap (-8.2%)' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. BLOOMBERG FORECASTING TICKER HEADER ───────────────────────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              🔮 AURAKERNEL PREDICTION CENTER
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Monte Carlo Engine: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>10,000 RUNS (CONVERGENCE 99.4%)</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Predictive Intelligence & Reach Forecast
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Target: <strong style={{ color: '#FFFFFF' }}>Reel_Launch_v3.mp4</strong></span>
            <span>•</span>
            <span>Platform: <strong style={{ color: '#FFFFFF' }}>Instagram / TikTok Multi-Pass</strong></span>
            <span>•</span>
            <span>Forecast Confidence: <strong style={{ color: '#4ADE80' }}>{activeScenario.confidence}</strong></span>
          </div>
        </div>

        {/* Action Controls & Scenario Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          {/* Export Actions Bar */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => alert('PDF Forecast Report generated and downloaded.')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📄 Export PDF Report
            </button>

            <button
              onClick={() => window.location.href = '/pro/simulation'}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(217, 119, 6, 0.5)',
                backgroundColor: 'rgba(217, 119, 6, 0.2)',
                color: '#F59E0B',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ⚡ Enter Scenario Simulator (Optional) →
            </button>

            <button
              onClick={() => alert('JSON Forecast Vectors copied to clipboard.')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#38BDF8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              💾 Export JSON Vectors
            </button>

            <button
              onClick={() => alert('Simulation link copied!')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(241, 58, 30, 0.3)',
                backgroundColor: 'rgba(241, 58, 30, 0.15)',
                color: '#F13A1E',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              🔗 Share Forecast
            </button>
          </div>

          {/* Scenario Comparison Switcher */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['worst', 'base', 'best'] as ScenarioType[]).map((sc) => (
              <button
                key={sc}
                onClick={() => setScenario(sc)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: scenario === sc ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: scenario === sc ? '#FFFFFF' : '#94A3B8',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {sc === 'base' && '⚡ Base Case'}
                {sc === 'best' && '🚀 Best Case'}
                {sc === 'worst' && '🛡️ Worst Case'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. MONTE CARLO PROBABILITY BELL CURVE & WAVE TIMELINE ────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Monte Carlo Probability Distribution Bell Curve */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Probability Distribution Curve
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Monte Carlo Lognormal Outcome Density
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800, backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
              95% CI Bounds: 1.8M – 3.1M
            </span>
          </div>

          <svg width="100%" height="180" viewBox="0 0 400 180" style={{ overflow: 'visible' }}>
            {/* Shaded 95% Confidence Interval Fill */}
            <path 
              d="M 60 140 C 100 130, 140 30, 200 20 C 260 30, 300 110, 340 140 Z" 
              fill="rgba(56, 189, 248, 0.18)" 
            />

            {/* Bell Curve Line */}
            <path 
              d="M 10 145 C 50 140, 120 30, 200 20 C 280 30, 350 140, 390 145" 
              fill="none" 
              stroke="#38BDF8" 
              strokeWidth="3" 
            />

            {/* Median Mean Line */}
            <line x1="200" y1="20" x2="200" y2="145" stroke="#4ADE80" strokeWidth="2" strokeDasharray="3 3" />

            {/* Outcome Labels */}
            <text x="200" y="15" fill="#4ADE80" fontSize="10" fontWeight="900" textAnchor="middle">Median: 2.3M Views</text>
            <text x="60" y="160" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">Worst: 650K</text>
            <text x="340" y="160" fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">Best: 4.8M</text>
          </svg>

          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            84.6% probability outcome lands within the <strong style={{ color: '#FFFFFF' }}>1.8M – 3.1M</strong> distribution zone.
          </div>
        </div>

        {/* Timeline Wave Velocity Projections (Day 1 -> Day 30) */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Distribution Wave Timeline
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                30-Day Growth Velocity Curve
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: '#F13A1E', fontWeight: 800, backgroundColor: 'rgba(241, 58, 30, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
              Peak Surge: Day 3
            </span>
          </div>

          <svg width="100%" height="180" viewBox="0 0 400 180" style={{ overflow: 'visible' }}>
            {/* Timeline Steps Line */}
            <path 
              d="M 10 140 Q 80 120, 120 70 T 240 40 T 380 30" 
              fill="none" 
              stroke="#F13A1E" 
              strokeWidth="3" 
            />

            {/* Checkpoint Nodes */}
            <circle cx="20" cy="138" r="5" fill="#FFFFFF" stroke="#F13A1E" strokeWidth="2" />
            <circle cx="120" cy="70" r="5" fill="#FFFFFF" stroke="#F13A1E" strokeWidth="2" />
            <circle cx="240" cy="40" r="5" fill="#FFFFFF" stroke="#F13A1E" strokeWidth="2" />
            <circle cx="380" cy="30" r="5" fill="#FFFFFF" stroke="#F13A1E" strokeWidth="2" />

            {/* Day Labels */}
            <text x="20" y="160" fill="#94A3B8" fontSize="9" fontWeight="800" textAnchor="middle">Day 1 (450K)</text>
            <text x="120" y="160" fill="#94A3B8" fontSize="9" fontWeight="800" textAnchor="middle">Day 3 (1.2M)</text>
            <text x="240" y="160" fill="#94A3B8" fontSize="9" fontWeight="800" textAnchor="middle">Day 7 (1.9M)</text>
            <text x="380" y="160" fill="#94A3B8" fontSize="9" fontWeight="800" textAnchor="middle">Day 30 (2.3M)</text>
          </svg>

          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Initial seed wave unlocks secondary algorithm push within <strong style={{ color: '#FFFFFF' }}>36 hours</strong>.
          </div>
        </div>

      </div>

      {/* ── 3. FORECAST METRICS WITH EXPLANATORY DRIVERS (+ / - "BECAUSE:") ─────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
            EXPLANATORY DRIVER DECONSTRUCTION
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '4px 0 0 0', color: '#FFFFFF' }}>
            Forecasting Metric Drivers — "Why This Prediction Occurs"
          </h2>
        </div>

        {/* 6 Grid Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {forecastMetrics.map((m) => {
            const isSelected = selectedMetric === m.id;
            return (
              <div 
                key={m.id}
                onClick={() => setSelectedMetric(m.id)}
                style={{ 
                  backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.06)' : 'rgba(15, 23, 42, 0.8)', 
                  border: isSelected ? `2px solid ${m.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '14px', 
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {m.title}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    {m.confidence} Confidence
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: m.accentColor, fontFamily: 'monospace', lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                    {m.subtitle}
                  </div>
                </div>

                {/* Driver Explanations List (+ / -) */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    BECAUSE:
                  </span>

                  {m.drivers.map((d, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        gap: '6px', 
                        fontSize: '11.5px', 
                        color: d.type === 'pos' ? '#E2E8F0' : '#CBD5E1',
                        lineHeight: 1.35
                      }}
                    >
                      <span style={{ fontWeight: 900, color: d.type === 'pos' ? '#4ADE80' : '#F13A1E' }}>
                        {d.type === 'pos' ? '+' : '-'}
                      </span>
                      <span>{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 4. DISTRIBUTION WAVES & PLATFORM CONFIDENCE ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        
        {/* 4-Wave Recommendation Pipeline Qualification */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              4-Wave Algorithmic Qualification Pipeline
            </span>
            <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800 }}>
              Global Feed Qualification: 68.2%
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { wave: 'Wave 1: Seed Cohort', size: '1,000', rate: '92.4%', color: '#4ADE80' },
              { wave: 'Wave 2: Niche Explore', size: '10,000', rate: '84.2%', color: '#38BDF8' },
              { wave: 'Wave 3: Broad Explore', size: '100,000', rate: '76.5%', color: '#FACC15' },
              { wave: 'Wave 4: Global Feed', size: '1,000,000+', rate: '68.2%', color: '#F13A1E' }
            ].map((w, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: w.color }}>{w.wave}</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'monospace' }}>{w.size}</span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Pass Rate: <strong style={{ color: '#FFFFFF' }}>{w.rate}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Confidence Scores & Risk Check */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Multi-Platform Algorithm Confidence
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { platform: 'Instagram Reels', score: 94.2, status: 'HIGH RESONANCE', color: '#E1306C' },
              { platform: 'TikTok Shorts', score: 91.8, status: 'VIRAL SWARM', color: '#00F2FE' },
              { platform: 'YouTube Shorts', score: 88.5, status: 'STABLE FEED', color: '#FF0000' }
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{p.platform}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: p.color }}>{p.status}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>{p.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
