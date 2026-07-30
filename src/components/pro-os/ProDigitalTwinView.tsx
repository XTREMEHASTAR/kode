import React, { useState } from 'react';

interface CreatorTwin {
  id: string;
  name: string;
  avatarIcon: string;
  archetype: string;
  color: string;
  predictedViews: string;
  viralChance: string;
  audience: string;
  postingStyle: {
    velocity: string;
    hookFreq: string;
    shotLength: string;
  };
  authority: {
    ratio: string;
    domainScore: number;
  };
  memoryStack: string[];
  brandVoice: {
    archetypeFit: number;
    authenticityPct: number;
    forbiddenWords: string[];
  };
  community: {
    cohesion: number;
    loyaltyPct: number;
    commentRate: string;
  };
  growthHistory: { month: string; followers: string }[];
}

export const ProDigitalTwinView: React.FC = () => {
  const [selectedTwinId, setSelectedTwinId] = useState<string>('veer-twin');
  const [isRerunning, setIsRerunning] = useState<boolean>(false);

  // 3 Digital Twins Data (Character Builder Meets AI Research)
  const twins: Record<string, CreatorTwin> = {
    'veer-twin': {
      id: 'veer-twin',
      name: 'Veer (Growth Founder Twin)',
      avatarIcon: '🚀',
      archetype: 'High-Authority B2B Leader',
      color: '#4ADE80',
      predictedViews: '2.3M',
      viralChance: '84.6%',
      audience: 'B2B SaaS Founders, Tech CEOs, Growth Marketers (ICP Match 96%)',
      postingStyle: {
        velocity: '3.84 syllables/sec',
        hookFreq: 'Pattern Interrupt every 12s',
        shotLength: '1.84s average shot duration'
      },
      authority: {
        ratio: '70:30 (Authority:Warmth)',
        domainScore: 94
      },
      memoryStack: [
        'Indexed 48 past video campaigns (Mean Virality Score: 91.2/100)',
        'Positive audience bias for SaaS growth checklists (+34%)',
        'Stored memory of B2B founder conversion vectors'
      ],
      brandVoice: {
        archetypeFit: 96,
        authenticityPct: 98,
        forbiddenWords: ['Synergy', 'Guru', 'Get Rich Quick', 'Secret Loophole']
      },
      community: {
        cohesion: 0.94,
        loyaltyPct: 92,
        commentRate: '6.4%'
      },
      growthHistory: [
        { month: 'M1', followers: '10K' },
        { month: 'M3', followers: '45K' },
        { month: 'M6', followers: '120K' },
        { month: 'M9', followers: '280K' },
        { month: 'M12', followers: '450K' }
      ]
    },
    'sarah-twin': {
      id: 'sarah-twin',
      name: 'Sarah (Editing FX Twin)',
      avatarIcon: '🎬',
      archetype: 'High-Entropy Visual Craftsman',
      color: '#38BDF8',
      predictedViews: '3.8M',
      viralChance: '94.2%',
      audience: 'Short-Form Editors, CapCut Creators, GenZ Visual Artists (ICP Match 94%)',
      postingStyle: {
        velocity: '4.20 syllables/sec',
        hookFreq: 'Optical Flow Surprise every 6s',
        shotLength: '1.12s rapid cut cadence'
      },
      authority: {
        ratio: '40:60 (Authority:Warmth)',
        domainScore: 88
      },
      memoryStack: [
        'Indexed 120 Premiere Pro & After Effects project templates',
        'Positive audience bias for 60fps fast optical motion (+42%)',
        'Stored memory of CapCut audio drop trends'
      ],
      brandVoice: {
        archetypeFit: 92,
        authenticityPct: 96,
        forbiddenWords: ['Corporate', 'Boring', 'Slow Pacing']
      },
      community: {
        cohesion: 0.88,
        loyaltyPct: 88,
        commentRate: '8.2%'
      },
      growthHistory: [
        { month: 'M1', followers: '25K' },
        { month: 'M3', followers: '110K' },
        { month: 'M6', followers: '320K' },
        { month: 'M9', followers: '680K' },
        { month: 'M12', followers: '1.2M' }
      ]
    },
    'alex-twin': {
      id: 'alex-twin',
      name: 'Alex (AI Research Twin)',
      avatarIcon: '🤖',
      archetype: 'Deep Technical ML Analyst',
      color: '#FACC15',
      predictedViews: '1.9M',
      viralChance: '76.8%',
      audience: 'ML Engineers, Data Scientists, AI Researchers (ICP Match 98%)',
      postingStyle: {
        velocity: '3.12 syllables/sec',
        hookFreq: 'Paper Citation & Metric Shock every 15s',
        shotLength: '2.40s structured code shot duration'
      },
      authority: {
        ratio: '90:10 (Authority:Warmth)',
        domainScore: 98
      },
      memoryStack: [
        'Indexed 450 arXiv AI papers and HuggingFace leaderboards',
        'Extreme negative bias against clickbait hype (-68%)',
        'Stored memory of PyTorch & Transformer benchmark code'
      ],
      brandVoice: {
        archetypeFit: 98,
        authenticityPct: 99,
        forbiddenWords: ['Magic', 'Instant Money', 'No Coding Needed']
      },
      community: {
        cohesion: 0.96,
        loyaltyPct: 95,
        commentRate: '5.1%'
      },
      growthHistory: [
        { month: 'M1', followers: '8K' },
        { month: 'M3', followers: '35K' },
        { month: 'M6', followers: '95K' },
        { month: 'M9', followers: '180K' },
        { month: 'M12', followers: '310K' }
      ]
    }
  };

  const currentTwin = twins[selectedTwinId] || twins['veer-twin'];

  const handleTwinChange = (id: string) => {
    setSelectedTwinId(id);
    setIsRerunning(true);
    setTimeout(() => setIsRerunning(false), 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. DIGITAL TWIN STUDIO HEADER BAR ─────────────────────────────────── */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              👤 AUTONOMOUS DIGITAL TWIN STUDIO
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Active Twin: <span style={{ color: currentTwin.color, fontFamily: 'monospace' }}>{currentTwin.name}</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Character Builder & AI Creator Persona Research
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Archetype: <strong style={{ color: '#FFFFFF' }}>{currentTwin.archetype}</strong></span>
            <span>•</span>
            <span>Predicted Reach: <strong style={{ color: '#4ADE80' }}>{currentTwin.predictedViews} Views</strong></span>
            <span>•</span>
            <span>Simulation State: <strong style={{ color: isRerunning ? '#FACC15' : '#10B981' }}>{isRerunning ? 'RERUNNING SIMULATION...' : 'CONVERGED'}</strong></span>
          </div>
        </div>

        {/* Digital Twin Selector Switcher */}
        <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', gap: '6px' }}>
          {Object.values(twins).map((t) => (
            <button
              key={t.id}
              onClick={() => handleTwinChange(t.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: selectedTwinId === t.id ? `1.5px solid ${t.color}` : 'none',
                backgroundColor: selectedTwinId === t.id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: selectedTwinId === t.id ? '#FFFFFF' : '#94A3B8',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{t.avatarIcon}</span>
              <span>{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. 7 DIGITAL TWIN CREATOR PROPERTIES ───────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Properties Column 1 (Audience, Posting Style, Authority, Brand Voice) */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{currentTwin.avatarIcon}</span>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: currentTwin.color, textTransform: 'uppercase' }}>{currentTwin.archetype}</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>{currentTwin.name} Persona Profile</h3>
            </div>
          </div>

          {/* 1. Audience */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 4px 0' }}>1. Target Audience & Swarm Cluster</h4>
            <div style={{ fontSize: '13px', color: '#FFFFFF', backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              {currentTwin.audience}
            </div>
          </div>

          {/* 2. Posting Style */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 4px 0' }}>2. Posting & Pacing Style</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>Velocity: <strong style={{ color: '#4ADE80' }}>{currentTwin.postingStyle.velocity}</strong></div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>Hooks: <strong style={{ color: '#38BDF8' }}>{currentTwin.postingStyle.hookFreq}</strong></div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}>Cadence: <strong style={{ color: '#FFFFFF' }}>{currentTwin.postingStyle.shotLength}</strong></div>
            </div>
          </div>

          {/* 3. Authority */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 4px 0' }}>3. Authority & Persona Balance</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
              <span>Ratio: <strong style={{ color: '#FFFFFF' }}>{currentTwin.authority.ratio}</strong></span>
              <span>Domain Authority Score: <strong style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{currentTwin.authority.domainScore}/100</strong></span>
            </div>
          </div>

          {/* 5. Brand Voice */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 4px 0' }}>5. Brand Voice & Vocabulary</h4>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Archetype Fit: <strong style={{ color: '#4ADE80' }}>{currentTwin.brandVoice.archetypeFit}%</strong> | Authenticity: <strong style={{ color: '#38BDF8' }}>{currentTwin.brandVoice.authenticityPct}%</strong></div>
              <div>Forbidden Words: <span style={{ color: '#F13A1E' }}>{currentTwin.brandVoice.forbiddenWords.join(', ')}</span></div>
            </div>
          </div>
        </div>

        {/* Properties Column 2 (Memory Stack, Community, Growth History) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 4. Memory */}
          <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', margin: 0 }}>4. Long-Term Brand Memory Stack</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentTwin.memoryStack.map((mem, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1' }}>
                  🧠 {mem}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Community */}
          <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', margin: 0 }}>6. Community Tribe Cohesion</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11.5px' }}>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>Cohesion: <strong style={{ color: '#4ADE80' }}>{currentTwin.community.cohesion}</strong></div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>Loyalty: <strong style={{ color: '#38BDF8' }}>{currentTwin.community.loyaltyPct}%</strong></div>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>Comment Rate: <strong style={{ color: '#FACC15' }}>{currentTwin.community.commentRate}</strong></div>
            </div>
          </div>

          {/* 7. Growth History (12-Month Trajectory) */}
          <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#FACC15', textTransform: 'uppercase', margin: 0 }}>7. 12-Month Growth Evolution Trajectory</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', textAlign: 'center' }}>
              {currentTwin.growthHistory.map((g, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px 6px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '9.5px', color: '#94A3B8', display: 'block' }}>{g.month}</span>
                  <strong style={{ fontSize: '13px', color: currentTwin.color, fontFamily: 'monospace' }}>{g.followers}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
