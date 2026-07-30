import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { freeTierService } from '../../services/freeTierService';

export const FreeTierUpgradeBanner: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const isPro = entitlementService.canAccessFeature(user, 'predictive_retention').allowed || user?.plan === 'pro' || freeTierService.isProActive();

  if (isPro) {
    return null; // Hide upgrade banner for Pro users
  }

  return (
    <div
      onClick={() => navigate('/pricing?source=global_upgrade_banner')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? '#FAFAF8' : '#FFFFFF',
        borderRadius: '16px',
        border: isHovered ? '1px solid #162A3B' : '1px solid #E8E3DA',
        padding: '24px',
        boxShadow: isHovered ? '0 4px 12px rgba(22, 42, 59, 0.06)' : '0 2px 8px rgba(22, 42, 59, 0.03)',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginTop: '24px',
        transition: 'all 200ms ease'
      }}
    >
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#162A3B', margin: '0 0 4px 0' }}>
          Ready for more?
        </h3>
        <p style={{ fontSize: '14px', color: '#667085', margin: 0 }}>
          Unlock unlimited analyses, AI Rewrite and Retention Heatmaps.
        </p>
      </div>

      <div style={{
        fontSize: '14px',
        fontWeight: 700,
        color: '#162A3B',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap'
      }}>
        <span>Upgrade to Pro</span>
        <span style={{
          color: isHovered ? '#FF6B3D' : '#162A3B',
          fontSize: '16px',
          transition: 'color 200ms ease, transform 200ms ease',
          transform: isHovered ? 'translate(2px, -2px)' : 'none',
          display: 'inline-block'
        }}>
          ↗
        </span>
      </div>
    </div>
  );
};
