import React, { useState, useEffect } from 'react';

interface ReplayMilestone {
  timeSec: number;
  timeDisplay: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  description: string;
  algorithmDelta: string;
  agentMemory: string;
  decisionState: string;
}

export const ProSimulationReplayView: React.FC = () => {
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(1.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // 9 Replay Timeline Milestones
  const milestones: ReplayMilestone[] = [
    {
      timeSec: 0.0,
      timeDisplay: '00:00.0',
      title: 'Video Uploaded & Fingerprinted',
      category: 'INIT',
      icon: '📤',
      color: '#38BDF8',
      description: 'Video file uploaded to pipeline. 1024D multimodal semantic vector generated.',
      algorithmDelta: 'Vector HNSW index populated with 1024D feature embedding.',
      agentMemory: 'Initial impression state initialized across 10.4M synthetic agents.',
      decisionState: 'System Ready'
    },
    {
      timeSec: 0.4,
      timeDisplay: '00:00.4',
      title: 'Viewer Sees Video',
      category: 'IMPRESSION',
      icon: '👁️',
      color: '#4ADE80',
      description: 'Pattern interrupt text overlay ("Stop wasting your...") catches initial gaze.',
      algorithmDelta: 'Gaze tension score logged at 94/100.',
      agentMemory: 'Visual memory register updated: High optical motion detected.',
      decisionState: 'GAZE_LOCKED — Continue watching frame sequence.'
    },
    {
      timeSec: 1.2,
      timeDisplay: '00:01.2',
      title: 'Viewer Watches',
      category: 'RETENTION',
      icon: '⏱️',
      color: '#4ADE80',
      description: 'Viewer maintains focal gaze. Speech pacing (3.84 syl/sec) holds high interest.',
      algorithmDelta: 'Early retention curve holding 96.4% threshold.',
      agentMemory: 'Acoustic clarity memory positive bias (+18%).',
      decisionState: 'WATCHING — Evaluating curiosity gap payoff.'
    },
    {
      timeSec: 3.5,
      timeDisplay: '00:03.5',
      title: 'Viewer Skips',
      category: 'DROP_OFF',
      icon: '⏭️',
      color: '#F13A1E',
      description: 'Micro drop-off event in low-patience cohort #42 (5.2% of viewers scroll past).',
      algorithmDelta: 'Calculated initial 3s hook retention rate: 94.8%.',
      agentMemory: 'Cohort #42 logged impatience event.',
      decisionState: 'SKIPPED — Agent #4102 scrolled to next feed item.'
    },
    {
      timeSec: 4.2,
      timeDisplay: '00:04.2',
      title: 'Algorithm Reacts',
      category: 'RECALIBRATION',
      icon: '⚡',
      color: '#FACC15',
      description: 'Two-Tower recommendation model recalculates item weight (+12% Hook score boost).',
      algorithmDelta: 'Item priority rank bumped from #4 to #1 in Candidate Queue.',
      agentMemory: 'Swarm recommendation weights updated.',
      decisionState: 'QUALIFIED — Unlocking Wave 1 dispatch.'
    },
    {
      timeSec: 12.0,
      timeDisplay: '00:12.0',
      title: 'Wave Expands',
      category: 'EXPANSION',
      icon: '🚀',
      color: '#38BDF8',
      description: 'Seed Cohort passes 88.4% qualification threshold. Wave 2 (Niche Explore) unlocked.',
      algorithmDelta: 'Dispatching candidates to 10,000 adjacent niche creators.',
      agentMemory: 'Cluster #01 & #02 agents receiving feed pushes.',
      decisionState: 'DISPATCHING — GraphSAGE Neighbor Expansion.'
    },
    {
      timeSec: 18.5,
      timeDisplay: '00:18.5',
      title: 'Comments Begin',
      category: 'ENGAGEMENT',
      icon: '💬',
      color: '#A855F7',
      description: 'Viewer @alex_growth_hacks posts comment: "Need this workflow template!"',
      algorithmDelta: 'Comment velocity spike (+4.2% engagement boost).',
      agentMemory: 'Social proof memory stack activated (+24%).',
      decisionState: 'COMMENT_POSTED — High intent user conversation.'
    },
    {
      timeSec: 28.0,
      timeDisplay: '00:28.0',
      title: 'Shares Increase',
      category: 'VIRALITY',
      icon: '🔗',
      color: '#4ADE80',
      description: 'Relatable value drop checklist causes +14% share spike to DM groups.',
      algorithmDelta: 'Viral spread coefficient R0 increased to 2.84.',
      agentMemory: 'High utility bookmarking event logged.',
      decisionState: 'SHARED — Direct Message share action triggered.'
    },
    {
      timeSec: 45.0,
      timeDisplay: '00:45.0',
      title: 'Trend Starts',
      category: 'GLOBAL_FEED',
      icon: '🌊',
      color: '#F13A1E',
      description: 'Hawkes point-process surge triggers global feed expansion (100,000+ views).',
      algorithmDelta: 'Global feed qualification unlocked. Peak virality active.',
      agentMemory: 'Global platform ecosystem momentum peak.',
      decisionState: 'VIRAL_SURGE — Global feed algorithm priority.'
    }
  ];

  // Playhead Auto Advance Timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTimeSec((prev) => {
          if (prev >= 45.2) return 0;
          return +(prev + 0.5 * playbackSpeed).toFixed(1);
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Find nearest active milestone
  const activeMilestone = milestones.reduce((prev, curr) => {
    return Math.abs(curr.timeSec - currentTimeSec) < Math.abs(prev.timeSec - currentTimeSec) ? curr : prev;
  }, milestones[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. DEVTOOLS REPLAY HEADER & PLAYER CONTROLS ────────────────────────── */}
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
              🎮 SOCIAL MEDIA DEVTOOLS • SIMULATION REPLAY
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Playhead Timecode: <span style={{ color: '#38BDF8', fontFamily: 'monospace', fontSize: '14px', fontWeight: 900 }}>{currentTimeSec.toFixed(1)}s / 45.2s</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Game-Replay DevTools Inspection Studio
          </h1>
        </div>

        {/* Playback Controls & Speed Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Speed Selector */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {[0.5, 1.0, 2.0, 4.0].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: playbackSpeed === s ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: playbackSpeed === s ? '#FFFFFF' : '#94A3B8',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Jump to Start */}
          <button
            onClick={() => setCurrentTimeSec(0.0)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.12)',
              backgroundColor: 'rgba(255,255,255,0.05)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            ⏪ REWIND
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isPlaying ? '#F13A1E' : '#10B981',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: isPlaying ? '0 4px 12px rgba(241, 58, 30, 0.3)' : '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            {isPlaying ? '⏸ PAUSE REPLAY' : '▶ PLAY REPLAY'}
          </button>
        </div>
      </div>

      {/* ── 2. INTERACTIVE TIMECODE SCRUBBER & MILESTONE TICK MARKS ────────────── */}
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
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Interactive Timecode Scrubber & Event Keyframes
          </span>
          <span style={{ fontSize: '11px', color: activeMilestone.color, fontWeight: 800 }}>
            Active Milestone: {activeMilestone.title} ({activeMilestone.timeDisplay})
          </span>
        </div>

        {/* Range Slider Scrubber */}
        <input 
          type="range"
          min="0"
          max="45.2"
          step="0.1"
          value={currentTimeSec}
          onChange={(e) => {
            setCurrentTimeSec(parseFloat(e.target.value));
            setIsPlaying(false);
          }}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            accentColor: '#38BDF8',
            cursor: 'pointer'
          }}
        />

        {/* Jump-to-Event Milestone Pins */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          {milestones.map((m) => {
            const isActive = Math.abs(m.timeSec - currentTimeSec) < 1.5;
            return (
              <button
                key={m.timeDisplay}
                onClick={() => {
                  setCurrentTimeSec(m.timeSec);
                  setIsPlaying(false);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: isActive ? `1.5px solid ${m.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'rgba(15, 23, 42, 0.8)',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{m.icon}</span>
                <span>{m.title}</span>
                <span style={{ fontSize: '9px', fontFamily: 'monospace', color: m.color }}>({m.timeDisplay})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. DEVTOOLS AGENT DECISION & ALGORITHM INSPECTOR ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* Playhead Event Deconstruction */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: activeMilestone.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                PLAYHEAD TIMELINE EVENT ({activeMilestone.timeDisplay})
              </span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                {activeMilestone.icon} {activeMilestone.title}
              </h3>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#0F172A', backgroundColor: activeMilestone.color, padding: '3px 8px', borderRadius: '4px' }}>
              {activeMilestone.category}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: '#E2E8F0', margin: 0, lineHeight: '1.5', backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', borderLeft: `3px solid ${activeMilestone.color}` }}>
            {activeMilestone.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
              ⚡ Algorithm Recalibration Log
            </h4>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#38BDF8', fontFamily: 'monospace' }}>
              {activeMilestone.algorithmDelta}
            </div>
          </div>
        </div>

        {/* Chrome DevTools Style Agent Inspector */}
        <div style={{ backgroundColor: '#0B0F19', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              💻 CHROME DEVTOOLS • AGENT INSPECTOR
            </span>
            <span style={{ fontSize: '10px', color: '#4ADE80', fontFamily: 'monospace' }}>
              Agent #9982 (SaaS Founder)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#94A3B8' }}>Active Decision State: </span>
              <strong style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{activeMilestone.decisionState}</strong>
            </div>

            <div>
              <span style={{ color: '#94A3B8' }}>Agent Memory Register: </span>
              <div style={{ color: '#E2E8F0', marginTop: '4px', backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px', fontSize: '11.5px' }}>
                🧠 {activeMilestone.agentMemory}
              </div>
            </div>

            <div>
              <span style={{ color: '#94A3B8' }}>Physical Behavior: </span>
              <div style={{ color: '#CBD5E1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'monospace', fontSize: '11px' }}>
                <div>Gaze Lock: <strong>94%</strong></div>
                <div>Scroll Velocity: <strong>12.4 px/ms</strong></div>
                <div>Skip Probability: <strong>5.2%</strong></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
