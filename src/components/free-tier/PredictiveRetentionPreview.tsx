import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpgradeModal } from '../common/UpgradeModal';

export const PredictiveRetentionPreview: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#FCF9F3',
        borderRadius: '16px',
        border: '1px solid rgba(23, 50, 71, 0.12)',
        padding: '36px 28px',
        maxWidth: '960px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(23, 50, 71, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Editorial Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: '#E5C88E',
            color: '#173247',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}
        >
          PREDICTIVE RETENTION
        </div>

        <h2
          style={{
            color: '#173247',
            fontSize: '24px',
            fontWeight: 800,
            margin: '0 0 10px 0',
            fontFamily: 'Manrope, sans-serif',
            letterSpacing: '-0.02em'
          }}
        >
          See where viewers are likely to drop off before you publish.
        </h2>

        <p
          style={{
            color: '#556B7D',
            fontSize: '14.5px',
            lineHeight: 1.55,
            maxWidth: '640px',
            margin: '0 auto'
          }}
        >
          Visualize predicted second-by-second retention, identify high-risk drop-off moments, and understand which parts of your creative may lose attention.
        </p>
      </div>

      {/* Blurred Interactive Retention Curve Preview */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#F5EEE3',
          borderRadius: '12px',
          border: '1px solid rgba(23, 50, 71, 0.12)',
          padding: '28px 24px 20px 24px',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}
      >
        {/* SVG Graph Curve (Blurred) */}
        <div style={{ filter: 'blur(5px)', opacity: 0.65, userSelect: 'none', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#173247', fontWeight: 700, marginBottom: '8px' }}>
            <span>100% RETENTION</span>
            <span>PREDICTED CHURN CURVE</span>
          </div>

          <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(23,50,71,0.08)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(23,50,71,0.08)" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(23,50,71,0.08)" strokeDasharray="4 4" />

            {/* Retention curve path */}
            <path
              d="M 0 10 C 60 10, 80 65, 120 70 C 180 75, 220 50, 300 55 C 380 60, 420 110, 480 115 C 540 120, 580 135, 600 140"
              stroke="#F13A1E"
              strokeWidth="3.5"
              fill="none"
            />
            {/* Area fill */}
            <path
              d="M 0 10 C 60 10, 80 65, 120 70 C 180 75, 220 50, 300 55 C 380 60, 420 110, 480 115 C 540 120, 580 135, 600 140 L 600 160 L 0 160 Z"
              fill="url(#retentionGradient)"
              opacity="0.25"
            />
            <defs>
              <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F13A1E" />
                <stop offset="100%" stopColor="#FCF9F3" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time axis */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#556B7D', marginTop: '12px', fontWeight: 600 }}>
            <span>0s</span>
            <span>3s (Hook)</span>
            <span>8s</span>
            <span>15s (Body)</span>
            <span>30s (CTA)</span>
          </div>

          {/* Mock Markers */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <span style={{ backgroundColor: 'rgba(241, 58, 30, 0.15)', color: '#F13A1E', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>⚠️ HOOK DROP</span>
            <span style={{ backgroundColor: 'rgba(243, 106, 36, 0.15)', color: '#F36A24', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>⚡ PACING RISK</span>
            <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>✨ HIGH RETENTION</span>
            <span style={{ backgroundColor: 'rgba(241, 58, 30, 0.15)', color: '#F13A1E', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>🎯 CTA DROP</span>
          </div>
        </div>

        {/* Centered Premium Overlay Card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(252, 249, 243, 0.78)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: '#FCF9F3',
              border: '1.5px solid #173247',
              borderRadius: '14px',
              padding: '28px 32px',
              textAlign: 'center',
              maxWidth: '400px',
              boxShadow: '0 12px 32px rgba(23, 50, 71, 0.15)'
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '3px 10px',
                borderRadius: '12px',
                backgroundColor: '#E5C88E',
                color: '#173247',
                fontSize: '10.5px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}
            >
              PRO FEATURE
            </div>

            <h4
              style={{
                color: '#173247',
                fontSize: '18px',
                fontWeight: 800,
                margin: '0 0 6px 0',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              Predictive Retention Map
            </h4>

            <p
              style={{
                color: '#556B7D',
                fontSize: '13px',
                lineHeight: 1.45,
                margin: '0 0 20px 0'
              }}
            >
              Understand where attention may rise or fall throughout your content.
            </p>

            <button
              onClick={() => navigate('/pricing?source=retention-map')}
              style={{
                width: '100%',
                padding: '11px 18px',
                borderRadius: '8px',
                backgroundColor: '#F13A1E',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(241, 58, 30, 0.3)',
                transition: 'all 0.2s ease',
                marginBottom: '10px'
              }}
            >
              Unlock with Pro
            </button>

            <button
              onClick={() => navigate('/pricing?source=retention-map')}
              style={{
                background: 'none',
                border: 'none',
                color: '#173247',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              View plans →
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <UpgradeModal
          source="retention_map"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
