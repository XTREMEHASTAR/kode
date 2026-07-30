import React, { useState } from 'react';

interface Contender {
  id: string;
  isUser: boolean;
  name: string;
  creatorHandle: string;
  rank: number;
  winProbability: number;
  hookScore: number;
  retentionScore: number;
  noveltyScore: number;
  topicOverlapPct: number;
  editingScore: number;
  emotionScore: number;
  audienceMatchScore: number;
  winDrivers: string[];
  lossDrivers: string[];
}

export const ProCompetitionArenaView: React.FC = () => {
  const [biasFilter, setBiasFilter] = useState<'balanced' | 'hook' | 'retention' | 'novelty'>('balanced');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedContenderId, setSelectedContenderId] = useState<string>('user-content');

  // Initial 5 Contenders Data
  const initialContenders: Contender[] = [
    {
      id: 'user-content',
      isUser: true,
      name: 'Reel_Launch_v3.mp4 (Your Upload)',
      creatorHandle: '@veer_workspace',
      rank: 1,
      winProbability: 88.4,
      hookScore: 94,
      retentionScore: 89,
      noveltyScore: 92,
      topicOverlapPct: 100,
      editingScore: 86,
      emotionScore: 87,
      audienceMatchScore: 96,
      winDrivers: [
        '+ Superior 0s-3s pattern interrupt word choice (+12.4% tension delta)',
        '+ Higher audience resonance match with B2B Founders (96% vs 78% avg)',
        '+ Dynamic optical motion velocity in frame 1'
      ],
      lossDrivers: [
        '- Slight audio ducking dip at 14s mark (-2.1% acoustic power)'
      ]
    },
    {
      id: 'comp-a',
      isUser: false,
      name: 'How I Scaled SaaS to $100k',
      creatorHandle: '@viral_creator_x',
      rank: 2,
      winProbability: 76.2,
      hookScore: 88,
      retentionScore: 84,
      noveltyScore: 78,
      topicOverlapPct: 84,
      editingScore: 90,
      emotionScore: 82,
      audienceMatchScore: 86,
      winDrivers: [
        '+ High cut rhythm frequency (0.8 cuts/sec)',
        '+ Established creator authority score (0.92)'
      ],
      lossDrivers: [
        '- Lower novelty index due to generic thumbnail hook (-14% uniqueness)',
        '- Slower 0.0s-1.0s optical flow velocity'
      ]
    },
    {
      id: 'comp-b',
      isUser: false,
      name: '3 Secret AI Tools You Missed',
      creatorHandle: '@growth_hacker_pro',
      rank: 3,
      winProbability: 64.8,
      hookScore: 90,
      retentionScore: 72,
      noveltyScore: 86,
      topicOverlapPct: 76,
      editingScore: 82,
      emotionScore: 88,
      audienceMatchScore: 78,
      winDrivers: [
        '+ High emotional curiosity surge in mid-video',
        '+ Fast visual text overlay popups'
      ],
      lossDrivers: [
        '- High viewer drop-off at 15.0s exposition gap (-18.2% retention drop)',
        '- Weak end-scene CTA prompt'
      ]
    },
    {
      id: 'comp-c',
      isUser: false,
      name: 'Why Most Startups Fail in 2026',
      creatorHandle: '@tech_insider_daily',
      rank: 4,
      winProbability: 52.1,
      hookScore: 78,
      retentionScore: 79,
      noveltyScore: 70,
      topicOverlapPct: 62,
      editingScore: 74,
      emotionScore: 91,
      audienceMatchScore: 82,
      winDrivers: [
        '+ High emotional arousal score (91/100)',
        '+ Strong vocal tone authority'
      ],
      lossDrivers: [
        '- Weak opening 3s hook tension (78/100 vs Your 94/100)',
        '- Topic saturation in feed'
      ]
    },
    {
      id: 'comp-d',
      isUser: false,
      name: 'Uncut Founder Interview',
      creatorHandle: '@media_empire',
      rank: 5,
      winProbability: 41.5,
      hookScore: 68,
      retentionScore: 81,
      noveltyScore: 64,
      topicOverlapPct: 48,
      editingScore: 62,
      emotionScore: 74,
      audienceMatchScore: 70,
      winDrivers: [
        '+ Long watch duration among high-patience viewers'
      ],
      lossDrivers: [
        '- Low initial hook tension (68/100 triggers 42% instant scroll-past)',
        '- Slow editing rhythm (avg 4.2s per shot)'
      ]
    }
  ];

  const [contenders, setContenders] = useState<Contender[]>(initialContenders);

  // Trigger Tournament Simulation (Animates feed position shifts)
  const handleRunSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      // Re-sort contenders based on active bias
      const updated = [...contenders].map((c) => {
        let score = c.winProbability;
        if (biasFilter === 'hook') score = c.hookScore * 0.9 + c.winProbability * 0.1;
        if (biasFilter === 'retention') score = c.retentionScore * 0.9 + c.winProbability * 0.1;
        if (biasFilter === 'novelty') score = c.noveltyScore * 0.9 + c.winProbability * 0.1;
        return { ...c, winProbability: Math.min(99.4, Math.max(30, score + (Math.random() * 4 - 2))) };
      });

      updated.sort((a, b) => b.winProbability - a.winProbability);
      updated.forEach((c, idx) => { c.rank = idx + 1; });

      setContenders(updated);
      setIsSimulating(false);
    }, 800);
  };

  const selectedContender = contenders.find((c) => c.id === selectedContenderId) || contenders[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. COMPETITION ARENA HEADER & SIMULATION CONTROLS ───────────────────── */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', border: '1px solid rgba(241, 58, 30, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              ⚔️ ALGORITHMIC COMPETITION ARENA
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Simulated Feed Position: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>RANK #1 OF 5</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Direct Head-to-Head Feed Tournament Simulation
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Your Upload: <strong style={{ color: '#FFFFFF' }}>Reel_Launch_v3.mp4</strong></span>
            <span>•</span>
            <span>Win Probability: <strong style={{ color: '#4ADE80' }}>88.4% Win Rate</strong></span>
            <span>•</span>
            <span>Niche Saturation: <strong style={{ color: '#FACC15' }}>High (5 Contenders Analyzed)</strong></span>
          </div>
        </div>

        {/* Algorithm Shift Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['balanced', 'hook', 'retention', 'novelty'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBiasFilter(b)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: biasFilter === b ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: biasFilter === b ? '#FFFFFF' : '#94A3B8',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {b}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
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
            {isSimulating ? 'SIMULATING TOURNAMENT...' : '⚡ RUN TOURNAMENT SIMULATION'}
          </button>
        </div>
      </div>

      {/* ── 2. SIMULATED FEED POSITION RANKING BOARD ───────────────────────────── */}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Simulated Feed Placement Leaderboard
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
              Algorithm Feed Placement Ranking (Rank 1st – 5th)
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800, backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
            RANKINGS UPDATED REAL-TIME
          </span>
        </div>

        {/* 5 Contenders Animated Ranking List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contenders.map((c) => {
            const isSelected = selectedContenderId === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedContenderId(c.id)}
                style={{
                  backgroundColor: c.isUser ? 'rgba(74, 222, 128, 0.08)' : (isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(15, 23, 42, 0.8)'),
                  border: c.isUser ? '2px solid #4ADE80' : (isSelected ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)'),
                  borderRadius: '12px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  boxShadow: c.isUser ? '0 0 20px rgba(74, 222, 128, 0.2)' : 'none'
                }}
              >
                {/* Rank & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: c.rank === 1 ? '#4ADE80' : 'rgba(255,255,255,0.1)',
                      color: c.rank === 1 ? '#0F172A' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1rem',
                      fontFamily: 'monospace'
                    }}
                  >
                    #{c.rank}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: c.isUser ? '#4ADE80' : '#FFFFFF' }}>
                        {c.name}
                      </span>
                      {c.isUser && (
                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#0F172A', backgroundColor: '#4ADE80', padding: '2px 6px', borderRadius: '3px' }}>
                          YOUR UPLOAD
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{c.creatorHandle}</span>
                  </div>
                </div>

                {/* 7 Quick Score Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#CBD5E1', fontFamily: 'monospace' }}>
                  <div>Hook: <strong style={{ color: c.hookScore >= 90 ? '#4ADE80' : '#FFFFFF' }}>{c.hookScore}</strong></div>
                  <div>Retention: <strong style={{ color: '#FFFFFF' }}>{c.retentionScore}%</strong></div>
                  <div>Novelty: <strong style={{ color: '#38BDF8' }}>{c.noveltyScore}</strong></div>
                  <div>Editing: <strong style={{ color: '#FFFFFF' }}>{c.editingScore}</strong></div>
                </div>

                {/* Win Probability Gauge */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>Win Rate</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: c.winProbability >= 75 ? '#4ADE80' : (c.winProbability >= 50 ? '#FACC15' : '#F13A1E'), fontFamily: 'monospace' }}>
                    {c.winProbability.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. 7-DIMENSION COMPARISON RADAR & WIN/LOSS EXPLANATION INSPECTOR ───── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }}>
        
        {/* 7-Dimension Comparative SVG Radar Web */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', width: '100%' }}>
            7-Dimension Comparative Spider Web
          </span>

          <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
            <circle cx="120" cy="120" r="90" fill="none" stroke="rgba(255,255,255,0.06)" />
            <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(255,255,255,0.06)" />
            <circle cx="120" cy="120" r="30" fill="none" stroke="rgba(255,255,255,0.06)" />

            {/* 7 Radar Spoke Axes */}
            {['Hook', 'Retention', 'Novelty', 'Overlap', 'Editing', 'Emotion', 'Audience'].map((dim, i) => {
              const angle = (Math.PI * 2 / 7) * i - Math.PI / 2;
              const x2 = 120 + 90 * Math.cos(angle);
              const y2 = 120 + 90 * Math.sin(angle);
              return (
                <g key={i}>
                  <line x1="120" y1="120" x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" />
                  <text x={120 + 105 * Math.cos(angle)} y={120 + 105 * Math.sin(angle) + 3} fill="#94A3B8" fontSize="9" fontWeight="700" textAnchor="middle">
                    {dim}
                  </text>
                </g>
              );
            })}

            {/* Your Upload Radar Polygon (Green) */}
            <polygon points="120,35 190,75 190,140 120,185 55,140 55,75 80,45" fill="rgba(74, 222, 128, 0.25)" stroke="#4ADE80" strokeWidth="2.5" />
            
            {/* Competitor Radar Polygon (Red) */}
            <polygon points="120,50 170,85 160,130 120,165 70,130 70,85 95,60" fill="rgba(241, 58, 30, 0.15)" stroke="#F13A1E" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>

          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#94A3B8', marginTop: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#4ADE80', borderRadius: '50%' }}></span> Your Content
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#F13A1E', borderRadius: '50%' }}></span> Competitor Baseline
            </span>
          </div>
        </div>

        {/* Detailed AI Win / Loss Explanation Inspector */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI DECONSTRUCTION INSPECTOR
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
              Why {selectedContender.name} {selectedContender.isUser ? 'Wins' : `Ranks #${selectedContender.rank}`}
            </h3>
          </div>

          {/* Win Drivers */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>
              🟢 WINNING ADVANTAGES (+ DRIVERS)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedContender.winDrivers.map((w, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#FFFFFF' }}>
                  {w}
                </div>
              ))}
            </div>
          </div>

          {/* Loss Drivers */}
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#F13A1E', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 0' }}>
              🔴 LOSING DRAG FACTORS (- DRIVERS)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {selectedContender.lossDrivers.map((l, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(241, 58, 30, 0.08)', border: '1px solid rgba(241, 58, 30, 0.2)', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#FFFFFF' }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
