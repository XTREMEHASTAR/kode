import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComingSoonService,
  ComingSoonConfig,
  WaitlistEntry,
  ReleaseUpdateItem,
  VIRAL_HEADLINES
} from '../../services/comingSoonService';
import kontagiLogo from '../../assets/branding/kontagi-icon-180x180.png';

export const ComingSoonAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ComingSoonConfig>(ComingSoonService.getConfig());
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'content' | 'progress' | 'notes' | 'waitlist' | 'settings'>('content');
  const [savedToast, setSavedToast] = useState(false);

  // New Release Note Form State
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteDesc, setNewNoteDesc] = useState('');
  const [newNoteBadge, setNewNoteBadge] = useState('FEATURE');

  useEffect(() => {
    // Load config and waitlist
    setConfig(ComingSoonService.getConfig());
    setWaitlist(ComingSoonService.getWaitlistEntries());
  }, []);

  const handleSave = async () => {
    const updated = await ComingSoonService.saveConfig(config);
    setConfig(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleAddReleaseNote = () => {
    if (!newNoteTitle.trim()) return;
    const note: ReleaseUpdateItem = {
      id: 'note_' + Date.now(),
      date: 'Today',
      title: newNoteTitle,
      description: newNoteDesc || 'Engineering milestone completed.',
      completed: true,
      badge: newNoteBadge
    };

    const updatedNotes = [note, ...config.releaseNotes];
    setConfig({ ...config, releaseNotes: updatedNotes });
    setNewNoteTitle('');
    setNewNoteDesc('');
  };

  const handleDeleteNote = (id: string) => {
    setConfig({
      ...config,
      releaseNotes: config.releaseNotes.filter((n) => n.id !== id)
    });
  };

  const exportWaitlistCSV = () => {
    if (waitlist.length === 0) return;
    const headers = ['Ticket #', 'Name', 'Email', 'Company', 'Use Case', 'Referral', 'Joined At'];
    const rows = waitlist.map((w) => [
      w.ticketNumber,
      `"${w.name}"`,
      `"${w.email}"`,
      `"${w.company || ''}"`,
      `"${w.useCase}"`,
      `"${w.referralSource}"`,
      `"${w.joinedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kontagi_waitlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0F1C28',
        color: '#F8FAFC',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '32px 24px',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header Navigation */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto 28px auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={kontagiLogo}
            alt="Kontagi Logo"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(255, 107, 61, 0.3)',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B3D', letterSpacing: '0.1em' }}>
                KONTAGI ADMIN CONTROL
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, margin: '2px 0 0 0', color: '#FFFFFF' }}>
              Coming Soon Manager
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/coming-soon')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            👁️ View Public Experience
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              backgroundColor: '#FF6B3D',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 107, 61, 0.4)'
            }}
          >
            💾 Save All Changes
          </button>
        </div>
      </div>

      {savedToast && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto 20px auto',
            padding: '12px 20px',
            borderRadius: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid #10B981',
            color: '#4ADE80',
            fontSize: '14px',
            fontWeight: 700
          }}
        >
          ✓ Coming Soon Configuration Saved Successfully!
        </div>
      )}

      {/* Main Admin Card Container */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: '#162A3B',
          borderRadius: '24px',
          border: '1px solid rgba(255, 107, 61, 0.25)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
          overflow: 'hidden'
        }}
      >
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: '#0F1C28',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'content', label: '✏️ Hero & Messaging' },
            { id: 'progress', label: '📊 Development Progress' },
            { id: 'notes', label: '📝 Changelog & Release Notes' },
            { id: 'waitlist', label: `🎟️ Pre-Registrations (${waitlist.length})` },
            { id: 'settings', label: '⚙️ System Controls & Theme' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '16px 24px',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #FF6B3D' : '3px solid transparent',
                backgroundColor: activeTab === tab.id ? '#162A3B' : 'transparent',
                color: activeTab === tab.id ? '#FF6B3D' : '#94A3B8',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: HERO & MESSAGING */}
        {activeTab === 'content' && (
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Feature Name
              </label>
              <input
                type="text"
                value={config.featureName}
                onChange={(e) => setConfig({ ...config, featureName: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Hero Title (Main Headline)
              </label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Hero Subtitle (Description)
              </label>
              <textarea
                rows={3}
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                className="admin-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Category Pill Label
              </label>
              <input
                type="text"
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                className="admin-input"
              />
            </div>

            {/* Viral Headlines Randomizer Pool */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700 }}>
                  Viral Sarcastic Headlines Pool ({config.customMessages.length} headlines)
                </label>
                <button
                  onClick={() => setConfig({ ...config, customMessages: VIRAL_HEADLINES })}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 107, 61, 0.2)',
                    color: '#FF6B3D',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset Default Pool
                </button>
              </div>
              <textarea
                rows={6}
                value={config.customMessages.join('\n')}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    customMessages: e.target.value.split('\n').filter((line) => line.trim())
                  })
                }
                className="admin-input"
                style={{ fontFamily: 'monospace', fontSize: '12px' }}
              />
              <span style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', display: 'block' }}>
                Enter one sarcastic headline per line. The public page will pick randomly on load or click.
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: DEVELOPMENT PROGRESS */}
        {activeTab === 'progress' && (
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FF6B3D' }}>
              Stage Progress Percentages (0 - 100%)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  🧪 Research & Architecture ({config.progress.research}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.progress.research}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      progress: { ...config.progress, research: Number(e.target.value) }
                    })
                  }
                  style={{ width: '100%', accentColor: '#FF6B3D' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  🎨 UI/UX Design ({config.progress.design}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.progress.design}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      progress: { ...config.progress, design: Number(e.target.value) }
                    })
                  }
                  style={{ width: '100%', accentColor: '#FF6B3D' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  ⚡ Core Development ({config.progress.development}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.progress.development}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      progress: { ...config.progress, development: Number(e.target.value) }
                    })
                  }
                  style={{ width: '100%', accentColor: '#FF6B3D' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  🛡️ QA & Security Testing ({config.progress.testing}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.progress.testing}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      progress: { ...config.progress, testing: Number(e.target.value) }
                    })
                  }
                  style={{ width: '100%', accentColor: '#FF6B3D' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  🚀 Global Deployment ({config.progress.deployment}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.progress.deployment}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      progress: { ...config.progress, deployment: Number(e.target.value) }
                    })
                  }
                  style={{ width: '100%', accentColor: '#FF6B3D' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHANGELOG & RELEASE NOTES */}
        {activeTab === 'notes' && (
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FF6B3D' }}>
              Add New Engineering Update
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Badge</label>
                <input
                  type="text"
                  value={newNoteBadge}
                  onChange={(e) => setNewNoteBadge(e.target.value)}
                  placeholder="e.g. AI ENGINE"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Title</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Added Neural World Engine"
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <input
                  type="text"
                  value={newNoteDesc}
                  onChange={(e) => setNewNoteDesc(e.target.value)}
                  placeholder="Details..."
                  className="admin-input"
                />
              </div>

              <button
                onClick={handleAddReleaseNote}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  backgroundColor: '#FF6B3D',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                + Add Update
              </button>
            </div>

            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '16px 0 8px 0' }}>Existing Updates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {config.releaseNotes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#0F1C28',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', color: '#FF6B3D', fontWeight: 800, marginRight: '8px' }}>
                      [{note.badge}]
                    </span>
                    <strong style={{ fontSize: '14px' }}>{note.title}</strong>
                    <p style={{ fontSize: '12px', color: '#94A3B8', margin: '2px 0 0 0' }}>{note.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Delete ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: WAITLIST REGISTRATIONS */}
        {activeTab === 'waitlist' && (
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  Pre-Registered Waitlist Users ({waitlist.length})
                </h3>
                <p style={{ fontSize: '13px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                  All users who registered via the Coming Soon pre-registration form.
                </p>
              </div>

              <button
                onClick={exportWaitlistCSV}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                📥 Export CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}>
                    <th style={{ padding: '10px' }}>Ticket #</th>
                    <th style={{ padding: '10px' }}>Name</th>
                    <th style={{ padding: '10px' }}>Email</th>
                    <th style={{ padding: '10px' }}>Company</th>
                    <th style={{ padding: '10px' }}>Use Case</th>
                    <th style={{ padding: '10px' }}>Referral</th>
                    <th style={{ padding: '10px' }}>Joined At</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((w) => (
                    <tr key={w.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px', fontFamily: 'monospace', color: '#FF6B3D', fontWeight: 800 }}>
                        #{w.ticketNumber}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{w.name}</td>
                      <td style={{ padding: '10px' }}>{w.email}</td>
                      <td style={{ padding: '10px', color: '#94A3B8' }}>{w.company || '—'}</td>
                      <td style={{ padding: '10px' }}>{w.useCase}</td>
                      <td style={{ padding: '10px', color: '#94A3B8' }}>{w.referralSource}</td>
                      <td style={{ padding: '10px', color: '#94A3B8', fontSize: '11px' }}>
                        {new Date(w.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM CONTROLS & THEME */}
        {activeTab === 'settings' && (
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Launch Countdown Target Date (ISO format)
              </label>
              <input
                type="text"
                value={config.launchDate}
                onChange={(e) => setConfig({ ...config, launchDate: e.target.value })}
                className="admin-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Enable Pre-Registration Form
                </label>
                <select
                  value={config.enableWaitlist ? 'true' : 'false'}
                  onChange={(e) => setConfig({ ...config, enableWaitlist: e.target.value === 'true' })}
                  className="admin-input"
                >
                  <option value="true">Enabled (Form Visible)</option>
                  <option value="false">Disabled (Hidden)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                  Theme Preset
                </label>
                <select
                  value={config.theme}
                  onChange={(e) => setConfig({ ...config, theme: e.target.value as any })}
                  className="admin-input"
                >
                  <option value="off-white">Warm Off-White (Default Kontagi)</option>
                  <option value="dark-cyber">Dark Cyber Lab (Deep Navy)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Waiting Count Override
                </label>
                <input
                  type="number"
                  value={config.communityStats.waitingCount}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      communityStats: { ...config.communityStats, waitingCount: Number(e.target.value) }
                    })
                  }
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Companies Count Override
                </label>
                <input
                  type="number"
                  value={config.communityStats.companiesCount}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      communityStats: { ...config.communityStats, companiesCount: Number(e.target.value) }
                    })
                  }
                  className="admin-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Countries Count Override
                </label>
                <input
                  type="number"
                  value={config.communityStats.countriesCount}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      communityStats: { ...config.communityStats, countriesCount: Number(e.target.value) }
                    })
                  }
                  className="admin-input"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background-color: #0F1C28;
          color: #FFFFFF;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .admin-input:focus {
          border-color: #FF6B3D;
        }
      `}</style>
    </div>
  );
};
