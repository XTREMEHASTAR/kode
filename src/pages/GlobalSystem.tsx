import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CustomSelect } from '../components/ui/CustomSelect';

export const GlobalSystem: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    theme, 
    setTheme, 
    borderRadius, 
    updateBorderRadius, 
    showToast, 
    currentWorkspace, 
    setWorkspace, 
    workspaces,
    notifications,
    videos,
    setSelectedVideoId
  } = useApp();

  const pathParts = location.pathname.split('/');
  const pageName = pathParts[pathParts.length - 1] || 'settings';

  // 1. LIBRARY PAGE STATE
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // 2. BRAND SYSTEM STATE
  const [brandTagline, setBrandTagline] = useState(currentWorkspace?.tagline || '');
  const [prohibitedTerms, setProhibitedTerms] = useState(currentWorkspace?.prohibited_terms || '');

  // 3. TEAM STATE
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: "Jaiveer Hastar", email: "jaiveer@company.com", role: "Owner" },
    { id: '2', name: "Sarah Connor", email: "sarah@company.com", role: "Admin" },
    { id: '3', name: "John Doe", email: "john@company.com", role: "Editor" }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Editor');

  // 4. CLIENT SHARING STATE
  const [sharedLinks, setSharedLinks] = useState<string[]>([]);

  // 5. COACH ASSISTANT STATE
  const [coachLogs, setCoachLogs] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Welcome to Aura AI Creative Coaching! Ask me how to restructure video hooks to improve first-frame visual lock probabilities." }
  ]);
  const [coachInput, setCoachInput] = useState('');

  // 6. ADMIN SYSTEM STATE
  const [systemLogs, setSystemLogs] = useState<string[]>([
    "System init... OK",
    "Telemetry server connected... OK",
    "Dexie IndexedDB connections active... OK"
  ]);

  // RENDER SEPARATE SUB-PAGES
  const renderLibrary = () => {
    // Merge database videos with default placeholders
    const allLibraryVideos = [
      { id: 'v1', title: 'neural_pipeline_v1.mp4', score: 92, status: 'Completed', date: '2026-07-18', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60' },
      { id: 'v2', title: 'creative_hooks_ad.mp4', score: 85, status: 'Completed', date: '2026-07-16', img: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=100&auto=format&fit=crop&q=60' },
      { id: 'v3', title: 'brand_story_final.mov', score: 82, status: 'Completed', date: '2026-07-15', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&auto=format&fit=crop&q=60' }
    ];

    const filtered = allLibraryVideos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (filterType === 'completed') return matchesSearch && v.status === 'Completed';
      return matchesSearch;
    });

    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-md)' }}>
          <h3 className="font-bold text-primary">Creative Library</h3>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/upload')}>+ Upload Video</button>
        </div>

        <div className="flex-center" style={{ gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
          <input 
            type="text" 
            className="input" 
            style={{ flexGrow: 1 }} 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CustomSelect
            value={filterType}
            onChange={(val) => setFilterType(val)}
            width="170px"
            options={[
              { value: 'all', label: 'All Assets' },
              { value: 'completed', label: 'Completed Analyses' }
            ]}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(v => (
            <div 
              key={v.id} 
              className="flex-between card cursor-pointer" 
              style={{ padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}
              onClick={() => {
                setSelectedVideoId(v.id);
                navigate(`/assets/${v.id}/hooks`);
              }}
            >
              <div className="flex-center" style={{ gap: 'var(--space-sm)' }}>
                <div style={{ width: '48px', height: '48px', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
                  <img src={v.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Thumb" />
                </div>
                <div>
                  <span className="text-body-small font-bold text-primary block">{v.title}</span>
                  <span className="text-micro text-secondary">Added {v.date} &bull; Status: {v.status}</span>
                </div>
              </div>

              <div className="flex-center" style={{ gap: 'var(--space-md)' }}>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-micro text-muted font-bold block">SCORE</span>
                  <span className="text-body-small font-bold text-gradient">{v.score}%</span>
                </div>
                <button className="btn btn-secondary btn-sm">Analyze</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCreators = () => {
    const creators = [
      { name: "Alex Rivers", handle: "@alex_creatives", views: "1.4M", price: "$450/Reel", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60" },
      { name: "Sophia Martinez", handle: "@sophia_socials", views: "3.2M", price: "$850/Reel", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" },
      { name: "Marcus Chen", handle: "@marcus_vids", views: "850K", price: "$280/Reel", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60" }
    ];

    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Creators Hub</h3>
        <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Discover creator partners matching your workspace's brand alignment guidelines.</p>

        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          {creators.map(c => (
            <div key={c.handle} className="col-span-4 card flex-column align-center text-center" style={{ padding: 'var(--space-md)', backgroundColor: 'var(--bg-secondary)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', marginBottom: '8px', border: '2px solid var(--brand-primary)' }}>
                <img src={c.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Avatar" />
              </div>
              <h4 className="font-bold text-primary">{c.name}</h4>
              <span className="text-micro text-secondary" style={{ marginBottom: '12px' }}>{c.handle}</span>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <span className="text-micro text-muted font-bold block">AVG VIEWS</span>
                  <span className="text-body-small font-bold text-primary">{c.views}</span>
                </div>
                <div>
                  <span className="text-micro text-muted font-bold block">RATE</span>
                  <span className="text-body-small font-bold text-primary">{c.price}</span>
                </div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Initiated contract flow with ${c.name}`, 'info')}>Partner Up</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBrand = () => {
    const handleSaveBrandSettings = () => {
      showToast('Brand safety specifications saved', 'success');
    };

    return (
      <div className="card flex-column" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary">Brand Hub & Compliance</h3>
        <p className="text-detail text-secondary">Set prohibited vocabulary limits and brand guidelines rules for all creative analyses.</p>

        <div className="form-group">
          <label className="form-label">Active Workspace Tagline / Mission</label>
          <input 
            type="text" 
            className="input" 
            value={brandTagline} 
            onChange={(e) => setBrandTagline(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Prohibited Keywords / Competitor Terms (Comma separated)</label>
          <textarea 
            className="input" 
            style={{ height: '70px', resize: 'none' }}
            value={prohibitedTerms} 
            onChange={(e) => setProhibitedTerms(e.target.value)} 
          />
        </div>

        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSaveBrandSettings}>Save Specifications</button>
        </div>
      </div>
    );
  };

  const renderCoach = () => {
    const handleSendCoachMsg = (e: React.FormEvent) => {
      e.preventDefault();
      if (!coachInput.trim()) return;

      setCoachLogs(prev => [...prev, { sender: 'user', text: coachInput }]);
      setCoachInput('');

      setTimeout(() => {
        setCoachLogs(prev => [...prev, { 
          sender: 'ai', 
          text: "Based on KONTAGI databases, starting a caption with a direct call-to-action reduces click-through performance by 4.2% on average. Recommend leading with an intrigue question!" 
        }]);
      }, 800);
    };

    return (
      <div className="card flex-column" style={{ padding: 'var(--space-md)', height: '480px' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: '4px' }}>Aura AI Creative Coach</h3>
        <p className="text-detail text-secondary" style={{ marginBottom: '12px' }}>Interactive assistant optimized for digital marketing copy revisions.</p>

        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-secondary)', marginBottom: '12px' }}>
          {coachLogs.map((c, idx) => (
            <div key={idx} style={{ 
              alignSelf: c.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: c.sender === 'user' ? 'var(--brand-primary)' : 'var(--bg-primary)',
              color: c.sender === 'user' ? 'var(--text-inverse)' : 'var(--text-primary)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              maxWidth: '80%'
            }}>
              {c.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSendCoachMsg} style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Ask coaching tip..." 
            value={coachInput}
            onChange={(e) => setCoachInput(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Ask</button>
        </form>
      </div>
    );
  };

  const renderTrend = () => {
    const trends = [
      { title: "Generative Nodes design styling", type: "Visual Theme", growth: "+42% weekly growth", sound: "Ambient synth waves" },
      { title: "Glitch filter overlays", type: "Transition effect", growth: "-12% weekly decline", sound: "Fast beat transitions" },
      { title: "SaaS dashboard speed walkthroughs", type: "Content structure", growth: "+112% weekly spike", sound: "Vocal commentary" }
    ];

    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Trend Intelligence</h3>
        <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Social platform trend analytics matched against your active creative assets.</p>

        <div className="flex-column" style={{ gap: '10px' }}>
          {trends.map(t => (
            <div key={t.title} className="flex-between card" style={{ padding: '12px 16px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <div>
                <span className="badge badge-indigo" style={{ fontSize: '0.625rem', marginBottom: '4px' }}>{t.type}</span>
                <h4 className="font-bold text-primary">{t.title}</h4>
                <span className="text-detail text-secondary">Recommended Audio: {t.sound}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="text-body-small font-bold text-primary block" style={{ color: t.growth.includes('-') ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                  {t.growth}
                </span>
                <button className="btn btn-secondary btn-sm" style={{ marginTop: '6px' }} onClick={() => showToast('Trend references imported to library', 'success')}>Use Trend</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClient = () => {
    const handleGenerateLink = () => {
      const newLink = `https://kontagi.app/share/review_${Math.floor(Math.random()*100000)}`;
      setSharedLinks(prev => [newLink, ...prev]);
      showToast('New client sharing link generated', 'success');
    };

    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Client Collaboration Portal</h3>
        <p className="text-detail text-secondary" style={{ marginBottom: 'var(--space-md)' }}>Generate private review links allowing external clients to leave feedback comments without logging in.</p>

        <button className="btn btn-primary" onClick={handleGenerateLink} style={{ marginBottom: 'var(--space-md)' }}>Generate Private Link</button>

        <div className="flex-column" style={{ gap: '8px' }}>
          {sharedLinks.map((link, idx) => (
            <div key={idx} className="flex-between card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-default)' }}>
              <span className="text-body-small font-mono text-primary truncate" style={{ maxWidth: '300px' }}>{link}</span>
              <button className="btn btn-secondary btn-sm" onClick={() => {
                navigator.clipboard.writeText(link);
                showToast('Link copied to clipboard', 'success');
              }}>Copy</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTeam = () => {
    const handleAddMember = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMemberName.trim() || !newMemberEmail.trim()) return;

      const newM = {
        id: Math.random().toString(),
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole
      };

      setTeamMembers(prev => [...prev, newM]);
      setNewMemberName('');
      setNewMemberEmail('');
      showToast(`Added ${newMemberName} to workspace members`, 'success');
    };

    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: 'var(--space-sm)' }}>Team & Permissions</h3>

        <form onSubmit={handleAddMember} style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
          <input type="text" className="input" placeholder="Full Name" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} style={{ flex: 1 }} />
          <input type="email" className="input" placeholder="Email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} style={{ flex: 1 }} />
          <CustomSelect
            value={newMemberRole}
            onChange={setNewMemberRole}
            width="130px"
            options={[
              { value: 'Admin', label: 'Admin' },
              { value: 'Editor', label: 'Editor' },
              { value: 'Reviewer', label: 'Reviewer' }
            ]}
          />
          <button className="btn btn-primary" type="submit">Invite</button>
        </form>

        <div className="flex-column" style={{ gap: '8px' }}>
          {teamMembers.map(m => (
            <div key={m.id} className="flex-between card" style={{ padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
              <div>
                <span className="text-body-small font-bold text-primary block">{m.name}</span>
                <span className="text-micro text-secondary">{m.email}</span>
              </div>
              <span className="badge badge-indigo">{m.role}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBilling = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: 'var(--space-md)' }}>Billing Center</h3>
        
        <div className="grid-12" style={{ gap: 'var(--space-md)' }}>
          {[
            { plan: "Free Trial", price: "$0", limits: "2 videos maximum, basic analytics only", active: false },
            { plan: "Pro Creator", price: "$29/mo", limits: "Unlimited uploads, full sub-intelligence diagnostics", active: true },
            { plan: "Enterprise Team", price: "$149/mo", limits: "API integrations, team custom workspace configurations", active: false }
          ].map(p => (
            <div key={p.plan} className="col-span-4 card flex-column align-center text-center" style={{ padding: 'var(--space-md)', border: p.active ? '2px solid var(--brand-primary)' : '1px solid var(--border-default)' }}>
              <h4 className="font-bold text-primary">{p.plan}</h4>
              <h2 className="text-gradient font-black" style={{ margin: '8px 0' }}>{p.price}</h2>
              <p className="text-detail text-secondary" style={{ marginBottom: '16px', minHeight: '40px' }}>{p.limits}</p>
              {p.active ? (
                <span className="badge badge-success">Active Plan</span>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={() => showToast(`Upgraded to ${p.plan}`, 'success')}>Upgrade</button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="card" style={{ padding: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary" style={{ marginBottom: 'var(--space-md)' }}>Alert Center Logs</h3>
        <div className="flex-column" style={{ gap: '8px' }}>
          {notifications.map(n => (
            <div key={n.id} className="card" style={{ padding: '12px', borderLeft: '4px solid var(--brand-primary)', backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex-between">
                <span className="text-body-small font-bold text-primary">{n.title}</span>
                <span className="text-micro text-secondary">{new Date(n.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-detail text-secondary" style={{ marginTop: '4px' }}>{n.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="card flex-column" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary">Global settings</h3>

        <div className="form-group">
          <label className="form-label">Theme Appearance</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme('light')}>Light</button>
            <button className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTheme('dark')}>Dark</button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Border Radius Styling Override ({borderRadius}px)</label>
          <input 
            type="range" 
            min="0" 
            max="24" 
            value={borderRadius} 
            onChange={(e) => updateBorderRadius(parseInt(e.target.value))} 
            style={{ width: '100%' }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Selected Language</label>
          <CustomSelect
            value="en"
            onChange={() => showToast('Language selection saved', 'success')}
            width="200px"
            options={[
              { value: 'en', label: 'English (US)' },
              { value: 'es', label: 'Español' },
              { value: 'fr', label: 'Français' }
            ]}
          />
        </div>
      </div>
    );
  };

  const renderAdmin = () => {
    const handleResetDatabase = () => {
      localStorage.clear();
      showToast('Database states cleared. Reloading...', 'warning');
      setTimeout(() => window.location.reload(), 1000);
    };

    return (
      <div className="card flex-column" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary">System Admin Console</h3>

        <div className="card" style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', border: 'none' }}>
          <h4 className="font-bold text-primary" style={{ marginBottom: '8px' }}>Active Logs Terminal</h4>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {systemLogs.map((log, idx) => (
              <div key={idx}>&gt; {log}</div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '16px', display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => {
            setSystemLogs(prev => [...prev, `Manual log poll triggered at ${new Date().toLocaleTimeString()}`]);
            showToast('Pulled system status logs', 'info');
          }}>Poll Logs</button>
          <button className="btn btn-secondary" style={{ backgroundColor: 'var(--accent-red-bg)', color: 'var(--accent-red)' }} onClick={handleResetDatabase}>
            Reset Database
          </button>
        </div>
      </div>
    );
  };

  const renderMobile = () => {
    return (
      <div className="card text-center" style={{ padding: 'var(--space-xl)' }}>
        <h3 className="font-bold text-primary">Mobile Emulator Simulator</h3>
        <p className="text-secondary" style={{ margin: '12px 0' }}>Select the "Mobile" view toggle button in the sandbox header above to preview standard viewport widths.</p>
      </div>
    );
  };

  const renderDesignSystem = () => {
    return (
      <div className="card flex-column" style={{ padding: 'var(--space-md)', gap: 'var(--space-md)' }}>
        <h3 className="font-bold text-primary">Design System Tokens Guide</h3>

        <div>
          <span className="text-detail font-bold text-muted block" style={{ marginBottom: '6px' }}>PALETTE SWATCHES</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--brand-primary)', borderRadius: 'var(--radius-sm)' }} title="Brand Primary"></div>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-purple)', borderRadius: 'var(--radius-sm)' }} title="Accent Purple"></div>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-orange)', borderRadius: 'var(--radius-sm)' }} title="Accent Orange"></div>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-green)', borderRadius: 'var(--radius-sm)' }} title="Accent Green"></div>
            <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--accent-red)', borderRadius: 'var(--radius-sm)' }} title="Accent Red"></div>
          </div>
        </div>

        <div>
          <span className="text-detail font-bold text-muted block" style={{ marginBottom: '6px' }}>BUTTON TOKENS</span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-secondary">Secondary Button</button>
            <button className="btn btn-tertiary">Tertiary Button</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-column" style={{ gap: 'var(--space-lg)' }}>
      {pageName === 'library' && renderLibrary()}
      {pageName === 'creators' && renderCreators()}
      {pageName === 'brand' && renderBrand()}
      {pageName === 'coach' && renderCoach()}
      {pageName === 'trend' && renderTrend()}
      {pageName === 'client' && renderClient()}
      {pageName === 'team' && renderTeam()}
      {pageName === 'billing' && renderBilling()}
      {pageName === 'notifications' && renderNotifications()}
      {pageName === 'settings' && renderSettings()}
      {pageName === 'admin' && renderAdmin()}
      {pageName === 'mobile' && renderMobile()}
      {pageName === 'design-system' && renderDesignSystem()}
    </div>
  );
};
