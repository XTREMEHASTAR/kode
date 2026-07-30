import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuraLogo } from './free-tier/AuraBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
  editorialTitle?: React.ReactNode;
  editorialSubtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  editorialTitle,
  editorialSubtitle
}) => {
  const navigate = useNavigate();

  return (
    <div className="kontagi-auth-root">
      {/* LEFT PANEL (40% Desktop Split) */}
      <div className="kontagi-auth-left">
        <div>
          {/* Top Brand Logo */}
          <div 
            className="kontagi-auth-brand-row"
            onClick={() => navigate('/script-intelligence')}
            title="Go to Kontagi Workspace"
          >
            <AuraLogo size="lg" darkBackground={false} showText={true} />
          </div>

          {/* Editorial Headline Section */}
          <div className="kontagi-auth-headline-box">
            <h1 className="kontagi-auth-editorial-title">
              {editorialTitle || (
                <>
                  Create Better Content.<br />
                  <span style={{ color: '#FF6B3D' }}>Not More Content.</span>
                </>
              )}
            </h1>
            <p className="kontagi-auth-editorial-subtitle">
              {editorialSubtitle || 'Kontagi helps creators understand why content performs before they publish.'}
            </p>
          </div>

          {/* Interactive Floating Product Preview Cards */}
          <div className="kontagi-preview-container">
            {/* Card 1: Hook Performance */}
            <div className="kontagi-float-card kontagi-float-card-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#162A3B', backgroundColor: '#FAF8F3', padding: '4px 10px', borderRadius: '6px', border: '1px solid #E8E3DA' }}>
                  ⚡ Hook Performance
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                  88 / 100
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#162A3B', fontWeight: 600, margin: '0 0 8px 0', lineHeight: 1.4 }}>
                "Stop scrolling if you're creating content without checking this single metric."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#FF6B3D', fontWeight: 700 }}>
                <span>✨ +16 pts AI Boost</span>
                <span>•</span>
                <span>Direct Pattern Interrupt</span>
              </div>
            </div>

            {/* Card 2: AI Rewrite Preview */}
            <div className="kontagi-float-card kontagi-float-card-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FF6B3D', backgroundColor: '#FFF8F5', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(255, 107, 61, 0.2)' }}>
                  ✨ AI Curiosity Hook
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                  Option A
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#162A3B', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                "The hidden pattern that keeps 90% of viewers watching past 15 seconds..."
              </p>
            </div>

            {/* Card 3: Retention Curve */}
            <div className="kontagi-float-card kontagi-float-card-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#162A3B' }}>
                  📈 Projected Retention
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#162A3B' }}>
                  84% Avg
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '84%', height: '100%', backgroundColor: '#FF6B3D', borderRadius: '3px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Version Links */}
        <div className="kontagi-auth-left-footer">
          <Link to="/privacy">Privacy</Link>
          <span>•</span>
          <Link to="/terms">Terms</Link>
          <span>•</span>
          <Link to="/support">Support</Link>
          <span>•</span>
          <span>v2.4.0</span>
        </div>
      </div>

      {/* RIGHT PANEL (60% Desktop Split) */}
      <div className="kontagi-auth-right">
        <div className="kontagi-auth-form-card">
          {children}
        </div>
      </div>
    </div>
  );
};
