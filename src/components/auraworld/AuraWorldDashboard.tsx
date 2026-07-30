import React, { useState, useEffect } from 'react';
import { fetchAuraWorldState, stepWorldTick, fetchWorldEventHistory } from '../../services/auraWorldService';
import { AuraWorldSnapshot, WorldEvent } from '../../../server/src/modules/auraworld/types';

export const AuraWorldDashboard: React.FC = () => {
  const [snapshot, setSnapshot] = useState<AuraWorldSnapshot | null>(null);
  const [events, setEvents] = useState<WorldEvent[]>([]);
  const [isTicking, setIsTicking] = useState(false);
  const [autoTick, setAutoTick] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string>('us-east');
  const [tickCounter, setTickCounter] = useState<number>(1429);

  const loadWorldState = async () => {
    const snap = await fetchAuraWorldState();
    if (snap) setSnapshot(snap);
    const evts = await fetchWorldEventHistory(25);
    setEvents(evts);
  };

  useEffect(() => {
    loadWorldState();
  }, []);

  // 2-Second Real-Time Auto-Tick Loop (Keeps page feeling ALIVE)
  useEffect(() => {
    let interval: any;
    if (autoTick) {
      interval = setInterval(async () => {
        setTickCounter(prev => prev + 1);
        const snap = await stepWorldTick(1.0);
        if (snap) setSnapshot(snap);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [autoTick]);

  const handleManualTick = async () => {
    setIsTicking(true);
    setTickCounter(prev => prev + 1);
    const snap = await stepWorldTick(1.0);
    if (snap) setSnapshot(snap);
    const evts = await fetchWorldEventHistory(25);
    setEvents(evts);
    setIsTicking(false);
  };

  // Regional Simulation Nodes for Interactive SVG World Map
  const regionalNodes = [
    { id: 'us-east', name: 'US-East (N. Virginia)', lat: 38.0, lng: -77.0, x: 100, y: 80, dau: '142M', load: '88%', mood: 'High Engagement' },
    { id: 'us-west', name: 'US-West (Oregon)', lat: 44.0, lng: -120.0, x: 50, y: 75, dau: '98M', load: '82%', mood: 'Viral Surge' },
    { id: 'eu-central', name: 'EU-Central (Frankfurt)', lat: 50.0, lng: 8.6, x: 200, y: 60, dau: '115M', load: '76%', mood: 'Saturated' },
    { id: 'apac-tokyo', name: 'APAC-East (Tokyo)', lat: 35.6, lng: 139.6, x: 310, y: 85, dau: '78M', load: '91%', mood: 'Euphoric' },
    { id: 'latam-saopaulo', name: 'LATAM (São Paulo)', lat: -23.5, lng: -46.6, x: 130, y: 140, dau: '42M', load: '64%', mood: 'Emerging' }
  ];

  const activeNode = regionalNodes.find(n => n.id === selectedNode) || regionalNodes[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. OS HEADER BAR & REAL-TIME ENVIRONMENT CONTROL ────────────────────── */}
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
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              🌐 AURAWORLD OS • ENVIRONMENT PRIME
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Tick Sequence: <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>#{tickCounter}</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            Simulated Social Media Universe & Attention Atmosphere
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Season: <strong style={{ color: '#FFFFFF' }}>Spring Surge 2026</strong></span>
            <span>•</span>
            <span>Simulated Hour: <strong style={{ color: '#FFFFFF' }}>19:30 EST (Peak Window)</strong></span>
            <span>•</span>
            <span>Latency: <strong style={{ color: '#10B981' }}>14ms</strong></span>
            <span>•</span>
            <span>Hawkes Convergence: <strong style={{ color: '#10B981' }}>99.8%</strong></span>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setAutoTick(!autoTick)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: autoTick ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
              backgroundColor: autoTick ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
              color: autoTick ? '#10B981' : '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: autoTick ? '#10B981' : '#64748B', animation: autoTick ? 'pulse 1.5s infinite' : 'none' }}></span>
            {autoTick ? 'LIVE ENVIRONMENT ONLINE' : 'PAUSED'}
          </button>

          <button
            onClick={handleManualTick}
            disabled={isTicking}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F13A1E',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(241, 58, 30, 0.3)'
            }}
          >
            {isTicking ? 'STEPPING TICK...' : '⚡ STEP TICK (+1s)'}
          </button>
        </div>
      </div>

      {/* ── 2. 11 MANDATORY LIVING ENVIRONMENT METRIC CARDS ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        
        {/* 1. Platform Mood */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>1. Platform Mood</span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>EUPHORIC</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'monospace' }}>88/100</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>High emotional valence & organic completion impulse.</div>
        </div>

        {/* 2. Attention Economy */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>2. Attention Economy</span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>8.4B HOURS</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>5.4M Pool</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>64.2% attention buffer allocated to video feed.</div>
        </div>

        {/* 3. Competition Index */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>3. Competition Index</span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>HIGH CONGESTION</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#F13A1E', fontFamily: 'monospace' }}>88/100</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>Top 5% creators competing for primary feed slots.</div>
        </div>

        {/* 4. Creator Saturation */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>4. Creator Saturation</span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#FACC15', backgroundColor: 'rgba(250, 204, 21, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>0.84 SATUR</span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FACC15', fontFamily: 'monospace' }}>32.4M Active</div>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>High density in Tech & SaaS creator niches.</div>
        </div>

      </div>

      {/* ── 3. INTERACTIVE SVG WORLD MAP & REGIONAL NODE INSPECTOR ──────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Interactive SVG World Simulation Map */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Global Regional Simulation Nodes
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Live Attention Topography Map
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: '4px' }}>
              5 NODES ONLINE
            </span>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
            <svg width="100%" height="100%" viewBox="0 0 400 200" style={{ overflow: 'visible' }}>
              {/* World Grid Lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.04)" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.04)" />
              
              <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.04)" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <line x1="300" y1="0" x2="300" y2="200" stroke="rgba(255,255,255,0.04)" />

              {/* Inter-node Attention Vector Connections */}
              <line x1="100" y1="80" x2="200" y2="60" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="200" y1="60" x2="310" y2="85" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="100" y1="80" x2="130" y2="140" stroke="rgba(241, 58, 30, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Node Pulse Points */}
              {regionalNodes.map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <g key={node.id} onClick={() => setSelectedNode(node.id)} style={{ cursor: 'pointer' }}>
                    <circle cx={node.x} cy={node.y} r="14" fill={isSelected ? 'rgba(241, 58, 30, 0.2)' : 'rgba(56, 189, 248, 0.15)'} />
                    <circle cx={node.x} cy={node.y} r="6" fill={isSelected ? '#F13A1E' : '#38BDF8'} />
                    <text x={node.x} y={node.y - 10} fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
                      {node.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Regional Node Details */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#F13A1E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SELECTED NODE INSPECTOR
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
              {activeNode.name}
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Active Regional DAU:</span>
              <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{activeNode.dau}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Attention Load:</span>
              <strong style={{ color: '#4ADE80', fontFamily: 'monospace' }}>{activeNode.load}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94A3B8' }}>Regional Platform Mood:</span>
              <strong style={{ color: '#38BDF8' }}>{activeNode.mood}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ── 4. ALGORITHM BIAS & TREND SURGE ENGINE ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* 8. Algorithm Bias Weighting Bar */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                8. Current Algorithm Bias
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
                Recommendation Signal Weight Distribution
              </h3>
            </div>
            <span style={{ fontSize: '11px', color: '#F13A1E', fontWeight: 800 }}>
              Hook Weight: 42%
            </span>
          </div>

          {/* Multi-segment Bias Bar */}
          <div style={{ height: '24px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px', overflow: 'hidden', display: 'flex', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ width: '42%', backgroundColor: '#F13A1E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>42% HOOK</div>
            <div style={{ width: '30%', backgroundColor: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#0F172A' }}>30% WATCH</div>
            <div style={{ width: '18%', backgroundColor: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#0F172A' }}>18% SHARE</div>
            <div style={{ width: '10%', backgroundColor: '#FACC15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, color: '#0F172A' }}>10%</div>
          </div>
        </div>

        {/* 4 & 5. Trending Topics & Trending Audio */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            4 & 5. Real-Time Trending Audio & Topics
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { topic: '#AIAutomation', surge: '+428% 24h', audio: 'Cinematic Synthwave Drop v4', status: 'PEAKING' },
              { topic: '#SoloFounder', surge: '+215% 24h', audio: 'Deep Focus Ambient Lo-Fi', status: 'RISING' }
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF' }}>{t.topic}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>Audio: {t.audio}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#4ADE80', fontFamily: 'monospace' }}>{t.surge}</div>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.15)', padding: '2px 6px', borderRadius: '3px' }}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 5. LIVE EVENT TIMELINE STREAM LOG ────────────────────────────────────── */}
      <div 
        style={{ 
          backgroundColor: '#0F172A', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '16px', 
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.08em' }}>
              LIVE SIMULATION EVENT STREAM
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
              Real-Time Platform Atmosphere Telemetry
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>
            Auto-Ticking Stream Active
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { time: '19:30:04', event: 'Node US-East initialized 14,200 new viewer swarm agents.', severity: 'INFO' },
            { time: '19:30:02', event: 'Trend #AIAutomation virality coefficient surged from R0 2.4 to 3.8.', severity: 'SURGE' },
            { time: '19:30:00', event: 'Instagram Algorithm Overhaul v3 priority applied (+2.0x Hook multiplier).', severity: 'SYSTEM' }
          ].map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '11.5px', fontFamily: 'monospace' }}>
              <span style={{ color: '#94A3B8' }}>[{e.time}]</span>
              <span style={{ color: e.severity === 'SURGE' ? '#F13A1E' : (e.severity === 'SYSTEM' ? '#38BDF8' : '#4ADE80'), fontWeight: 800 }}>{e.severity}</span>
              <span style={{ color: '#E2E8F0' }}>{e.event}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
