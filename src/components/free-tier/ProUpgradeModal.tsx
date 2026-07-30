import React, { useEffect } from 'react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title?: string;
  description?: string;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade,
  title = "Unlock Full Script Optimization",
  description = "KONTAGI Pro gives you section-by-section script rewriting, advanced tone controls, and unlimited optimizations."
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        padding: '16px'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          animation: 'kontagiSimpleModalFade 0.2s ease-out forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes kontagiSimpleModalFade {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#758796',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#162A3B')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#758796')}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Centered Sparkle Icon */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 16px auto'
            }}
          >
            ✨
          </div>

          {/* High-Contrast Visible Title */}
          <h2
            style={{
              margin: '0 0 10px 0',
              fontSize: '22px',
              color: '#162A3B',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.3
            }}
          >
            {title}
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: '14px',
              color: '#556B7D',
              lineHeight: 1.5,
              fontWeight: 400
            }}
          >
            {description}
          </p>
        </div>

        {/* Feature List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '15px' }}>✓</span>
            <span style={{ fontSize: '14px', color: '#162A3B', fontWeight: 500 }}>
              Full script rewrites (Hook, Body, CTA)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '15px' }}>✓</span>
            <span style={{ fontSize: '14px', color: '#162A3B', fontWeight: 500 }}>
              Advanced rewrite pacing & velocity
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '15px' }}>✓</span>
            <span style={{ fontSize: '14px', color: '#162A3B', fontWeight: 500 }}>
              Multiple full-script variants
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '15px' }}>✓</span>
            <span style={{ fontSize: '14px', color: '#162A3B', fontWeight: 500 }}>
              Unlimited AI optimizations
            </span>
          </div>
        </div>

        {/* Upgrade Primary Button */}
        <button
          onClick={onUpgrade}
          style={{
            width: '100%',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#162A3B',
            color: '#FFFFFF',
            fontSize: '15px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22, 42, 59, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0F1E2B';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#162A3B';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Upgrade to KONTAGI Pro
        </button>

        {/* Maybe Later Link */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span 
            onClick={onClose}
            style={{
              fontSize: '13.5px',
              color: '#758796',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#162A3B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#758796')}
          >
            Maybe later
          </span>
        </div>
      </div>
    </div>
  );
};
