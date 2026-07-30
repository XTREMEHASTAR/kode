import React from 'react';
import { NavLink } from 'react-router-dom';

interface ProGlobalSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ProGlobalSidebar: React.FC<ProGlobalSidebarProps> = ({
  collapsed = false,
  onToggleCollapse
}) => {
  const primaryNav = [
    { path: '/pro/prediction', label: 'Prediction Report', icon: '📊', badge: 'MAIN' },
    { path: '/pro/simulation', label: 'Scenario Simulator', icon: '⚡', badge: 'OPTIONAL' },
    { path: '/pro/world', label: 'AuraWorld OS', icon: '🌐' },
    { path: '/settings', label: 'System Settings', icon: '⚙️' }
  ];

  return (
    <aside
      style={{
        width: collapsed ? '64px' : '220px',
        backgroundColor: '#070B14',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: collapsed ? '16px 10px' : '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#F13A1E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: '#FFF',
              fontSize: '14px',
              boxShadow: '0 0 12px rgba(241, 58, 30, 0.5)'
            }}
          >
            A
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                AuraCore Pro
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
                SIMULATION WORKSPACE
              </div>
            </div>
          )}
        </div>

        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ◀
          </button>
        )}
      </div>

      {/* Main Single Navigation Column */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {primaryNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
              backgroundColor: isActive ? 'rgba(241, 58, 30, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(241, 58, 30, 0.35)' : '1px solid transparent',
              textDecoration: 'none',
              fontWeight: isActive ? 800 : 600,
              fontSize: '13px',
              transition: 'all 0.15s ease'
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '15px' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
            {!collapsed && item.badge && (
              <span style={{ fontSize: '8px', fontWeight: 900, color: '#F13A1E', backgroundColor: 'rgba(241, 58, 30, 0.2)', padding: '2px 5px', borderRadius: '4px' }}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer System Version */}
      {!collapsed && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)', fontFamily: 'monospace' }}>
          <div>12-ENGINE WORLD CLUSTER</div>
          <div style={{ color: '#4ADE80', fontWeight: 700, marginTop: '2px' }}>● SYSTEM ONLINE</div>
        </div>
      )}
    </aside>
  );
};
