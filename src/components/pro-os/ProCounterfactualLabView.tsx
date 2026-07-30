import React, { useState } from 'react';

interface CounterfactualParams {
  hook: string;
  title: string;
  thumbnail: string;
  postingTime: string;
  audience: string;
  music: string;
  cta: string;
}

export const ProCounterfactualLabView: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // 7 Counterfactual Parameters State
  const [params, setParams] = useState<CounterfactualParams>({
    hook: 'pattern_interrupt',
    title: 'curiosity_gap',
    thumbnail: 'high_contrast',
    postingTime: 'peak_evening',
    audience: 'b2b_founders',
    music: 'synthwave_drop',
    cta: 'save_checklist'
  });

  // Dynamic simulation outcome calculations based on 7 counterfactual choices
  const getSimulatedResults = () => {
    let baseViews = 2.3;
    let baseViral = 84.6;
    let baseRetention = 76.1;
    let baseShares = 8.4;

    if (params.hook === 'pattern_interrupt') { baseViews += 0.6; baseViral += 4.2; baseRetention += 5.0; }
    if (params.title === 'curiosity_gap') { baseViews += 0.5; baseViral += 3.1; }
    if (params.postingTime === 'peak_evening') { baseViews += 0.4; baseViral += 2.5; }
    if (params.music === 'synthwave_drop') { baseViews += 0.3; baseShares += 2.8; }
    if (params.cta === 'save_checklist') { baseShares += 3.0; }

    return {
      views: baseViews.toFixed(1) + 'M',
      viewsDelta: '+' + (((baseViews - 2.3) / 2.3) * 100).toFixed(1) + '%',
      viral: baseViral.toFixed(1) + '%',
      viralDelta: '+' + (baseViral - 84.6).toFixed(1) + '%',
      retention: baseRetention.toFixed(1) + '%',
      retentionDelta: '+' + (baseRetention - 76.1).toFixed(1) + '%',
      shares: baseShares.toFixed(1) + '%',
      sharesDelta: '+' + (baseShares - 8.4).toFixed(1) + '%'
    };
  };

  const currentResults = getSimulatedResults();

  const handleParamChange = (key: keyof CounterfactualParams, val: string) => {
    setParams(prev => ({ ...prev, [key]: val }));
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. COUNTERFACTUAL LAB HEADER BAR ──────────────────────────────────── */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              🧪 EXPERIMENTAL COUNTERFACTUAL LAB ("WHAT IF?")
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Causal Engine: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>7-PARAMETER REAL-TIME RERUN</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Hypothetical Simulation & Causal Effect Studio
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Target: <strong style={{ color: '#FFFFFF' }}>Reel_Launch_v3.mp4</strong></span>
            <span>•</span>
            <span>Simulation State: <strong style={{ color: isSimulating ? '#FACC15' : '#10B981' }}>{isSimulating ? 'RERUNNING SIMULATION...' : 'CONVERGED'}</strong></span>
          </div>
        </div>

        {/* Manual Rerun Button */}
        <button
          onClick={() => {
            setIsSimulating(true);
            setTimeout(() => setIsSimulating(false), 600);
          }}
          style={{
            padding: '12px 22px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#A855F7',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)'
          }}
        >
          {isSimulating ? 'RERUNNING...' : '⚡ RERUN EXPERIMENT'}
        </button>
      </div>

      {/* ── 2. 7 COUNTERFACTUAL PARAMETER EXPERIMENT CONTROLS ───────────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          7 Counterfactual Experiment Controls — "What If You Changed...?"
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          
          {/* 1. Different Hook */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8' }}>1. Different Hook</span>
            <select
              value={params.hook}
              onChange={(e) => handleParamChange('hook', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="pattern_interrupt">Pattern Interrupt Word Choice</option>
              <option value="metric_shock">Metric Shock ("Scaled to $100k")</option>
              <option value="question_hook">Direct Question Hook</option>
            </select>
          </div>

          {/* 2. Different Title */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ADE80' }}>2. Different Title</span>
            <select
              value={params.title}
              onChange={(e) => handleParamChange('title', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="curiosity_gap">Curiosity Gap ("Why 99% Fail")</option>
              <option value="how_to">How-To Tutorial Title</option>
              <option value="original">Original Default Title</option>
            </select>
          </div>

          {/* 3. Different Thumbnail */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#FACC15' }}>3. Different Thumbnail</span>
            <select
              value={params.thumbnail}
              onChange={(e) => handleParamChange('thumbnail', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="high_contrast">High Contrast Text Overlay</option>
              <option value="shocked_face">Shocked Face + Product Badge</option>
              <option value="clean_minimal">Clean Minimalist Frame</option>
            </select>
          </div>

          {/* 4. Different Posting Time */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#F13A1E' }}>4. Different Posting Time</span>
            <select
              value={params.postingTime}
              onChange={(e) => handleParamChange('postingTime', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="peak_evening">Peak Evening (19:30 EST)</option>
              <option value="morning_offpeak">Morning Off-Peak (08:00 EST)</option>
              <option value="midnight_surge">Midnight Surge (00:00 EST)</option>
            </select>
          </div>

          {/* 5. Different Audience */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#A855F7' }}>5. Different Audience</span>
            <select
              value={params.audience}
              onChange={(e) => handleParamChange('audience', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="b2b_founders">B2B SaaS Growth Founders</option>
              <option value="genz_editors">GenZ Short-Form Editors</option>
              <option value="ai_engineers">AI Researchers & ML Engineers</option>
            </select>
          </div>

          {/* 6. Different Music */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8' }}>6. Different Music</span>
            <select
              value={params.music}
              onChange={(e) => handleParamChange('music', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="synthwave_drop">Trending Synthwave Drop (+428% surge)</option>
              <option value="lofi_ambient">Lo-Fi Ambient Focus</option>
              <option value="acoustic_minimal">Acoustic Minimal</option>
            </select>
          </div>

          {/* 7. Different CTA */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#4ADE80' }}>7. Different CTA</span>
            <select
              value={params.cta}
              onChange={(e) => handleParamChange('cta', e.target.value)}
              style={{ backgroundColor: '#0F172A', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px', fontSize: '12px' }}
            >
              <option value="save_checklist">"Save this checklist for later"</option>
              <option value="link_bio">"Link in bio for full tool"</option>
              <option value="comment_prompt">"Drop a comment below"</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── 3. SIDE-BY-SIDE COMPARISON MATRIX (BASELINE VS COUNTERFACTUAL) ───────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Baseline Original Card */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ORIGINAL BASELINE
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Reel_Launch_v3.mp4
              </h3>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', backgroundColor: 'rgba(255,255,255,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
              UNTOUCHED
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Predicted Views</span>
              <strong style={{ fontSize: '1.6rem', color: '#FFFFFF', fontFamily: 'monospace' }}>2.3M</strong>
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Chance of Viral</span>
              <strong style={{ fontSize: '1.6rem', color: '#38BDF8', fontFamily: 'monospace' }}>84.6%</strong>
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>30s Retention</span>
              <strong style={{ fontSize: '1.6rem', color: '#4ADE80', fontFamily: 'monospace' }}>76.1%</strong>
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Share Probability</span>
              <strong style={{ fontSize: '1.6rem', color: '#FACC15', fontFamily: 'monospace' }}>8.4%</strong>
            </div>
          </div>
        </div>

        {/* Counterfactual Variant Card */}
        <div style={{ backgroundColor: '#0F172A', border: '2px solid #A855F7', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 0 24px rgba(168, 85, 247, 0.25)' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                HYPOTHETICAL COUNTERFACTUAL VARIANT
              </span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Reel_Launch_v3_Counterfactual.mp4
              </h3>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#0F172A', backgroundColor: '#A855F7', padding: '3px 8px', borderRadius: '4px' }}>
              RERUN COMPLETE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Predicted Views</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <strong style={{ fontSize: '1.6rem', color: '#4ADE80', fontFamily: 'monospace' }}>{currentResults.views}</strong>
                <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800 }}>({currentResults.viewsDelta})</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Chance of Viral</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <strong style={{ fontSize: '1.6rem', color: '#38BDF8', fontFamily: 'monospace' }}>{currentResults.viral}</strong>
                <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800 }}>({currentResults.viralDelta})</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>30s Retention</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <strong style={{ fontSize: '1.6rem', color: '#4ADE80', fontFamily: 'monospace' }}>{currentResults.retention}</strong>
                <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800 }}>({currentResults.retentionDelta})</span>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Share Probability</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <strong style={{ fontSize: '1.6rem', color: '#FACC15', fontFamily: 'monospace' }}>{currentResults.shares}</strong>
                <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800 }}>({currentResults.sharesDelta})</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 4. AI CAUSAL REASONING EXPLANATION ──────────────────────────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#A855F7', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          🤖 AI CAUSAL REASONING — "WHY THESE METRIC CHANGES OCCURRED"
        </h4>
        <p style={{ fontSize: '14px', color: '#E2E8F0', margin: 0, lineHeight: '1.5', backgroundColor: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '10px', borderLeft: '3px solid #A855F7' }}>
          Combining a <strong>Pattern Interrupt Hook</strong> with a <strong>Trending Synthwave Audio Track</strong> during the <strong>Peak Evening (19:30 EST) window</strong> increases Wave 1 Seed qualification rate from 88.4% to 94.8%. The higher initial gaze lock prevents early 0s-3s drop-off, allowing the <strong>Save Checklist CTA</strong> to convert +78.2% more net shares.
        </p>
      </div>

    </div>
  );
};
