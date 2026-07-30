import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProOSHeaderProps {
  activeViewTitle?: string;
  simulatingStatus?: string;
}

export const ProOSHeader: React.FC<ProOSHeaderProps> = ({
  activeViewTitle = 'Simulation Studio',
  simulatingStatus = 'AI Researcher Cluster Active • 128 GPU Nodes Online'
}) => {
  const { user } = useAuth();

  return (
    <header style={{
      height: '64px',
      backgroundColor: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      
      {/* Active View Context & AI Telemetry */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            color: '#FFFFFF'
          }}>
            {activeViewTitle}
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />

        <div className="pro-ai-pulse" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
          <span>{simulatingStatus}</span>
        </div>
      </div>

      {/* Omni-Search Command Menu & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        
        {/* Cmd+K Search Trigger */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12.5px',
          color: 'rgba(255, 255, 255, 0.5)',
          cursor: 'pointer'
        }}>
          <span>🔍 Search simulations, content DNA, viewers...</span>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '11px',
            color: '#FFFFFF',
            fontWeight: 700
          }}>
            ⌘K
          </span>
        </div>

        {/* User Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--pro-vermilion, #F13A1E)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(241, 58, 30, 0.4)'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
            {user?.name || 'Pro Creator'}
          </span>
        </div>

      </div>

    </header>
  );
};
