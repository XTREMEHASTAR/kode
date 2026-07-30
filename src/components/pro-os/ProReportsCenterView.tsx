import React, { useState } from 'react';

type ReportType = 'agency' | 'creator' | 'brand' | 'client' | 'executive';

interface ReportDetail {
  id: ReportType;
  title: string;
  subtitle: string;
  badge: string;
  targetAudience: string;
  insights: string[];
  recommendations: string[];
}

export const ProReportsCenterView: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('agency');
  const [isPresenting, setIsPresenting] = useState<boolean>(false);

  // 5 Report Types Data
  const reports: Record<ReportType, ReportDetail> = {
    agency: {
      id: 'agency',
      title: 'Agency Client Deliverable & Campaign ROI Report',
      subtitle: 'White-Label Multi-Channel Performance & Virality Audit',
      badge: 'AGENCY ENTERPRISE',
      targetAudience: 'Client Marketing Directors & Brand Managers',
      insights: [
        'Campaign achieved top 2% virality benchmark across SaaS growth category.',
        'High conversion intent score (93/100) driven by 28s value checklist prompt.',
        'Multi-platform distribution unlocked global feed qualification on Reels & TikTok.'
      ],
      recommendations: [
        'Scale ad budget allocation on Instagram Reels during 18:00 - 21:00 EST window.',
        'Repurpose opening 3s hook into secondary variant ad test.',
        'Include branded lower-third graphic overlay in next campaign batch.'
      ]
    },
    creator: {
      id: 'creator',
      title: 'Creator Virality & Hook Optimization Report',
      subtitle: 'Pattern Interrupt, Audience Retention, & Organic Reach Breakdown',
      badge: 'CREATOR PRO',
      targetAudience: 'Content Creator & Editing Team',
      insights: [
        'Opening 3.0s hook tension scored 94/100, holding 94.8% viewer attention.',
        'Syllable pacing (3.84/sec) eliminated exposition boredom.',
        'Minor drop-off observed at 18.0s exposition gap (-8.2%).'
      ],
      recommendations: [
        'Add J-cut audio transition 0.3s before scene shift at 18s.',
        'Keep video duration under 45 seconds for maximum repeat play rate.'
      ]
    },
    brand: {
      id: 'brand',
      title: 'Brand Resonance & Voice Alignment Report',
      subtitle: 'Authority-to-Warmth Ratio & Sentiment Alignment Analysis',
      badge: 'BRAND IDENTITY',
      targetAudience: 'Chief Marketing Officer & Brand Strategist',
      insights: [
        'Brand Voice Fit scored 92%, adhering to corporate tone guidelines.',
        'Authority-to-warmth ratio measured at optimal 70:30 split.',
        'Zero community guideline or brand safety risks detected.'
      ],
      recommendations: [
        'Maintain hex color (#F13A1E) consistency across graphic overlays.',
        'Pin official brand commentary question to boost engagement depth.'
      ]
    },
    client: {
      id: 'client',
      title: 'Client Performance & Campaign Summary Report',
      subtitle: 'Executive Campaign Deliverable & Metric Verification',
      badge: 'CLIENT DELIVERABLE',
      targetAudience: 'External Client Executives',
      insights: [
        'Predicted campaign reach: 2.3M Views with 84.6% viral probability.',
        'Follower conversion prediction: +14.8k net new brand followers.',
        'Demographics match 96.4% with target ICP (B2B Founders & Tech Execs).'
      ],
      recommendations: [
        'Approve distribution rollout for Q3 campaign launch.',
        'Schedule follow-up simulation for secondary asset variations.'
      ]
    },
    executive: {
      id: 'executive',
      title: 'Executive C-Suite 1-Page Summary Report',
      subtitle: 'Macro Virality Index, Risk Audit, & Resource Allocation',
      badge: 'C-SUITE BRIEF',
      targetAudience: 'CEO, CMO, & Board of Directors',
      insights: [
        'Predicted ROI multiplier: 4.8x baseline organic reach.',
        '10,000 Monte Carlo runs converged with 99.4% statistical confidence.',
        'Overall Virality Score: 94.2/100.'
      ],
      recommendations: [
        'Authorize immediate platform publishing across Reels & TikTok.',
        'Reallocate 35% of digital budget to short-form video simulation.'
      ]
    }
  };

  const currentReport = reports[selectedReportType];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. PRESENTATION-READY REPORTS HEADER ───────────────────────────────── */}
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
              📑 AURAKERNEL REPORTS CENTER
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Status: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>PRESENTATION READY</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Executive & Client Report Generator
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Target: <strong style={{ color: '#FFFFFF' }}>Reel_Launch_v3.mp4</strong></span>
            <span>•</span>
            <span>Selected Report: <strong style={{ color: '#38BDF8' }}>{currentReport.title}</strong></span>
          </div>
        </div>

        {/* Export & Presentation Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => alert('PDF Report exported successfully.')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📄 Export PDF
          </button>

          <button
            onClick={() => alert('PowerPoint (PPTX) Deck generated.')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#38BDF8',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            📊 Export PowerPoint
          </button>

          <button
            onClick={() => alert('CSV Raw Vector Dataset downloaded.')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#4ADE80',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            💾 Export CSV
          </button>

          <button
            onClick={() => setIsPresenting(!isPresenting)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F13A1E',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(241, 58, 30, 0.3)'
            }}
          >
            🖥️ {isPresenting ? 'EXIT PRESENTATION' : 'PRESENTATION MODE'}
          </button>
        </div>
      </div>

      {/* ── 2. 5 REPORT TYPE SELECTOR TABS ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {(['agency', 'creator', 'brand', 'client', 'executive'] as ReportType[]).map((rKey) => {
          const r = reports[rKey];
          const isSelected = selectedReportType === rKey;
          return (
            <div
              key={rKey}
              onClick={() => setSelectedReportType(rKey)}
              style={{
                backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(15, 23, 42, 0.8)',
                border: isSelected ? '2px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 900, color: isSelected ? '#38BDF8' : '#94A3B8', textTransform: 'uppercase' }}>
                {r.badge}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
                {rKey.toUpperCase()} REPORT
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 3. PRESENTATION-READY REPORT DOCUMENT CANVAS ────────────────────────── */}
      <div 
        style={{ 
          backgroundColor: isPresenting ? '#090D16' : '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          borderRadius: '16px', 
          padding: isPresenting ? '40px' : '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#F13A1E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {currentReport.badge} • PRESENTATION DELIVERABLE
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
              {currentReport.title}
            </h2>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>{currentReport.subtitle}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#94A3B8', display: 'block' }}>Prepared For:</span>
            <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{currentReport.targetAudience}</strong>
          </div>
        </div>

        {/* 6 Mandatory Content Sections */}

        {/* SECTION 1 & 2: SIMULATION SUMMARY & PREDICTION METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Predicted Views</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>2.3M</div>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>1.8M – 3.1M @ 95% CI</span>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Viral Chance</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>84.6%</div>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>Top 2% Virality Score</span>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Net Followers</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A855F7', fontFamily: 'monospace' }}>+14.8k</div>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>ICP Conversion Match</span>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Monte Carlo Runs</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', fontFamily: 'monospace' }}>10,000</div>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>99.4% Convergence</span>
          </div>
        </div>

        {/* SECTION 3: PRESENTATION CHARTS (SVG VIRALITY RADAR & RETENTION) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px', width: '100%' }}>
              Multimodal Virality Radar Topology
            </span>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.08)" />
              <polygon points="90,25 145,55 145,115 90,150 40,115 40,55" fill="rgba(241, 58, 30, 0.3)" stroke="#F13A1E" strokeWidth="2" />
            </svg>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
              Predicted Viewer Retention Trajectory
            </span>
            <svg width="100%" height="120" viewBox="0 0 300 120">
              <path d="M 0 20 C 40 25, 120 35, 200 40 L 300 55" fill="none" stroke="#38BDF8" strokeWidth="3" />
            </svg>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>30s Retention: <strong style={{ color: '#FFFFFF' }}>76.1%</strong> (vs 48% Niche Average)</span>
          </div>
        </div>

        {/* SECTION 4: KEY ALGORITHMIC INSIGHTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            🧠 KEY ALGORITHMIC & BEHAVIORAL INSIGHTS
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentReport.insights.map((ins, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#E2E8F0' }}>
                • {ins}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: ACTIONABLE AI RECOMMENDATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            💡 ACTIONABLE STRATEGIC RECOMMENDATIONS
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {currentReport.recommendations.map((rec, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#FFFFFF', fontWeight: 700 }}>
                → {rec}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: CONTENT DNA 13-DIMENSION VECTOR SUMMARY */}
        <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
            Multimodal Content DNA Vector Deconstruction
          </span>
          <span style={{ fontSize: '12px', color: '#4ADE80', fontWeight: 900, fontFamily: 'monospace' }}>
            1024D-VEC-9982 • 98.4% Confidence Rating
          </span>
        </div>

      </div>

    </div>
  );
};
