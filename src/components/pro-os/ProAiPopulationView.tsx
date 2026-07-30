import React, { useState } from 'react';

interface SwarmArchetype {
  id: string;
  name: string;
  cluster: string;
  size: string;
  sharePct: number;
  avatarIcon: string;
  color: string;
  demographics: {
    age: string;
    role: string;
    geo: string;
    income: string;
  };
  psychology: {
    curiosity: number;
    skepticism: number;
    patience: number;
    authorityWeight: number;
  };
  rates: {
    comment: string;
    share: string;
    follow: string;
  };
  behavior: {
    scrollSpeed: string;
    patternInterruptMs: string;
    skipThresholdSec: string;
  };
  decisionTree: string[];
  memoryStack: string[];
  interests: string[];
  aiReasoning: string;
}

export const ProAiPopulationView: React.FC = () => {
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('saas-founders');
  const [activeTab, setActiveTab] = useState<'overview' | 'behavior' | 'decision' | 'memory' | 'reasoning'>('overview');

  // 5 Detailed Swarm Clusters / Archetypes
  const swarmArchetypes: Record<string, SwarmArchetype> = {
    'saas-founders': {
      id: 'saas-founders',
      name: 'B2B SaaS Growth Founders',
      cluster: 'Cluster #01 • High-Intent Leadership',
      size: '2.8M Agents',
      sharePct: 26.8,
      avatarIcon: '🚀',
      color: '#4ADE80',
      demographics: {
        age: '28 - 44 yrs',
        role: 'Founder / CEO / VP Growth',
        geo: 'US, UK, EU',
        income: '$150k - $500k+'
      },
      psychology: {
        curiosity: 94,
        skepticism: 78,
        patience: 32,
        authorityWeight: 88
      },
      rates: {
        comment: '6.4%',
        share: '12.8%',
        follow: '5.2%'
      },
      behavior: {
        scrollSpeed: '12.4 px/ms (Aggressive)',
        patternInterruptMs: '94ms (Rapid Gaze Lock)',
        skipThresholdSec: '1.8s (Strict Hook Window)'
      },
      decisionTree: [
        '0.0s: Detect B2B value keyword in first 1.2s text overlay → Pass',
        '0.8s: Evaluate speaker authority & lighting setup → Pass (+18% weight)',
        '2.4s: Test logic coherence of primary thesis → Pass',
        '18.0s: Check for actionable checklist or metric ROI → Trigger Save/Share Action'
      ],
      memoryStack: [
        'Impressions from previous 4 videos by @alex_growth_hacks (Positive Bias +14%)',
        'Negative bias against generic motivational fluff (-32%)',
        'Stored interest in AI-assisted cold outreach pipelines'
      ],
      interests: ['B2B Growth', 'SaaS Metrics', 'AI Automation', 'Venture Capital', 'Cold Email Systems'],
      aiReasoning: 'Agent #9982 selected "SHARE WITH TEAM" because the 28s value checklist matched internal SaaS growth taxonomy with 0.94 cosine similarity, triggering high professional utility reward.'
    },
    'shortform-editors': {
      id: 'shortform-editors',
      name: 'Short-Form Editors & FX Artists',
      cluster: 'Cluster #02 • Visual Craftsmen',
      size: '3.4M Agents',
      sharePct: 32.6,
      avatarIcon: '🎬',
      color: '#38BDF8',
      demographics: {
        age: '18 - 26 yrs',
        role: 'Video Editor / Motion Graphic Designer',
        geo: 'Global (US, APAC, LATAM)',
        income: '$40k - $120k'
      },
      psychology: {
        curiosity: 96,
        skepticism: 45,
        patience: 54,
        authorityWeight: 62
      },
      rates: {
        comment: '8.2%',
        share: '15.4%',
        follow: '7.8%'
      },
      behavior: {
        scrollSpeed: '8.2 px/ms (Scanners)',
        patternInterruptMs: '120ms (Optical Flow Focus)',
        skipThresholdSec: '2.4s (Cut Rhythm Window)'
      },
      decisionTree: [
        '0.0s: Analyze optical flow velocity & cut frequency → Pass',
        '1.0s: Evaluate sound design transients & bass drop → Pass (+24% weight)',
        '3.2s: Inspect text animation typography and keyframing → Pass',
        '24.0s: Bookmark edit template for personal project reference → Trigger Bookmark Action'
      ],
      memoryStack: [
        'High recollection of CapCut & Premiere Pro tutorial templates',
        'Positive bias towards 60fps high-entropy optical motion (+28%)',
        'Low tolerance for static single-angle talking heads'
      ],
      interests: ['After Effects', 'Optical Flow', 'Sound Design', 'CapCut Templates', 'Color Grading'],
      aiReasoning: 'Agent #4412 selected "SAVE TO BOOKMARKS" due to a 98.4% match in sound-to-cut synchronization, identifying the clip as a benchmark editing template.'
    },
    'ai-researchers': {
      id: 'ai-researchers',
      name: 'AI Researchers & ML Engineers',
      cluster: 'Cluster #03 • Deep Technical Analysts',
      size: '2.1M Agents',
      sharePct: 20.1,
      avatarIcon: '🤖',
      color: '#FACC15',
      demographics: {
        age: '24 - 38 yrs',
        role: 'ML Engineer / AI Researcher / Data Scientist',
        geo: 'US, EU, East Asia',
        income: '$180k - $450k'
      },
      psychology: {
        curiosity: 98,
        skepticism: 92,
        patience: 68,
        authorityWeight: 95
      },
      rates: {
        comment: '5.1%',
        share: '9.8%',
        follow: '4.6%'
      },
      behavior: {
        scrollSpeed: '6.4 px/ms (Methodical Analyst)',
        patternInterruptMs: '180ms (Information Density Check)',
        skipThresholdSec: '3.0s (Mathematical Rigor Window)'
      },
      decisionTree: [
        '0.0s: Check for empirical claim accuracy in title → Pass',
        '1.5s: Screen for sensationalized AI hype clickbait → Pass (Non-hype verified)',
        '4.0s: Evaluate AST feature vector references & paper citations → Pass',
        '32.0s: Share to internal Slack research channel → Trigger Share Action'
      ],
      memoryStack: [
        'High memory retention of arXiv papers and LLM benchmark leaderboards',
        'Extreme negative bias against "get rich quick with ChatGPT" hype videos (-68%)',
        'Positive bias towards reproducible GitHub code repositories'
      ],
      interests: ['Transformers', 'PyTorch', 'Agent Swarms', 'arXiv Papers', 'LLM Evaluation'],
      aiReasoning: 'Agent #1209 selected "SHARE TO SLACK" after validating that the video cited verifiable PyTorch benchmark metrics without hyperbole.'
    },
    'indie-hackers': {
      id: 'indie-hackers',
      name: 'Indie Hackers & Solopreneurs',
      cluster: 'Cluster #04 • Action-Oriented Builders',
      size: '1.4M Agents',
      sharePct: 13.4,
      avatarIcon: '⚡',
      color: '#F13A1E',
      demographics: {
        age: '22 - 36 yrs',
        role: 'Indie Builder / Full-Stack Dev',
        geo: 'Global Remote',
        income: '$60k - $250k'
      },
      psychology: {
        curiosity: 91,
        skepticism: 64,
        patience: 42,
        authorityWeight: 74
      },
      rates: {
        comment: '4.8%',
        share: '10.2%',
        follow: '6.4%'
      },
      behavior: {
        scrollSpeed: '10.1 px/ms (High Speed)',
        patternInterruptMs: '110ms (UI Prototype Focus)',
        skipThresholdSec: '2.0s (MVP Speed Window)'
      },
      decisionTree: [
        '0.0s: Detect working product UI in opening frame → Pass',
        '1.0s: Assess build time & tech stack stack complexity → Pass',
        '2.8s: Evaluate revenue traction claim → Pass',
        '15.0s: Click link in bio or save checklist → Trigger Follow Action'
      ],
      memoryStack: [
        'Stored memory of Next.js, Supabase, and Stripe integration tutorials',
        'Positive bias towards transparent building in public metrics (+42%)',
        'Slight skepticism towards enterprise corporate buzzwords'
      ],
      interests: ['Build in Public', 'Next.js', 'Micro-SaaS', 'Stripe MRR', 'Tailwind CSS'],
      aiReasoning: 'Agent #7741 selected "FOLLOW CREATOR" because the video showed a functional live web app prototype built in under 24 hours.'
    },
    'productivity-engineers': {
      id: 'productivity-engineers',
      name: 'Productivity & Biohacking Engineers',
      cluster: 'Cluster #05 • System Optimizers',
      size: '720K Agents',
      sharePct: 6.9,
      avatarIcon: '🧠',
      color: '#A855F7',
      demographics: {
        age: '25 - 40 yrs',
        role: 'Operations Lead / Biohacker',
        geo: 'US, EU',
        income: '$90k - $220k'
      },
      psychology: {
        curiosity: 88,
        skepticism: 70,
        patience: 60,
        authorityWeight: 82
      },
      rates: {
        comment: '3.9%',
        share: '7.4%',
        follow: '4.1%'
      },
      behavior: {
        scrollSpeed: '7.8 px/ms (Systematic)',
        patternInterruptMs: '140ms (Notion/Obsidian Visual Check)',
        skipThresholdSec: '2.5s (Workflow Efficiency Window)'
      },
      decisionTree: [
        '0.0s: Identify workflow system diagram or Notion setup → Pass',
        '1.2s: Evaluate cognitive load reduction claim → Pass',
        '3.5s: Test daily habit integration potential → Pass',
        '20.0s: Save checklist to Notion workspace → Trigger Save Action'
      ],
      memoryStack: [
        'Memory stack indexed with Huberman lab protocols and Notion templates',
        'Positive bias towards structured step-by-step systems (+36%)'
      ],
      interests: ['Obsidian', 'Notion Workflows', 'Dopamine Fasting', 'Time Blocking', 'Focus Music'],
      aiReasoning: 'Agent #3301 selected "SAVE CHECKLIST" due to the step-by-step morning focus routine diagram presenting zero cognitive friction.'
    }
  };

  const currentArchetype = swarmArchetypes[selectedArchetypeId] || swarmArchetypes['saas-founders'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. SWARM ECOSYSTEM HEADER & GLOBAL TELEMETRY ────────────────────────── */}
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
              👥 SYNTHETIC VIEWER SWARM ECOSYSTEM
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Active Agents: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>10,420,000 SYNTHETICS</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Explorable Viewer Demographics & Cognitive Swarms
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Clusters: <strong style={{ color: '#FFFFFF' }}>5 Active Tribes</strong></span>
            <span>•</span>
            <span>Comment Rate: <strong style={{ color: '#FACC15' }}>4.2%</strong></span>
            <span>•</span>
            <span>Share Rate: <strong style={{ color: '#4ADE80' }}>8.4%</strong></span>
            <span>•</span>
            <span>Trust Calibration: <strong style={{ color: '#38BDF8' }}>84.2% Index</strong></span>
          </div>
        </div>

        {/* Global Action Funnel Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Avg Hook Threshold</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F13A1E', fontFamily: 'monospace' }}>2.8s</span>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Memory Recalibration</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>99.2%</span>
          </div>
        </div>
      </div>

      {/* ── 2. POPULATION SWARM DOT MATRIX & CLUSTER NETWORK GRAPH ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        
        {/* Interactive Population Swarm Dot Matrix (SVG) */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                10.4M Synthetic Viewer Population Matrix
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Live Agent Density & Cluster Allocation
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800, backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
              SWARM ACTIVE
            </span>
          </div>

          {/* SVG Swarm Grid Dot Matrix */}
          <div style={{ width: '100%', height: '180px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px', overflow: 'hidden', alignContent: 'flex-start' }}>
            {Array.from({ length: 140 }).map((_, i) => {
              const clusterColors = ['#4ADE80', '#38BDF8', '#FACC15', '#F13A1E', '#A855F7'];
              const col = clusterColors[i % 5];
              return (
                <div 
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: col,
                    opacity: Math.sin(i * 0.4) * 0.4 + 0.6,
                    boxShadow: `0 0 6px ${col}`
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Inter-Community Cluster Network Graph */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Community Cross-Pollination Network
          </span>

          <svg width="100%" height="180" viewBox="0 0 300 180" style={{ overflow: 'visible' }}>
            {/* Network Connections */}
            <line x1="150" y1="40" x2="60" y2="120" stroke="rgba(74, 222, 128, 0.3)" strokeWidth="1.5" />
            <line x1="150" y1="40" x2="240" y2="120" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" />
            <line x1="60" y1="120" x2="150" y2="150" stroke="rgba(250, 204, 21, 0.3)" strokeWidth="1.5" />
            <line x1="240" y1="120" x2="150" y2="150" stroke="rgba(241, 58, 30, 0.3)" strokeWidth="1.5" />

            {/* Nodes */}
            <circle cx="150" cy="40" r="18" fill="rgba(74, 222, 128, 0.2)" stroke="#4ADE80" strokeWidth="2" />
            <text x="150" y="44" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">SaaS</text>

            <circle cx="60" cy="120" r="16" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="2" />
            <text x="60" y="124" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">Editors</text>

            <circle cx="240" cy="120" r="16" fill="rgba(250, 204, 21, 0.2)" stroke="#FACC15" strokeWidth="2" />
            <text x="240" y="124" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">AI ML</text>

            <circle cx="150" cy="150" r="14" fill="rgba(241, 58, 30, 0.2)" stroke="#F13A1E" strokeWidth="2" />
            <text x="150" y="154" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">Indie</text>
          </svg>
        </div>

      </div>

      {/* ── 3. 5 COMMUNITY ARCHETYPE SELECTOR CARDS ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {Object.values(swarmArchetypes).map((arch) => {
          const isSelected = selectedArchetypeId === arch.id;
          return (
            <div
              key={arch.id}
              onClick={() => setSelectedArchetypeId(arch.id)}
              style={{
                backgroundColor: isSelected ? 'rgba(255,255,255,0.08)' : 'rgba(15, 23, 42, 0.8)',
                border: isSelected ? `2px solid ${arch.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '22px' }}>{arch.avatarIcon}</span>
                <span style={{ fontSize: '11px', fontWeight: 900, color: arch.color, fontFamily: 'monospace' }}>
                  {arch.size}
                </span>
              </div>

              <span style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25 }}>
                {arch.name}
              </span>

              <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                {arch.demographics.role.split('/')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── 4. DEEP VIEWER ARCHETYPE INSPECTOR (CLICK REVEAL PANEL) ──────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Inspector Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px' }}>{currentArchetype.avatarIcon}</span>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: currentArchetype.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {currentArchetype.cluster}
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                {currentArchetype.name} Deep Cognitive Inspector
              </h2>
            </div>
          </div>

          {/* Inspector Navigation Tabs */}
          <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {(['overview', 'behavior', 'decision', 'memory', 'reasoning'] as const).map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === t ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: activeTab === t ? '#FFFFFF' : '#94A3B8',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview (Demographics & Psychology Radar) */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
                Demographics & Profile
              </h4>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div>Age Group: <strong style={{ color: '#FFFFFF' }}>{currentArchetype.demographics.age}</strong></div>
                <div>Primary Role: <strong style={{ color: '#FFFFFF' }}>{currentArchetype.demographics.role}</strong></div>
                <div>Geography: <strong style={{ color: '#FFFFFF' }}>{currentArchetype.demographics.geo}</strong></div>
                <div>Est Income: <strong style={{ color: '#FFFFFF' }}>{currentArchetype.demographics.income}</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
                Action Probabilities
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Comment Rate</span>
                  <strong style={{ fontSize: '1.4rem', color: '#FACC15', fontFamily: 'monospace' }}>{currentArchetype.rates.comment}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Share Rate</span>
                  <strong style={{ fontSize: '1.4rem', color: '#4ADE80', fontFamily: 'monospace' }}>{currentArchetype.rates.share}</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Follow Rate</span>
                  <strong style={{ fontSize: '1.4rem', color: '#38BDF8', fontFamily: 'monospace' }}>{currentArchetype.rates.follow}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Behavior */}
        {activeTab === 'behavior' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
              Physical & Optical Behavioral Dynamics
            </h4>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div>Scroll Speed: <strong style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{currentArchetype.behavior.scrollSpeed}</strong></div>
              <div>Pattern Interrupt Reaction Time: <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{currentArchetype.behavior.patternInterruptMs}</strong></div>
              <div>Strict Skip Threshold: <strong style={{ color: '#F13A1E', fontFamily: 'monospace' }}>{currentArchetype.behavior.skipThresholdSec}</strong></div>
            </div>
          </div>
        )}

        {/* Tab 3: Step-by-Step Cognitive Decision Process */}
        {activeTab === 'decision' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
              Step-by-Step Cognitive Decision Tree
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentArchetype.decisionTree.map((step, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', borderLeft: `3px solid ${currentArchetype.color}`, fontSize: '13px', color: '#FFFFFF' }}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Memory Vector Stack */}
        {activeTab === 'memory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>
              Stored Long-Term Brand Impression & Memory Stack
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentArchetype.memoryStack.map((mem, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '13px', color: '#CBD5E1' }}>
                  🧠 {mem}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: AI Agent Reasoning Trace */}
        {activeTab === 'reasoning' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', margin: 0 }}>
              🤖 Agent Swarm LLM Decision Output Trace
            </h4>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.3)', fontFamily: 'monospace', fontSize: '13px', color: '#4ADE80', lineHeight: 1.5 }}>
              {currentArchetype.aiReasoning}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
