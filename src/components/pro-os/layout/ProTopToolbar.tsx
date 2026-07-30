import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface ProTopToolbarProps {
  onToggleInspector?: () => void;
  onToggleConsole?: () => void;
  isInspectorOpen?: boolean;
  isConsoleOpen?: boolean;
}

export const ProTopToolbar: React.FC<ProTopToolbarProps> = ({
  onToggleInspector,
  onToggleConsole,
  isInspectorOpen = true,
  isConsoleOpen = true
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('simulation')) return 'Pro Workspace / ⚡ Simulation Studio';
    if (path.includes('content-dna')) return 'Pro Workspace / 🧬 Content DNA';
    if (path.includes('ai-viewers')) return 'Pro Workspace / 👥 AI Viewers Swarm';
    if (path.includes('world')) return 'Pro Workspace / 🌐 AuraWorld OS';
    if (path.includes('recommendation')) return 'Engine Labs / 🎯 Recommendation';
    if (path.includes('trends')) return 'Engine Labs / 🔥 Trend Engine';
    if (path.includes('audience')) return 'Engine Labs / 👤 Audience Matrix';
    if (path.includes('creator')) return 'Engine Labs / 💼 Creator Profile';
    if (path.includes('behavior')) return 'Engine Labs / 🧠 Behavior Models';
    if (path.includes('memory')) return 'Engine Labs / 💾 Memory Engine';
    if (path.includes('community')) return 'Engine Labs / 💬 Community Physics';
    if (path.includes('reports')) return 'Engine Labs / 📊 Reports';
    if (path.includes('benchmarks')) return 'Engine Labs / ⚖️ Benchmarks';
    return 'Pro Workspace / Simulation Studio';
  };

  return (
    <header
      style={{
        height: '48px',
        backgroundColor: '#090D16',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {/* Left: Breadcrumbs & Workspace Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)' }}>
          {getBreadcrumb()}
        </span>

        {/* Command Palette Trigger */}
        <button
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '4px 10px',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🔍 Quick Search & Commands...</span>
          <kbd style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '2px 4px', borderRadius: '3px', fontSize: '9px' }}>⌘K</kbd>
        </button>
      </div>

      {/* Right: Controls & Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        
        {/* Live Cluster Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#4ADE80', fontFamily: 'monospace' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80', boxShadow: '0 0 8px #4ADE80' }} />
          <span>12-Engine Cluster</span>
        </div>

        {/* Panel Toggles */}
        {onToggleInspector && (
          <button
            onClick={onToggleInspector}
            title="Toggle Right Inspector Panel"
            style={{
              backgroundColor: isInspectorOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isInspectorOpen ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '5px 9px',
              color: isInspectorOpen ? '#38BDF8' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ⚙️ Inspector
          </button>
        )}

        {onToggleConsole && (
          <button
            onClick={onToggleConsole}
            title="Toggle Bottom Console Panel"
            style={{
              backgroundColor: isConsoleOpen ? 'rgba(241, 58, 30, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isConsoleOpen ? '1px solid rgba(241, 58, 30, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '5px 9px',
              color: isConsoleOpen ? '#F13A1E' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            💻 Console
          </button>
        )}

        {/* User Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '12px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#38BDF8',
              color: '#000',
              fontWeight: 900,
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {user?.email?.charAt(0).toUpperCase() || 'P'}
          </div>
        </div>

      </div>
    </header>
  );
};
