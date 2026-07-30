import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const ProOSSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections: NavSection[] = [
    {
      title: 'SIMULATION LABORATORY',
      items: [
        { id: 'studio', label: 'Simulation Studio', icon: '⚡', path: '/simulation', badge: 'HERO' },
        { id: 'dna', label: 'Content DNA Fingerprint', icon: '🧬', path: '/dna' },
        { id: 'population', label: 'AI Viewer Population', icon: '👥', path: '/population' },
        { id: 'world', label: 'AuraWorld Engine OS', icon: '🌐', path: '/world', badge: 'LIVE' },
        { id: 'ab_lab', label: 'A/B Simulation Lab', icon: '🧪', path: '/simulation' }
      ]
    },
    {
      title: 'CREATIVE INTELLIGENCE',
      items: [
        { id: 'script_intel', label: 'Script Intelligence', icon: '📜', path: '/script-intelligence' },
        { id: 'video_intel', label: 'Video Intelligence', icon: '🎥', path: '/upload' },
        { id: 'hook_intel', label: 'Hook Intelligence', icon: '🎣', path: '/script-intelligence' },
        { id: 'trend_intel', label: 'Trend Intelligence', icon: '📈', path: '/world' },
        { id: 'competitor', label: 'Competitor Intelligence', icon: '🎯', path: '/world' }
      ]
    },
    {
      title: 'MEMORY & KNOWLEDGE',
      items: [
        { id: 'brand_voice', label: 'Brand Voice & DNA', icon: '🗣️', path: '/settings' },
        { id: 'creative_memory', label: 'Creative Memory Store', icon: '🧠', path: '/library' },
        { id: 'reports', label: 'Interactive Reports', icon: '📊', path: '/simulation' }
      ]
    }
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      backgroundColor: '#090D16',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      zIndex: 90
    }}>
      
      {/* Brand Header */}
      <div style={{
        padding: '22px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer'
      }} onClick={() => navigate('/pro-os')}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #F13A1E 0%, #FF6B3D 100%)',
          color: '#FFFFFF',
          fontSize: '16px',
          fontWeight: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(241, 58, 30, 0.5)'
        }}>
          A
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            AuraCore <span style={{ color: '#F13A1E', fontSize: '11px', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(241, 58, 30, 0.15)', border: '1px solid rgba(241, 58, 30, 0.3)' }}>PRO</span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>
            AI Simulation Operating System
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div style={{ flex: 1, padding: '16px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {sections.map(sec => (
          <div key={sec.title} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.4)', padding: '0 12px 6px 12px', letterSpacing: '0.08em' }}>
              {sec.title}
            </div>

            {sec.items.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'rgba(241, 58, 30, 0.12)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                    border: isActive ? '1px solid rgba(241, 58, 30, 0.3)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      backgroundColor: item.badge === 'HERO' ? '#F13A1E' : '#10B981',
                      color: '#FFFFFF',
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

    </aside>
  );
};
