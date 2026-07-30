import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentWorkspace,
    currentProject,
    videos,
    currentVideo,
    setSelectedVideoId,
    showToast
  } = useApp();

  // Find a completed video to use as a fallback if no video is selected
  const activeVideo = currentVideo || videos.find(v => v.status === 'completed') || null;

  const handleDeployModel = () => {
    showToast('Deploying KONTAGI engine container...', 'info');
  };

  const handleRunAnalysis = () => {
    showToast('Initiating model telemetry scans...', 'info');
  };

  const handleCardClick = (videoId: string) => {
    setSelectedVideoId(videoId);
    navigate(`/assets/${videoId}/report`);
  };

  // Dynamic Suggestion values
  const suggestions = [];
  if (activeVideo) {
    if (activeVideo.mean_volume_db !== undefined) {
      const vol = activeVideo.mean_volume_db;
      if (vol > -10) {
        suggestions.push({
          title: '⚡ High Peak Volume Alert',
          desc: `Mean volume is high at ${vol} dB. Distortions might occur on low-end mobile speakers.`,
          color: 'var(--accent-red)'
        });
      } else {
        suggestions.push({
          title: '⚠️ Audio Level Check',
          desc: `Mean volume matches ${vol} dB. We recommend normalizing closer to -14 LUFS standard.`,
          color: 'var(--accent-orange)'
        });
      }
    }
    if (activeVideo.visual_score !== undefined) {
      const score = activeVideo.visual_score;
      if (score < 75) {
        suggestions.push({
          title: '⚠️ Low Contrast Warning',
          desc: `Visual score is low (${score}%). First 3 seconds lacks contrast. Overlay high-contrast captions.`,
          color: 'var(--accent-orange)'
        });
      } else {
        suggestions.push({
          title: '🎨 Visual Contrast Scan',
          desc: `Active hook contrast is optimal (${score}%). Gen-Z focus distribution matches index rules.`,
          color: 'var(--accent-green)'
        });
      }
    }
  } else {
    suggestions.push({
      title: '⚠️ Video compression config',
      desc: 'Aura AI recommends encoding using H.264 profile metrics to resolve mobile playback latency.',
      color: 'var(--accent-orange)'
    });
    suggestions.push({
      title: '⚡ Domain ownership check',
      desc: 'Confirm DNS mappings for `.insaas.ai` to unlock workspace team invites.',
      color: 'var(--accent-red)'
    });
  }

  return (
    <>
      {/* HERO SECTION */}
      <section className="dashboard-hero">
        <div>
          <h1 className="text-display-md text-gradient" style={{ marginBottom: 'var(--space-xxs)' }}>
            Welcome Back, Jaiveer
          </h1>
          <p className="text-body-small text-muted" style={{ maxWidth: '480px', lineHeight: 1.5 }}>
            Your workspaces are configured correctly. Aura AI has mapped {workspacesCount()} clusters and analyzed {videos.length} creative assets in the last 24 hours.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
            <button className="btn btn-primary btn-md" onClick={() => navigate('/upload')} style={{ fontSize: '1rem', fontWeight: 700, padding: '12px 24px', backgroundColor: 'var(--brand-primary)', boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)' }}>
              ➕ Start New Video Analysis
            </button>
            <button className="btn btn-secondary btn-md" onClick={() => navigate('/projects')}>
              📁 View Project History
            </button>
          </div>
        </div>

        {/* System Uptime Badge Group */}
        <div className="card elevation-1" style={{ backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(10px)', borderColor: 'var(--glass-border)', width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="flex-between">
            <span className="text-detail font-mono text-secondary">CLUSTERS LOAD</span>
            <span className="badge badge-success">98.4% UPTIME</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="flex-between">
              <span className="text-detail text-muted">CPU (3 nodes)</span>
              <span className="text-detail font-bold font-mono">42.8%</span>
            </div>
            <div className="skeleton" style={{ height: '4px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--border-default)' }}>
              <div style={{ height: '100%', width: '42.8%', backgroundColor: 'var(--brand-primary)' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI ROW */}
      <div className="grid-12" style={{ gap: 'var(--space-lg)' }}>
        {/* Creative Score Card */}
        <div className="card col-span-4 flex-between" style={{ alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ flexGrow: 1 }}>
            <span className="text-detail font-bold text-muted font-mono" style={{ textTransform: 'uppercase' }}>CREATIVE SCORE</span>
            <h2 style={{ margin: 'var(--space-xxs) 0' }}>
              {activeVideo ? ((activeVideo.score ?? 0) >= 80 ? 'Optimal' : 'Needs Work') : 'Optimal'}
            </h2>
            <p className="text-detail text-secondary">Asset engagement metrics exceed industry benchmark ranges.</p>
          </div>
          
          <div className="score-circle-container">
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle className="score-circle-bg" cx="50" cy="50" r="40"/>
              <circle 
                className="score-circle-fill" 
                cx="50" 
                cy="50" 
                r="40"
                style={{ strokeDashoffset: `${251.2 - (251.2 * (activeVideo?.score ?? 0)) / 100}` }}
              />
            </svg>
            <div className="flex-center" style={{ position: 'absolute', inset: 0, fontSize: '1.125rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
              {activeVideo?.score !== undefined && activeVideo?.score !== null ? `${activeVideo.score}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Publish Readiness Card */}
        <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 'var(--space-sm)' }}>
          <div>
            <span className="text-detail font-bold text-muted font-mono" style={{ textTransform: 'uppercase' }}>PUBLISH READINESS</span>
            <div className="flex-between" style={{ alignItems: 'baseline', marginTop: 'var(--space-xs)' }}>
              <span className="text-display-md" style={{ fontSize: '1.75rem' }}>{activeVideo?.visual_score !== undefined && activeVideo?.visual_score !== null ? `${activeVideo.visual_score}%` : 'N/A'}</span>
              <span className={`badge ${ (activeVideo?.visual_score ?? 0) >= 80 ? 'badge-success' : 'badge-warning'}`}>
                { activeVideo?.visual_score !== undefined && activeVideo?.visual_score !== null ? (activeVideo.visual_score >= 80 ? 'HIGHLY DEPLOYABLE' : 'MODERATE RISK') : 'N/A'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="skeleton" style={{ height: '6px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', backgroundColor: 'var(--border-default)' }}>
              <div style={{ height: '100%', width: `${activeVideo?.visual_score ?? 0}%`, backgroundColor: 'var(--accent-green)' }}></div>
            </div>
            <span className="text-detail text-secondary">
              {activeVideo?.visual_score !== undefined && activeVideo?.visual_score !== null ? `${Math.floor(activeVideo.visual_score / 8.5)} of 12 checklist compliance standards resolved.` : 'N/A'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <span className="text-detail font-bold text-muted font-mono" style={{ textTransform: 'uppercase', marginBottom: '4px' }}>QUICK PIPELINE ACTIONS</span>
          <div className="grid-12" style={{ gap: '8px' }}>
            <button className="btn btn-tertiary btn-sm col-span-6" onClick={() => showToast('Opening telemetry logs...', 'info')}>View Log</button>
            <button className="btn btn-tertiary btn-sm col-span-6" onClick={() => showToast('Rebuilding edge models...', 'info')}>Rebuild</button>
            <button className="btn btn-tertiary btn-sm col-span-6" onClick={() => showToast('Configuring API limits...', 'info')}>Limits</button>
            <button className="btn btn-tertiary btn-sm col-span-6" onClick={() => showToast('Opening invites menu...', 'info')}>Invite</button>
          </div>
        </div>
      </div>

      {/* PROJECTS AND AI SUGGESTIONS ROW */}
      <div className="grid-12" style={{ gap: 'var(--space-lg)' }}>
        {/* Projects Overview */}
        <div className="card col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div className="flex-between">
            <div>
              <h3 style={{ marginBottom: 'var(--space-xxs)' }}>Projects Overview</h3>
              <p className="text-detail text-secondary">Recent operational inference pipeline run tracking logs.</p>
            </div>
            <button className="btn btn-tertiary btn-sm" onClick={() => showToast('Refreshed pipelines table', 'success')}>Refresh</button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Status</th>
                  <th>Confidence</th>
                  <th>Latency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map(v => (
                  <tr key={v.id}>
                    <td className="font-bold text-primary">{v.title}</td>
                    <td>
                      <span className={`badge ${v.status === 'completed' ? 'badge-success' : v.status === 'failed' ? 'badge-danger' : 'badge-info'}`}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="font-mono">{v.score}%</td>
                    <td className="text-secondary font-mono">{v.duration ? `${v.duration * 3}ms` : '14ms'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleCardClick(v.id)}>
                        Report
                      </button>
                    </td>
                  </tr>
                ))}
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>
                      No assets found. Visit the Upload Center to add assets.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <h3 style={{ marginBottom: 'var(--space-xxs)' }}>AI Suggestion Nodes</h3>
            <p className="text-detail text-secondary">Neural pipeline warning alerts and configuration tips.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {suggestions.map((s, idx) => (
              <div 
                key={idx} 
                className="card elevation-1" 
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderLeft: `3px solid ${s.color}`, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 'var(--space-xxs)', 
                  padding: 'var(--space-sm)' 
                }}
              >
                <div className="flex-between">
                  <span className="text-detail font-bold text-primary">{s.title}</span>
                  <span className="text-detail text-muted">Just now</span>
                </div>
                <p className="text-detail text-secondary">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SVG PERFORMANCE TREND GRAPH ROW */}
      <div className="grid-12" style={{ gap: 'var(--space-lg)' }}>
        <div className="card col-span-8 chart-container-card">
          <div className="flex-between">
            <div>
              <h3 style={{ marginBottom: 'var(--space-xxs)' }}>Performance Trends</h3>
              <p className="text-detail text-secondary">Active query latency monitoring over the previous 7 operational cycles.</p>
            </div>
            <div className="flex-center" style={{ gap: 'var(--space-xs)' }}>
              <span className="badge badge-info">LATENCY (MS)</span>
              <span className="badge badge-success">COMPUTE LOAD</span>
            </div>
          </div>

          <svg className="svg-line-chart" viewBox="0 0 700 180">
            <defs>
              <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.0"/>
              </linearGradient>
            </defs>
            <line x1="0" y1="30" x2="700" y2="30" className="svg-grid-line"/>
            <line x1="0" y1="80" x2="700" y2="80" className="svg-grid-line"/>
            <line x1="0" y1="130" x2="700" y2="130" className="svg-grid-line"/>
            
            <path d="M 0 140 Q 116 110 233 130 T 466 70 T 700 40 L 700 180 L 0 180 Z" fill="url(#trend-gradient)"/>
            <path d="M 0 140 Q 116 110 233 130 T 466 70 T 700 40" className="svg-trend-path" fill="none" stroke="var(--brand-primary)" strokeWidth="3"/>
            
            <circle cx="233" cy="130" r="4" fill="var(--bg-primary)" stroke="var(--brand-primary)" strokeWidth="2"/>
            <circle cx="466" cy="70" r="4" fill="var(--bg-primary)" stroke="var(--brand-primary)" strokeWidth="2"/>
            <circle cx="700" cy="40" r="4" fill="var(--bg-primary)" stroke="var(--brand-primary)" strokeWidth="2"/>
          </svg>
        </div>

        {/* Mini stats */}
        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <span className="text-detail font-bold text-muted font-mono" style={{ textTransform: 'uppercase' }}>ACTIVE API CLIENTS</span>
            <div className="flex-center" style={{ gap: 'var(--space-xs)', justifyContent: 'flex-start' }}>
              <div className="workspace-avatar" style={{ backgroundColor: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', width: '28px', height: '28px', fontSize: '0.75rem' }}>G</div>
              <div className="workspace-avatar" style={{ backgroundColor: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', width: '28px', height: '28px', fontSize: '0.75rem' }}>S</div>
              <div className="workspace-avatar" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', width: '28px', height: '28px', fontSize: '0.75rem' }}>V</div>
              <div className="workspace-avatar" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', width: '28px', height: '28px', fontSize: '0.75rem', fontWeight: 500 }}>+2</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <span className="text-detail font-bold text-muted font-mono" style={{ textTransform: 'uppercase', marginBottom: '4px' }}>RECENT COMPLETED ANALYSIS</span>
            <div className="flex-between">
              <span className="text-body-small font-medium text-primary">contrast_report_v2.json</span>
              <span className="text-detail text-secondary font-mono">1.2 KB</span>
            </div>
            <div className="flex-between" style={{ borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-xxs)' }}>
              <span className="text-body-small font-medium text-primary">metadata_index.csv</span>
              <span className="text-detail text-secondary font-mono">48 KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT UPLOADS GRID */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        <div>
          <h3>Recent Uploads</h3>
          <p className="text-detail text-secondary">Media assets recently added to organization workspaces for neural indexing.</p>
        </div>

        <div className="uploads-horizontal-grid">
          {videos.map(v => (
            <div 
              key={v.id} 
              className="upload-asset-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(v.id)}
            >
              <div className="upload-asset-thumb" style={{ position: 'relative', overflow: 'hidden' }}>
                {v.poster_url ? (
                  <img src={v.poster_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={v.title} />
                ) : (
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 10l5.555-3.678A1 1 0 0122 7.158v9.684a1 1 0 01-1.445.892L15 14v-4z"/><rect x="2" y="5" width="13" height="14" rx="2"/></svg>
                )}
                {v.status === 'completed' ? (
                  <span className="badge badge-success" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>{v.score}% SCORE</span>
                ) : (
                  <span className="badge badge-info" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>ANALYZING</span>
                )}
              </div>
              <div style={{ padding: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="text-body-small font-bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{v.title}</span>
                <span className="text-detail text-secondary">{v.duration ? `${v.duration}s` : 'Unknown'} &bull; {v.status}</span>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div style={{ padding: 'var(--space-md)', color: 'var(--text-secondary)' }}>
              No recent uploads.
            </div>
          )}
        </div>
      </section>
    </>
  );

  function workspacesCount() {
    try {
      return currentWorkspace ? 3 : 1;
    } catch {
      return 3;
    }
  }
};
