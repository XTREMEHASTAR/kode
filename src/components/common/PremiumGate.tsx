import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { FeatureKey } from '../../types/subscription';
import { UpgradeModal } from './UpgradeModal';

interface PremiumGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  source?: string;
  badgeLabel?: string;
  title?: string;
  description?: string;
}

export const PremiumGate: React.FC<PremiumGateProps> = ({
  feature,
  children,
  fallback,
  source,
  badgeLabel = 'PRO FEATURE',
  title,
  description
}) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const check = entitlementService.canAccessFeature(user, feature);

  if (check.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      style={{
        backgroundColor: '#FCF9F3',
        border: '1px solid rgba(23, 50, 71, 0.15)',
        borderRadius: '12px',
        padding: '32px 24px',
        textAlign: 'center',
        boxShadow: '0 4px 16px rgba(23, 50, 71, 0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative orbital accent */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '1px stroke rgba(241, 58, 30, 0.2)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: '#E5C88E',
          color: '#173247',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}
      >
        <span style={{ color: '#F13A1E' }}>✦</span> {badgeLabel}
      </div>

      <h3
        style={{
          color: '#173247',
          fontSize: '20px',
          fontWeight: 800,
          margin: '0 0 8px 0',
          fontFamily: 'Manrope, sans-serif'
        }}
      >
        {title || 'Unlock Advanced Creative Intelligence'}
      </h3>

      <p
        style={{
          color: '#556B7D',
          fontSize: '14px',
          lineHeight: 1.5,
          maxWidth: '480px',
          margin: '0 auto 24px auto'
        }}
      >
        {description || 'This feature requires KONTAGI Pro. Upgrade to unlock second-by-second analytics, full script rewrites, and custom exports.'}
      </p>

      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: '10px 22px',
          borderRadius: '8px',
          backgroundColor: '#F13A1E',
          color: '#FFFFFF',
          fontSize: '13.5px',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(241, 58, 30, 0.25)',
          transition: 'all 0.2s ease'
        }}
      >
        Unlock with Pro
      </button>

      {showModal && (
        <UpgradeModal
          source={source || feature}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
