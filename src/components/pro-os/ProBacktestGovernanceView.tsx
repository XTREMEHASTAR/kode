import React, { useState } from 'react';

interface SegmentSummary {
  segmentKey: string;
  platform: string;
  category: string;
  creatorTier: string;
  sampleSize: number;
  coveragePct: number;
  bucketAccuracyPct: number;
  spearmanRho: number;
  meanBrierScore: number;
  claimEligible: boolean;
  isSyntheticTestFixture?: boolean;
  lastUpdated: string;
}

export const ProBacktestGovernanceView: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>('instagram:us:tech:established');
  const [isRunningBacktest, setIsRunningBacktest] = useState<boolean>(false);
  const [testLog, setTestLog] = useState<string | null>(null);

  const mockSegments: SegmentSummary[] = [
    {
      segmentKey: 'instagram:us:tech:established',
      platform: 'Instagram Reels',
      category: 'Tech & SaaS',
      creatorTier: 'Established (50+ Posts)',
      sampleSize: 642,
      coveragePct: 91.2,
      bucketAccuracyPct: 86.4,
      spearmanRho: 0.78,
      meanBrierScore: 0.082,
      claimEligible: true,
      isSyntheticTestFixture: false,
      lastUpdated: '2026-08-01'
    },
    {
      segmentKey: 'instagram:us:lifestyle:established',
      platform: 'Instagram Reels',
      category: 'Lifestyle & Fitness',
      creatorTier: 'Established (50+ Posts)',
      sampleSize: 518,
      coveragePct: 89.5,
      bucketAccuracyPct: 82.1,
      spearmanRho: 0.74,
      meanBrierScore: 0.094,
      claimEligible: true,
      isSyntheticTestFixture: false,
      lastUpdated: '2026-08-01'
    },
    {
      segmentKey: 'tiktok:global:entertainment:warming',
      platform: 'TikTok',
      category: 'Entertainment & Comedy',
      creatorTier: 'Warming (10-50 Posts)',
      sampleSize: 310,
      coveragePct: 83.0,
      bucketAccuracyPct: 74.5,
      spearmanRho: 0.62,
      meanBrierScore: 0.128,
      claimEligible: false, // Under 500 samples
      isSyntheticTestFixture: false,
      lastUpdated: '2026-07-28'
    },
    {
      segmentKey: 'TEST:instagram_reels:synthetic_pipeline_fixture',
      platform: 'Instagram Reels (Public Data)',
      category: 'All Categories (Synthetic Noise)',
      creatorTier: 'Synthetic Test Fixtures',
      sampleSize: 55524,
      coveragePct: 90.5,
      bucketAccuracyPct: 88.2,
      spearmanRho: 0.84,
      meanBrierScore: 0.052,
      claimEligible: false, // Strictly false for synthetic data!
      isSyntheticTestFixture: true,
      lastUpdated: '2026-08-03'
    }
  ];

  const currentSegment = mockSegments.find(s => s.segmentKey === selectedSegment) || mockSegments[0];

  const triggerWalkForwardBacktest = () => {
    setIsRunningBacktest(true);
    setTestLog('Initializing Walk-Forward Temporal Backtest across 642 held-out assets...');
    setTimeout(() => {
      setTestLog('Loading Persona Registry v2.4.1 (Held-out window: 2026-01 to 2026-07)...');
    }, 1000);
    setTimeout(() => {
      setTestLog('Evaluating Range Coverage (90% CI), Bucket Classification, Spearman Rank Correlation, and Brier Scores...');
    }, 2000);
    setTimeout(() => {
      setIsRunningBacktest(false);
      setTestLog('✅ Backtest Batch Completed! 642 assets evaluated. Segment "instagram:us:tech:established" maintained Claim Eligibility (86.4% Bucket Accuracy, 0.78 Spearman Rho).');
    }, 3200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', backgroundColor: '#0B132B', color: '#F1F5F9', minHeight: '100vh' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#38BDF8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            KONTAGI ENGINE GOVERNANCE
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0', color: '#FFFFFF' }}>
            Empirical Backtesting & Claim Eligibility Dashboard
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>
            Walk-Forward Validation, Range Coverage, Spearman Rank Correlation, & Drift Monitoring.
          </p>
        </div>

        <button
          onClick={triggerWalkForwardBacktest}
          disabled={isRunningBacktest}
          style={{
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: isRunningBacktest ? '#64748B' : '#F13A1E',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '13px',
            cursor: isRunningBacktest ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(241, 58, 30, 0.3)'
          }}
        >
          {isRunningBacktest ? '🔄 RUNNING BACKTEST...' : '⚡ TRIGGER WALK-FORWARD BACKTEST'}
        </button>
      </div>

      {currentSegment.isSyntheticTestFixture && (
        <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', border: '1px solid #EAB308', padding: '14px 18px', borderRadius: '10px', fontSize: '13px', color: '#FDE047', fontWeight: 600 }}>
          ⚠️ <strong>SYNTHETIC TEST FIXTURE SEGMENT SELECTED</strong>: This segment uses public dataset metadata with synthetic noisy predictions strictly to test pipeline mathematics. It is isolated from production accuracy gating (`claim_eligible = false`).
        </div>
      )}

      {testLog && (
        <div style={{ backgroundColor: '#0F172A', border: '1px solid #38BDF8', padding: '14px 18px', borderRadius: '10px', fontSize: '13px', color: '#38BDF8', fontFamily: 'monospace' }}>
          {testLog}
        </div>
      )}

      {/* 4 Core Pillars Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        
        <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>RANGE COVERAGE (90% CI)</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace', margin: '4px 0' }}>
            {currentSegment.coveragePct}%
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Target: ≥ 90% Stated CI</span>
        </div>

        <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.25)', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>DIRECTIONAL BUCKET ACCURACY</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace', margin: '4px 0' }}>
            {currentSegment.bucketAccuracyPct}%
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Top / Mid / Bottom Third Classification</span>
        </div>

        <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>RANKING ACCURACY (SPEARMAN ρ)</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#A855F7', fontFamily: 'monospace', margin: '4px 0' }}>
            ρ = {currentSegment.spearmanRho}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Rank Order Correlation (Target ≥ 0.60)</span>
        </div>

        <div style={{ backgroundColor: (currentSegment.claimEligible && !currentSegment.isSyntheticTestFixture) ? 'rgba(74, 222, 128, 0.08)' : 'rgba(239, 68, 68, 0.08)', border: (currentSegment.claimEligible && !currentSegment.isSyntheticTestFixture) ? '1px solid rgba(74, 222, 128, 0.25)' : '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase' }}>PUBLIC CLAIM ELIGIBILITY</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: (currentSegment.claimEligible && !currentSegment.isSyntheticTestFixture) ? '#4ADE80' : '#EF4444', margin: '8px 0' }}>
            {currentSegment.isSyntheticTestFixture ? '🛑 TEST FIXTURE ONLY' : (currentSegment.claimEligible ? '✅ CLAIM ELIGIBLE' : '❌ INSUFFICIENT DATA')}
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>{currentSegment.isSyntheticTestFixture ? 'Synthetic fixture cannot claim eligibility' : `Sample Size: ${currentSegment.sampleSize} / 500 Min`}</span>
        </div>

      </div>

      {/* Segment Selector & Matrix Table */}
      <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px 0', color: '#FFFFFF' }}>
          Segment-Level Accuracy Matrix & Claim Gates
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94A3B8' }}>
                <th style={{ padding: '12px' }}>Platform & Category</th>
                <th style={{ padding: '12px' }}>Creator Maturity Tier</th>
                <th style={{ padding: '12px' }}>Held-out Samples</th>
                <th style={{ padding: '12px' }}>CI Coverage</th>
                <th style={{ padding: '12px' }}>Bucket Accuracy</th>
                <th style={{ padding: '12px' }}>Spearman ρ</th>
                <th style={{ padding: '12px' }}>Brier Score</th>
                <th style={{ padding: '12px' }}>Claim Gate</th>
              </tr>
            </thead>
            <tbody>
              {mockSegments.map(seg => {
                const isSelected = seg.segmentKey === selectedSegment;
                const isSynthetic = seg.isSyntheticTestFixture || seg.segmentKey.startsWith('TEST:');
                return (
                  <tr
                    key={seg.segmentKey}
                    onClick={() => setSelectedSegment(seg.segmentKey)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.1)' : (isSynthetic ? 'rgba(234, 179, 8, 0.05)' : 'transparent'),
                      cursor: 'pointer'
                    }}
                  >
                    <td style={{ padding: '14px 12px', fontWeight: 800, color: '#FFFFFF' }}>
                      {seg.platform} &bull; <span style={{ color: isSynthetic ? '#FACC15' : '#38BDF8' }}>{seg.category}</span>
                      {isSynthetic && <span style={{ marginLeft: '8px', fontSize: '10px', backgroundColor: '#EAB308', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>SYNTHETIC FIXTURE</span>}
                    </td>
                    <td style={{ padding: '12px', color: '#CBD5E1' }}>{seg.creatorTier}</td>
                    <td style={{ padding: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{seg.sampleSize}</td>
                    <td style={{ padding: '12px', color: seg.coveragePct >= 85 ? '#4ADE80' : '#FACC15' }}>{seg.coveragePct}%</td>
                    <td style={{ padding: '12px', fontWeight: 800, color: isSynthetic ? '#FACC15' : '#38BDF8' }}>{seg.bucketAccuracyPct}%</td>
                    <td style={{ padding: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{seg.spearmanRho}</td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{seg.meanBrierScore}</td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 800,
                          backgroundColor: isSynthetic ? 'rgba(234, 179, 8, 0.2)' : (seg.claimEligible ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'),
                          color: isSynthetic ? '#FACC15' : (seg.claimEligible ? '#4ADE80' : '#EF4444')
                        }}
                      >
                        {isSynthetic ? 'SYNTHETIC TEST (BLOCKED)' : (seg.claimEligible ? 'ELIGIBLE' : 'BLOCKED (<500)')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

