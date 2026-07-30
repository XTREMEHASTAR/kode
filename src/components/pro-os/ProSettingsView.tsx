import React, { useState } from 'react';

type SettingsSection = 
  | 'workspace'
  | 'simulation'
  | 'models'
  | 'providers'
  | 'gpu'
  | 'notifications'
  | 'billing'
  | 'apikeys'
  | 'security'
  | 'appearance'
  | 'shortcuts'
  | 'logs'
  | 'developer';

export const ProSettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('workspace');

  // Form State Demo
  const [workspaceName, setWorkspaceName] = useState('AuraCore Pro Lab');
  const [mcRuns, setMcRuns] = useState(10000);
  const [gpuCluster, setGpuCluster] = useState('8x NVIDIA H100 SXM5');
  const [devMode, setDevMode] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const sections: { id: SettingsSection; label: string; icon: string }[] = [
    { id: 'workspace', label: 'Workspace', icon: '🏢' },
    { id: 'simulation', label: 'Simulation Engine', icon: '⚡' },
    { id: 'models', label: 'AI Models', icon: '🧠' },
    { id: 'providers', label: 'API Providers', icon: '🔌' },
    { id: 'gpu', label: 'GPU Hardware', icon: '💻' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing & Usage', icon: '💳' },
    { id: 'apikeys', label: 'API Keys & Secrets', icon: '🔑' },
    { id: 'security', label: 'Security & SSO', icon: '🛡️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: '⌨️' },
    { id: 'logs', label: 'System Logs', icon: '📜' },
    { id: 'developer', label: 'Developer Mode', icon: '🛠️' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: '#FFFFFF', paddingBottom: '40px' }}>
      
      {/* ── 1. ENTERPRISE SETTINGS HEADER ───────────────────────────────────── */}
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
              ⚙️ ENTERPRISE SYSTEM SETTINGS
            </span>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>
              Status: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>HEALTHY • 13 SECTIONS ACTIVE</span>
            </span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
            AuraCore Environment Configuration
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
            <span>Organization: <strong style={{ color: '#FFFFFF' }}>{workspaceName}</strong></span>
            <span>•</span>
            <span>Active GPU: <strong style={{ color: '#4ADE80' }}>{gpuCluster}</strong></span>
          </div>
        </div>

        <button
          onClick={() => alert('Settings saved successfully.')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#4ADE80',
            color: '#0F172A',
            fontSize: '12.5px',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)'
          }}
        >
          💾 SAVE CONFIGURATION
        </button>
      </div>

      {/* ── 2. 13-SECTION NAVIGATION LAYOUT ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        
        {/* Sidebar Nav (13 Sections) */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeSection === s.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: activeSection === s.id ? '#FFFFFF' : '#94A3B8',
                fontSize: '13px',
                fontWeight: activeSection === s.id ? 800 : 500,
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '15px' }}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Configuration Content Area */}
        <div style={{ backgroundColor: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SECTION 1: WORKSPACE */}
          {activeSection === 'workspace' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🏢 Workspace Settings</h3>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Workspace Name</label>
                <input type="text" value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Region</label>
                  <input type="text" value="us-east-1 (N. Virginia)" disabled style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#94A3B8' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Team Capacity</label>
                  <input type="text" value="12 Active Team Members" disabled style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', color: '#94A3B8' }} />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SIMULATION ENGINE */}
          {activeSection === 'simulation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>⚡ Simulation Engine Defaults</h3>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Default Monte Carlo Runs</label>
                <input type="number" value={mcRuns} onChange={(e) => setMcRuns(Number(e.target.value))} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div style={{ fontSize: '12px', color: '#CBD5E1', backgroundColor: 'rgba(56,189,248,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56,189,248,0.2)' }}>
                Confidence Interval Target: <strong>95% (p &lt; 0.001)</strong> | Seed Audience Batch: <strong>1,000 Viewers</strong>
              </div>
            </div>
          )}

          {/* SECTION 3: AI MODELS */}
          {activeSection === 'models' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🧠 Multimodal AI Models</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Multimodal Reasoning Engine</span>
                  <strong style={{ color: '#38BDF8' }}>Google Gemini 1.5 Pro</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Computer Vision Frame Extractor</span>
                  <strong style={{ color: '#4ADE80' }}>AuraVision-v3.2 (60fps)</strong>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Audio Transcription Engine</span>
                  <strong style={{ color: '#FACC15' }}>OpenAI Whisper-v3 Large</strong>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: API PROVIDERS */}
          {activeSection === 'providers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🔌 Connected API Providers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <div style={{ fontWeight: 900, color: '#4ADE80' }}>Google Gemini API</div>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Status: CONNECTED (Latency 12ms)</span>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <div style={{ fontWeight: 900, color: '#4ADE80' }}>OpenAI API</div>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Status: CONNECTED (Latency 18ms)</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: GPU HARDWARE */}
          {activeSection === 'gpu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>💻 GPU Cluster Hardware</h3>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Active Compute Cluster</label>
                <select value={gpuCluster} onChange={(e) => setGpuCluster(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#FFF' }}>
                  <option value="8x NVIDIA H100 SXM5">8x NVIDIA H100 SXM5 (80GB HBM3)</option>
                  <option value="4x NVIDIA A100 Tensor Core">4x NVIDIA A100 Tensor Core (80GB)</option>
                </select>
              </div>
            </div>
          )}

          {/* SECTION 6: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🔔 Alert & Notification Preferences</h3>
              <label style={{ fontSize: '13px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" defaultChecked /> Virality Spike Alert (&gt;90% Virality Score)
              </label>
              <label style={{ fontSize: '13px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" defaultChecked /> Monte Carlo Simulation Completion Webhook
              </label>
            </div>
          )}

          {/* SECTION 7: BILLING */}
          {activeSection === 'billing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>💳 Subscription & Usage</h3>
              <div style={{ backgroundColor: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#4ADE80' }}>AURAKERNEL ENTERPRISE PLAN</div>
                <div style={{ fontSize: '12px', color: '#CBD5E1', marginTop: '4px' }}>Compute Credits: <strong>84,200 / 100,000 Monthly Credits</strong></div>
              </div>
            </div>
          )}

          {/* SECTION 8: API KEYS */}
          {activeSection === 'apikeys' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🔑 Production API Keys</h3>
              <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8' }}>AURACORE_PRO_LIVE_KEY</div>
                  <code style={{ fontSize: '13px', color: '#4ADE80' }}>{showKey ? 'ak_live_99827481920412849102941' : 'ak_live_••••••••••••••••••••••••'}</code>
                </div>
                <button onClick={() => setShowKey(!showKey)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'transparent', color: '#38BDF8', cursor: 'pointer', fontSize: '11px' }}>
                  {showKey ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>
          )}

          {/* SECTION 9: SECURITY */}
          {activeSection === 'security' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🛡️ Security & Enterprise SSO</h3>
              <div style={{ fontSize: '13px', color: '#CBD5E1' }}>SAML 2.0 Single Sign-On: <strong style={{ color: '#4ADE80' }}>ENFORCED</strong></div>
              <div style={{ fontSize: '13px', color: '#CBD5E1' }}>Two-Factor Authentication (2FA): <strong style={{ color: '#4ADE80' }}>REQUIRED FOR ALL USERS</strong></div>
            </div>
          )}

          {/* SECTION 10: APPEARANCE */}
          {activeSection === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🎨 Visual Theme & Density</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ padding: '12px 20px', borderRadius: '8px', border: '2px solid #38BDF8', backgroundColor: '#0F172A', color: '#FFF', fontWeight: 900, cursor: 'pointer' }}>
                  Dark Mode Pro (Active)
                </button>
              </div>
            </div>
          )}

          {/* SECTION 11: KEYBOARD SHORTCUTS */}
          {activeSection === 'shortcuts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>⌨️ Hotkey Cheat Sheet</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}><code>⌘ + K</code> — Command Palette</div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}><code>⌘ + R</code> — Rerun Simulation</div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}><code>Space</code> — Pause/Play Replay</div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px' }}><code>Esc</code> — Exit Fullscreen</div>
              </div>
            </div>
          )}

          {/* SECTION 12: SYSTEM LOGS */}
          {activeSection === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>📜 System Diagnostic Logs</h3>
              <pre style={{ backgroundColor: '#090D16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px', fontSize: '11px', color: '#4ADE80', height: '180px', overflowY: 'auto', margin: 0, fontFamily: 'monospace' }}>
{`[2026-07-29 19:12:01] INFO  Monte Carlo Engine initialized (10,000 runs)
[2026-07-29 19:12:02] TRACE Swarm convergence hit 99.4% threshold
[2026-07-29 19:12:03] INFO  Gemini-1.5-Pro API response latency: 12ms
[2026-07-29 19:12:04] SUCCESS Virality prediction score generated: 94.2/100`}
              </pre>
            </div>
          )}

          {/* SECTION 13: DEVELOPER MODE */}
          {activeSection === 'developer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>🛠️ Developer Debugging Suite</h3>
              <label style={{ fontSize: '13px', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} /> Enable Mock Swarm Debugging Telemetry
              </label>
              <div style={{ fontSize: '12px', color: '#94A3B8', backgroundColor: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                REST Endpoint Debugger: <code style={{ color: '#38BDF8' }}>https://api.auracore.io/v3/simulate</code>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
