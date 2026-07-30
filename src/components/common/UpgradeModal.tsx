import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  source?: string;
  onClose: () => void;
}

const SOURCE_DETAILS: Record<string, { title: string; subtitle: string; icon: string }> = {
  retention_map: {
    title: 'Unlock Full Retention Analytics',
    subtitle: 'Identify exact drop-off points with predictive retention maps before publishing your creative.',
    icon: '📊'
  },
  ai_limit: {
    title: 'Unlock Full Script Optimization',
    subtitle: 'Unlock AI-powered script rewriting with unlimited optimizations, advanced pacing controls, and multiple premium rewrite styles.',
    icon: '✨'
  },
  report: {
    title: 'Turn Retention Data Into Action',
    subtitle: 'Export complete retention reports and full-script optimization breakdowns instantly.',
    icon: '📄'
  },
  sidebar: {
    title: 'Unlock KONTAGI Pro Suite',
    subtitle: 'Get unlimited access to predictive analytics, AI script rewrites, and custom executive exports.',
    icon: '✦'
  }
};

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ source = 'ai_limit', onClose }) => {
  const navigate = useNavigate();
  const info = SOURCE_DETAILS[source] || SOURCE_DETAILS.ai_limit;

  // Accessibility: Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleProceed = () => {
    onClose();
    navigate(`/pricing?source=${encodeURIComponent(source)}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(22, 42, 59, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'kontagiModalBackdropFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <style>{`
        @keyframes kontagiModalBackdropFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes kontagiModalContentScale {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .kontagi-feature-card {
          background-color: #FFFFFF;
          border: 1px solid #E8E3DA;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .kontagi-feature-card:hover {
          border-color: rgba(255, 107, 61, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(22, 42, 59, 0.08);
        }
        .kontagi-upgrade-btn {
          width: 100%;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FF6B3D 0%, #F45D48 100%);
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 10px 24px -4px rgba(255, 107, 61, 0.38);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .kontagi-upgrade-btn:hover {
          transform: translateY(-1.5px);
          box-shadow: 0 14px 32px -4px rgba(255, 107, 61, 0.48);
          filter: brightness(1.03);
        }
        .kontagi-upgrade-btn:active {
          transform: translateY(0);
        }
        .kontagi-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #FAF8F3;
          border: 1px solid #E8E3DA;
          color: #758796;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .kontagi-close-btn:hover {
          color: #162A3B;
          background: #FFFFFF;
          border-color: #CBD5E1;
        }
      `}</style>

      <div
        style={{
          backgroundColor: '#FAF8F3',
          border: '1px solid #E8E3DA',
          borderRadius: '24px',
          maxWidth: '580px',
          width: '100%',
          padding: '36px',
          boxShadow: '0 24px 64px -12px rgba(22, 42, 59, 0.25), 0 2px 6px rgba(22, 42, 59, 0.05)',
          position: 'relative',
          animation: 'kontagiModalContentScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="kontagi-close-btn"
          aria-label="Close modal"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 107, 61, 0.12)',
              color: '#FF6B3D',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(255, 107, 61, 0.25)'
            }}
          >
            <span>✦</span> PRO
          </span>

          <span
            style={{
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: '#162A3B',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}
          >
            Most Popular
          </span>
        </div>

        <h2
          id="upgrade-modal-title"
          style={{
            color: '#162A3B',
            fontSize: '1.65rem',
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
            margin: '0 0 10px 0'
          }}
        >
          {info.title}
        </h2>

        <p
          style={{
            color: '#5E7182',
            fontSize: '0.95rem',
            lineHeight: 1.55,
            margin: '0 0 24px 0',
            fontWeight: 500
          }}
        >
          {info.subtitle}
        </p>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div className="kontagi-feature-card">
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 900,
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162A3B', marginBottom: '2px' }}>
                Full Script Rewrite
              </div>
              <div style={{ fontSize: '12px', color: '#758796', lineHeight: 1.4 }}>
                Rewrite Hook, Body, and CTA with AI.
              </div>
            </div>
          </div>

          <div className="kontagi-feature-card">
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 900,
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162A3B', marginBottom: '2px' }}>
                Unlimited Optimizations
              </div>
              <div style={{ fontSize: '12px', color: '#758796', lineHeight: 1.4 }}>
                Generate unlimited improved versions.
              </div>
            </div>
          </div>

          <div className="kontagi-feature-card">
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 900,
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162A3B', marginBottom: '2px' }}>
                Advanced Tone Controls
              </div>
              <div style={{ fontSize: '12px', color: '#758796', lineHeight: 1.4 }}>
                Emotional, Sales, & Storytelling.
              </div>
            </div>
          </div>

          <div className="kontagi-feature-card">
            <div
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 900,
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#162A3B', marginBottom: '2px' }}>
                Multiple Variants
              </div>
              <div style={{ fontSize: '12px', color: '#758796', lineHeight: 1.4 }}>
                Generate multiple winning scripts.
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Callout */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E8E3DA',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#FF6B3D', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              KONTAGI PRO ACCESS
            </div>
            <div style={{ fontSize: '13px', color: '#5E7182', fontWeight: 500 }}>
              Cancel anytime • 7-day money-back guarantee
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#162A3B' }}>₹999</span>
              <span style={{ fontSize: '12px', color: '#758796', fontWeight: 600 }}>/month</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>
              or $19 USD / month
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={handleProceed} className="kontagi-upgrade-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Upgrade to Pro</span>
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: '#758796',
              fontSize: '13.5px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#162A3B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#758796')}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
