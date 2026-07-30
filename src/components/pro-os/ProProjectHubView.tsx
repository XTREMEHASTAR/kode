import React, { useState } from 'react';

type ProjectStatus = 'SIMULATED' | 'DRAFT' | 'READY' | 'IN_REVIEW' | 'PUBLISHED';

interface ProjectVersion {
  versionStr: string;
  date: string;
  author: string;
  views: string;
  viralityScore: number;
  hookScore: number;
  changes: string;
}

export const ProProjectHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assets' | 'versions' | 'history' | 'reports' | 'notes' | 'collaborators'>('assets');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Project Meta
  const projectInfo = {
    title: 'AuraCore Flagship Launch Campaign 2026',
    id: 'PRJ-2026-0982',
    status: 'SIMULATED' as ProjectStatus,
    updatedAgo: '12 mins ago',
    activeVersion: 'v3.0',
    owner: 'Veer (Workspace Lead)'
  };

  // 1. Assets Data
  const assets = [
    { name: 'Reel_Launch_v3.mp4', type: 'Video (9:16)', size: '48.2 MB', duration: '45.2s', status: 'Primary Master Asset' },
    { name: 'thumb_high_contrast.png', type: 'Graphic Thumbnail', size: '3.4 MB', resolution: '1080x1920', status: 'Primary Thumbnail' },
    { name: 'synthwave_drop_v4.wav', type: 'Audio Track', size: '12.8 MB', bpm: '124 BPM', status: 'Licensed Backing Track' },
    { name: 'hook_text_script.json', type: 'AST Text Overlay', size: '14 KB', items: '4 Keyframes', status: 'Text Script Overlay' }
  ];

  // 2. Versions Data
  const versions: ProjectVersion[] = [
    { versionStr: 'v3.0 (Active)', date: 'Today, 18:42', author: 'Veer', views: '2.3M', viralityScore: 94.2, hookScore: 94, changes: 'Added pattern interrupt hook + Synthwave audio drop.' },
    { versionStr: 'v2.0', date: 'Yesterday, 14:15', author: 'Sarah J.', views: '1.8M', viralityScore: 84.6, hookScore: 82, changes: 'Switched background music to Lo-Fi Ambient.' },
    { versionStr: 'v1.0', date: '3 days ago', author: 'Veer', views: '1.1M', viralityScore: 72.1, hookScore: 74, changes: 'Initial script draft & raw asset upload.' }
  ];

  // 3. Simulation History Data
  const simHistory = [
    { runId: 'Run #1024', time: '12 mins ago', views: '2.3M', viralChance: '84.6%', confidence: '99.4%', status: 'PASSED' },
    { runId: 'Run #1023', time: '1 hour ago', views: '2.1M', viralChance: '81.2%', confidence: '98.8%', status: 'PASSED' },
    { runId: 'Run #1022', time: '4 hours ago', views: '1.8M', viralChance: '76.4%', confidence: '97.2%', status: 'PASSED' }
  ];

  // 4. Reports Data
  const reports = [
    { name: 'Agency Client Deliverable Report', type: 'PDF / PPTX', date: '12 mins ago' },
    { name: 'Creator Virality & Hook Audit', type: 'PDF', date: '1 hour ago' },
    { name: 'Brand Voice & Resonance Brief', type: 'Executive Summary', date: 'Yesterday' }
  ];

  // 5. Notes & Activity Data
  const notes = [
    { author: 'Sarah J.', avatar: 'SJ', text: 'The 0s-3s pattern interrupt word choice in v3.0 increased hook retention by +12.4%!', time: '18 mins ago' },
    { author: 'Aura AI Agent', avatar: 'AI', text: '10,000 Monte Carlo runs converged. Top 2% virality score (94.2/100) confirmed.', time: '25 mins ago' }
  ];

  // 6. Collaborators Data
  const collaborators = [
    { name: 'Veer', role: 'Workspace Owner', email: 'veer@kontagi.ai', status: 'ONLINE' },
    { name: 'Sarah Jenkins', role: 'Senior Editor', email: 'sarah@kontagi.ai', status: 'ONLINE' },
    { name: 'Aura AI Agent', role: 'Automated Analyst', email: 'ai-agent@auracore.io', status: 'ACTIVE SIMULATOR' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. FIGMA & LINEAR STYLE PROJECT HUB HEADER ────────────────────────── */}
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
              📁 PROJECT HUB • {projectInfo.id}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#0F172A', backgroundColor: '#4ADE80', padding: '3px 8px', borderRadius: '4px' }}>
              {projectInfo.status}
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8' }}>
              Updated {projectInfo.updatedAgo}
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            {projectInfo.title}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Active Version: <strong style={{ color: '#38BDF8' }}>{projectInfo.activeVersion}</strong></span>
            <span>•</span>
            <span>Owner: <strong style={{ color: '#FFFFFF' }}>{projectInfo.owner}</strong></span>
            <span>•</span>
            <span>Predicted Views: <strong style={{ color: '#4ADE80' }}>2.3M Views</strong></span>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="text"
            placeholder="🔍 Search assets, versions, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#FFFFFF',
              fontSize: '12px',
              width: '240px'
            }}
          />

          <button
            onClick={() => setIsComparing(!isComparing)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isComparing ? '#F13A1E' : '#38BDF8',
              color: '#0F172A',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer'
            }}
          >
            {isComparing ? 'CLOSE VERSION DIFF' : '📊 COMPARE v2.0 vs v3.0'}
          </button>
        </div>
      </div>

      {/* ── 2. SIDE-BY-SIDE VERSION COMPARISON DIFF (IF TOGGLED) ───────────────── */}
      {isComparing && (
        <div style={{ backgroundColor: '#0B0F19', border: '2px solid #38BDF8', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 0 30px rgba(56, 189, 248, 0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              📊 SIDE-BY-SIDE VERSION COMPARISON DIFF (v2.0 vs v3.0)
            </span>
            <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 800 }}>
              v3.0 Yields +27.7% Higher Views
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* v2.0 Column */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800 }}>PREVIOUS VERSION: v2.0</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: '4px 0 8px 0' }}>1.8M Views (84.6% Virality)</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#CBD5E1' }}>
                <li>Hook Tension Score: 82/100</li>
                <li>Music: Lo-Fi Ambient Focus</li>
                <li>30s Retention Rate: 68.4%</li>
              </ul>
            </div>

            {/* v3.0 Column */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', padding: '18px', borderRadius: '12px', border: '2px solid #4ADE80' }}>
              <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: 900 }}>ACTIVE VERSION: v3.0</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ADE80', margin: '4px 0 8px 0' }}>2.3M Views (+27.7%)</div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#FFFFFF' }}>
                <li>Hook Tension Score: <strong>94/100 (+12.2%)</strong></li>
                <li>Music: <strong>Trending Synthwave Drop (+428% surge)</strong></li>
                <li>30s Retention Rate: <strong>76.1% (+7.7%)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. PROJECT SECTIONS TABS ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
        {(['assets', 'versions', 'history', 'reports', 'notes', 'collaborators'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === tab ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color: activeTab === tab ? '#FFFFFF' : '#94A3B8',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── 4. TAB CONTENTS ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* TAB 1: ASSETS */}
        {activeTab === 'assets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Project Master Assets & Files</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {assets.map((ast, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#FFFFFF' }}>{ast.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{ast.type} • {ast.size}</div>
                  </div>
                  <button onClick={() => alert(`Downloading ${ast.name}`)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#38BDF8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VERSIONS */}
        {activeTab === 'versions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Version History Log</span>
            {versions.map((ver, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: ver.versionStr.includes('Active') ? '#4ADE80' : '#FFFFFF' }}>{ver.versionStr}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{ver.date} by {ver.author} — {ver.changes}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace' }}>{ver.views}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Score: {ver.viralityScore}/100</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SIMULATION HISTORY */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Monte Carlo Simulation Audit Log</span>
            {simHistory.map((run, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#FFFFFF', fontFamily: 'monospace' }}>{run.runId}</strong>
                  <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: '10px' }}>{run.time}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontFamily: 'monospace' }}>
                  <span>Views: <strong style={{ color: '#4ADE80' }}>{run.views}</strong></span>
                  <span>Viral: <strong style={{ color: '#38BDF8' }}>{run.viralChance}</strong></span>
                  <span>Conf: <strong style={{ color: '#FFFFFF' }}>{run.confidence}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: REPORTS */}
        {activeTab === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Generated Campaign Reports</span>
            {reports.map((rep, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF' }}>{rep.name}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{rep.type} • Created {rep.date}</div>
                </div>
                <button onClick={() => alert(`Opening ${rep.name}`)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#38BDF8', color: '#0F172A', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
                  View Report
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: NOTES */}
        {activeTab === 'notes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Team Discussion & Notes</span>
            {notes.map((note, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#38BDF8', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px' }}>
                  {note.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>{note.author} <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 400 }}>• {note.time}</span></div>
                  <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px' }}>{note.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: COLLABORATORS */}
        {activeTab === 'collaborators' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Collaborators & Access Permissions</span>
            {collaborators.map((c, i) => (
              <div key={i} style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF' }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{c.role} • {c.email}</div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#4ADE80', backgroundColor: 'rgba(74,222,128,0.15)', padding: '3px 8px', borderRadius: '4px' }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
