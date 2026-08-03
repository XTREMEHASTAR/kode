import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FeatureGate } from '../components/guards/FeatureGate';
import { BrandWordmark } from '../components/common/BrandWordmark';
import kontagiLogo from '../assets/branding/kontagi-icon-180x180.png';

export const AppShell: React.FC = () => {
  const { user, signOut } = useAuth();
  const {
    workspaces,
    currentWorkspace,
    setWorkspace,
    projects,
    currentProject,
    setProject,
    theme,
    toggleTheme,
    viewport,
    setViewport,
    loadingState,
    setLoadingState,
    auraAiActive,
    setAuraAiActive,
    notifications,
    toast,
    hideToast,
    selectedVideoId,
    currentVideo,
    showToast
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileSidebarActive, setMobileSidebarActive] = useState(false);

  
  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ text: string; sender: 'user' | 'ai' }>>([
    { text: "Hello! I am Aura AI, your creative intelligence agent. How can I help optimize your active campaigns today?", sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll AI chat to bottom on new message
  useEffect(() => {
    if (auraAiActive) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, auraAiActive]);

  // Global keyboard shortcuts (Cmd/Ctrl + K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showToast('Global Search opened', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  const handleAIChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = chatInput.trim();
    if (!val) return;

    setChatMessages(prev => [...prev, { text: val, sender: 'user' }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      if (val.toLowerCase().includes('score')) {
        const scoreStr = currentVideo?.score !== undefined && currentVideo?.score !== null ? `${currentVideo.score}%` : 'N/A';
        const visStr = currentVideo?.visual_score !== undefined && currentVideo?.visual_score !== null ? `${currentVideo.visual_score}%` : 'N/A';
        reply = `Active video score is ${scoreStr}. Visual scoring matches ${visStr}.`;
      } else if (val.toLowerCase().includes('latency') || val.toLowerCase().includes('perf')) {
        reply = "Telemetry nodes reporting optimal pipeline state. Processing latency baseline at 14ms across region nodes.";
      } else {
        reply = `Acknowledged: "${val}". Synced query state into KONTAGI intelligence log. Let me know if you'd like to run a script variance audit.`;
      }
      setChatMessages(prev => [...prev, { text: reply, sender: 'ai' }]);
    }, 1000);
  };

  // Build current asset path helper for sidebar links
  const getSidebarLink = (basePath: string) => {
    if (selectedVideoId) {
      return `/assets/${selectedVideoId}/${basePath}`;
    }
    return `/upload?redirect=${basePath}`;
  };

  return (
    <div className="floating-app-shell">
      {/* SIDEBAR */}
      <aside className={`aura-sidebar ${(viewport === 'mobile' && mobileSidebarActive) ? 'active' : ''}`}>
        {/* Header Brand Logo */}
                <div className="sidebar-header" style={{ padding: '16px 20px 14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      backgroundColor: '#FFFFFF', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    <img src={kontagiLogo} alt="Kontagi Icon" style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em', fontFamily: "'Genty', 'Genty ExtraBold', sans-serif" }}>
                    KONTAGI
                  </span>
                </div>

                  {/* Dropdown Options */}
                  {wsDropdownOpen && (
                    <div 
                      className="dropdown-menu show" 
                      style={{ 
                        position: 'absolute', 
                        top: '100%', 
                        left: '12px', 
                        right: '12px', 
                        zIndex: 1010, 
                        backgroundColor: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        padding: '4px'
                      }}
                    >
                      {workspaces.map(ws => (
                        <div 
                          key={ws.id}
                          className={`dropdown-item flex-center`}
                          style={{ 
                            gap: 'var(--space-xs)', 
                            padding: '8px 12px', 
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: currentWorkspace?.id === ws.id ? 'var(--bg-secondary)' : 'transparent',
                            color: currentWorkspace?.id === ws.id ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}
                          onClick={() => {
                            setWorkspace(ws.id);
                            setWsDropdownOpen(false);
                          }}
                        >
                          <div 
                            className="workspace-avatar" 
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              fontSize: '0.625rem', 
                              backgroundColor: ws.avatar_bg, 
                              color: ws.avatar_color 
                            }}
                          >
                            {ws.avatar_text}
                          </div>
                          <span className="text-body-small font-medium">{ws.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Navigation links */}
                <nav className="sidebar-nav" style={{ padding: '0 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 6px 12px' }}>
                    <span className="text-detail font-bold sidebar-text-label" style={{ color: '#64748B', fontSize: '10.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Workspace</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: '#D97706', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>Pro</span>
                  </div>
                  
                  <NavLink to="/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🏠</span>
                    <span className="sidebar-text-label">Dashboard</span>
                  </NavLink>

                  <NavLink to="/upload" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>📤</span>
                    <span className="sidebar-text-label">Upload Center</span>
                  </NavLink>

                  <NavLink to="/script-intelligence" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>⊕</span>
                    <span className="sidebar-text-label">Script Studio</span>
                  </NavLink>

                  <NavLink to="/projects" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>📁</span>
                    <span className="sidebar-text-label">Project Hub</span>
                  </NavLink>

                  <NavLink to="/settings/billing" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>💳</span>
                    <span className="sidebar-text-label">Plans & Billing</span>
                  </NavLink>

                  {/* PRO SIMULATOR SECTION */}
                  <span className="text-detail font-bold sidebar-text-label" style={{ padding: '16px 12px 6px 12px', display: 'block', color: '#D97706', fontSize: '10.5px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>AI Instagram Simulator</span>

                  <NavLink to="/pro/prediction" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>📊</span>
                    <span className="sidebar-text-label">Viral Performance Report</span>
                  </NavLink>

                  <NavLink to="/pro/content-dna" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🧬</span>
                    <span className="sidebar-text-label">ContentDNA</span>
                  </NavLink>

                  <NavLink to="/pro/simulation" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>⚡</span>
                    <span className="sidebar-text-label">AI Distribution Simulator</span>
                  </NavLink>

                  <NavLink to="/pro/replay" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🎮</span>
                    <span className="sidebar-text-label">Feed Replay & Reactions</span>
                  </NavLink>

                  <NavLink to="/pro/competition" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>⚔️</span>
                    <span className="sidebar-text-label">Feed Competition Arena</span>
                  </NavLink>

                  <NavLink to="/pro/ai-viewers" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>👥</span>
                    <span className="sidebar-text-label">AI Viewer Personas</span>
                  </NavLink>

                  <NavLink to="/pro/world" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🌐</span>
                    <span className="sidebar-text-label">AuraWorld OS</span>
                  </NavLink>

                  <NavLink to="/pro/recommendation" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>⚙️</span>
                    <span className="sidebar-text-label">Recommendation Engine</span>
                  </NavLink>

                  <NavLink to="/pro/trend" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>📈</span>
                    <span className="sidebar-text-label">Trend Intelligence</span>
                  </NavLink>

                  <NavLink to="/pro/audience" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🎯</span>
                    <span className="sidebar-text-label">Audience Intelligence</span>
                  </NavLink>

                  <NavLink to="/pro/twin" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>👤</span>
                    <span className="sidebar-text-label">Digital Twin Studio</span>
                  </NavLink>

                  <NavLink to="/pro/behavior" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🧠</span>
                    <span className="sidebar-text-label">Behavior Engine</span>
                  </NavLink>

                  <NavLink to="/pro/community" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🕸️</span>
                    <span className="sidebar-text-label">Community Graph</span>
                  </NavLink>

                  <NavLink to="/pro/reports" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>📑</span>
                    <span className="sidebar-text-label">Reports Center</span>
                  </NavLink>

                  <NavLink to="/pro/production-testing" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>🚀</span>
                    <span className="sidebar-text-label">Production Testing</span>
                  </NavLink>
                </nav>

              {/* Sidebar Footer User Profile */}
              <div className="sidebar-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexGrow: 1, overflow: 'hidden' }}>
                  <div className="workspace-avatar" style={{ backgroundColor: 'var(--accent-purple-bg)', color: 'var(--accent-purple)', width: '32px', height: '32px', fontSize: '0.875rem', flexShrink: 0 }}>
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AC'}
                  </div>
                  <div style={{ flexGrow: 1, overflow: 'hidden' }} className="sidebar-text-label">
                    <span className="text-body-small font-bold" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name || 'KONTAGI Creator'}
                    </span>
                    <span className="text-detail text-secondary" style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email || 'creator@kontagi.ai'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await signOut();
                    showToast('Signed out successfully.', 'info');
                    navigate('/login');
                  }}
                  className="btn-ghost sidebar-text-label"
                  style={{
                    padding: '6px',
                    minWidth: 'auto',
                    color: 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Sign out"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12" />
                  </svg>
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="dashboard-main">
              {/* TOP WORKSPACE HEADER BAR */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '20px 32px 14px 32px',
                  backgroundColor: '#090D16',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {user?.name ? `${user.name.split(' ')[0]}'s Workspace` : "veer's Workspace"}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span 
                    style={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: '#F13A1E', 
                      backgroundColor: 'rgba(241, 58, 30, 0.15)', 
                      border: '1px solid rgba(241, 58, 30, 0.3)', 
                      padding: '4px 10px', 
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    • FREE TIER WORKSPACE
                  </span>

                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '6px 12px', 
                      border: '1px solid rgba(255, 255, 255, 0.12)', 
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#FFFFFF'
                    }}
                    onClick={() => setWsDropdownOpen(prev => !prev)}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    <span>Account</span>
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </div>
              </div>

              {/* MAIN SCROLLABLE CONTENT BODY */}
              <div className="dashboard-body">
                {/* Fallback mock skeletons when loadingState is active */}
                {loadingState ? (
                  <div className="skeleton-view-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', width: '100%' }}>
                    <div className="skeleton-hero" style={{ height: '140px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', opacity: 0.5, animation: 'pulse 1.5s infinite alternate' }}></div>
                    <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
                      <div className="col-span-4 skeleton-card" style={{ height: '220px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', opacity: 0.5, animation: 'pulse 1.5s infinite alternate' }}></div>
                      <div className="col-span-8 skeleton-card" style={{ height: '220px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', opacity: 0.5, animation: 'pulse 1.5s infinite alternate' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="real-view-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <ErrorBoundary>
                      <Outlet />
                    </ErrorBoundary>
                  </div>
                )}
              </div>

              {/* ASK AURA AI CHAT FLOATING DRAWER */}
              <div className={`ai-chat-drawer ${auraAiActive ? 'active' : ''}`}>
                <div className="flex-between" style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--border-default)' }}>
                  <div className="flex-center" style={{ gap: 'var(--space-xs)' }}>
                    <svg width="16" height="16" fill="none" stroke="var(--brand-primary)" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.094l5.096-.813L9 9.187l.813 5.094 5.096.813-5.096.813zM19.071 4.929l-1.414 1.414m0-1.414l1.414 1.414M12 3v1m0 16v1M3 12h1m16 0h1"/></svg>
                    <span className="text-body-small font-bold text-primary">Aura AI Copilot</span>
                  </div>
                  <button className="btn btn-tertiary btn-sm" style={{ padding: '2px' }} onClick={() => setAuraAiActive(false)}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </div>
                
                {/* Chat window list */}
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index}
                      className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                      style={{ 
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'user' ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                        color: msg.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-lg)',
                        maxWidth: '85%',
                        fontSize: '0.8125rem',
                        lineHeight: 1.4,
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Form Input */}
                <form 
                  onSubmit={handleAIChatSubmit}
                  style={{ 
                    padding: 'var(--space-md)', 
                    borderTop: '1px solid var(--border-default)', 
                    display: 'flex', 
                    gap: 'var(--space-xs)' 
                  }}
                >
                  <input 
                    type="text" 
                    id="ai-chat-input"
                    className="input-text" 
                    placeholder="Ask Aura AI..." 
                    style={{ flexGrow: 1, fontSize: '0.8125rem' }}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                </form>
              </div>
            </div>
          </div>
  );
};
