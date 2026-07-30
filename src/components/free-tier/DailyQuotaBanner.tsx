import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { freeTierService } from '../../services/freeTierService';

interface DailyQuotaBannerProps {
  onUpgradeClick?: () => void;
  onResetTestClick?: () => void;
  quotaUsed?: number;
  quotaLimit?: number;
}

export const DailyQuotaBanner: React.FC<DailyQuotaBannerProps> = ({
  onUpgradeClick,
  onResetTestClick,
  quotaUsed = 3,
  quotaLimit = 3,
}) => {
  const navigate = useNavigate();
  const [resetTimeLeft, setResetTimeLeft] = useState<{ hours: number; minutes: number }>({ hours: 12, minutes: 0 });
  const isDev = Boolean(import.meta.env.DEV || import.meta.env.MODE === 'development');

  const handleUpgrade = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      navigate('/pricing?source=daily_quota_banner');
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setHours(24, 0, 0, 0);
      const diffMs = Math.max(0, nextReset.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      setResetTimeLeft({ hours, minutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div
      role="region"
      aria-label="Daily Quota Reached"
      style={{
        width: '100%',
        backgroundColor: '#F0F7FF',
        backgroundImage: 'linear-gradient(180deg, #F0F7FF 0%, #FAFCFF 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: '20px',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: '0 12px 36px -6px rgba(37, 99, 235, 0.08), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        animation: 'toastSlideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.15)',
              flexShrink: 0
            }}
          >
            ⚡
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
            Daily Free Limit Reached
          </h2>
        </div>

        {/* Resets In Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '9999px',
            backgroundColor: '#EFF6FF',
            border: '1px solid #93C5FD',
            color: '#1D4ED8',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '-0.01em'
          }}
        >
          <span>⏱</span>
          <span>Resets in {resetTimeLeft.hours}h {resetTimeLeft.minutes}m</span>
        </div>
      </div>

      {/* Body Copy */}
      <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#334155', margin: '0 0 20px 0', maxWidth: '640px', fontWeight: 450 }}>
        You've used all 3 free AI analyses for today. Upgrade to Pro for unlimited analysis, faster processing, and premium AI features.
      </p>

      {/* Quota Progress Bar Component */}
      <div style={{ marginBottom: '22px', maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          <span>Daily Usage</span>
          <span>{quotaUsed} / {quotaLimit} used (100%)</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: '#DBEAFE', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* CTA Buttons Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* Primary Gradient Upgrade CTA */}
        <button
          onClick={handleUpgrade}
          style={{
            padding: '11px 22px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.45)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.35)';
          }}
        >
          <span>Upgrade to Pro</span>
          <span style={{ fontSize: '15px' }}>→</span>
        </button>

        {/* Secondary Outline CTA */}
        <button
          onClick={handleUpgrade}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            color: '#334155',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#F8FAFC';
            (e.currentTarget as HTMLElement).style.borderColor = '#94A3B8';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#FFFFFF';
            (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1';
          }}
        >
          View Plans
        </button>
      </div>

      {/* Pro Features Included Section */}
      <div style={{ borderTop: '1px solid #DBEAFE', paddingTop: '18px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>✨ Pro Includes</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px 24px', fontSize: '13px', color: '#475569', fontWeight: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563EB' }}>⚡</span>
            <span>Unlimited AI analyses</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563EB' }}>✨</span>
            <span>Unlimited script optimization</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563EB' }}>🚀</span>
            <span>Premium AI models</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#2563EB' }}>⚡</span>
            <span>Priority processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};
