import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { freeTierService } from '../../services/freeTierService';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Real-time subscription state
  const sub = entitlementService.getSubscription(user);
  const isPro = (sub.plan === 'pro' && sub.status === 'active') || freeTierService.isProActive();

  // Billing Cycle Toggle (Monthly vs Annual)
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif", color: '#162A3B' }}>
      {/* Sidebar Navigation */}
      <FreeTierSidebar currentPath="/pricing" />

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Workspace Experience" />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            backgroundColor: '#162A3B',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ color: '#FF6B3D', fontWeight: 800 }}>✓</span>
            {toastMessage}
          </div>
        )}

        <main style={{ flex: 1, maxWidth: '1120px', width: '100%', margin: '0 auto', padding: '40px 32px 100px', boxSizing: 'border-box' }}>
          
          {/* Top Back Navigation */}
          <button
            type="button"
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/script-intelligence');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#667085',
              cursor: 'pointer',
              marginBottom: '32px',
              padding: 0
            }}
          >
            ← Back to Script Studio
          </button>

          {/* HERO */}
          <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '760px', margin: '0 auto 56px auto' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#162A3B', margin: '0 0 16px 0', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Create Better Content.<br />
              <span style={{ color: '#667085', fontWeight: 700 }}>Not More Content.</span>
            </h1>

            <p style={{ fontSize: '18px', color: '#667085', margin: 0, fontWeight: 400, lineHeight: 1.6 }}>
              Choose the Kontagi workspace that matches the way you create.
            </p>

            {/* Quiet Monthly / Annual Billing Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E8E3DA', borderRadius: '9999px', padding: '4px', marginTop: '32px', boxShadow: '0 2px 10px rgba(22, 42, 59, 0.03)' }}>
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: !isAnnual ? '#162A3B' : 'transparent',
                  color: !isAnnual ? '#FFFFFF' : '#667085',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: isAnnual ? '#162A3B' : 'transparent',
                  color: isAnnual ? '#FFFFFF' : '#667085',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Annual Billing
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.1)', color: '#FF6B3D' }}>
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* WORKSPACE CARDS (Free Active, Pro & Team Coming Soon) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* CARD 1: FREE WORKSPACE (ACTIVE TIER) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: !isPro ? '2px solid #162A3B' : '1px solid #E8E3DA',
                borderRadius: '20px',
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(22, 42, 59, 0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    FREE
                  </span>

                  <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', backgroundColor: 'rgba(22, 42, 59, 0.06)', color: '#162A3B' }}>
                    CURRENT WORKSPACE
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0' }}>
                  Starter Workspace
                </h2>

                <p style={{ fontSize: '14px', color: '#667085', margin: '0 0 28px 0', lineHeight: 1.6 }}>
                  Perfect for getting started. Explore Kontagi AI script analysis.
                </p>

                <div style={{ fontSize: '36px', fontWeight: 800, color: '#162A3B', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                  $0 <span style={{ fontSize: '14px', fontWeight: 500, color: '#98A2B3' }}>/ forever</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate('/script-intelligence');
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(22, 42, 59, 0.05)',
                  border: '1.5px solid #E8E3DA',
                  color: '#162A3B',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Use Workspace →
              </button>
            </div>

            {/* CARD 2: PRO WORKSPACE (COMING SOON) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #FF6B3D',
                borderRadius: '20px',
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 8px 30px rgba(255, 107, 61, 0.1)',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF6B3D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    PRO
                  </span>

                  <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', backgroundColor: 'rgba(255, 107, 61, 0.12)', color: '#FF6B3D', border: '1px solid rgba(255, 107, 61, 0.3)' }}>
                    COMING SOON
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0' }}>
                  Creator Pro Workspace
                </h2>

                <p style={{ fontSize: '14px', color: '#667085', margin: '0 0 28px 0', lineHeight: 1.6 }}>
                  Built for creators publishing every day. Unlimited AI intelligence.
                </p>

                <div style={{ fontSize: '32px', fontWeight: 800, color: '#FF6B3D', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                  Coming Soon <span style={{ fontSize: '13px', fontWeight: 500, color: '#98A2B3' }}>/ launching soon</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Creator Pro Workspace is coming soon!')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#FF6B3D',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: '0 4px 14px rgba(255, 107, 61, 0.25)'
                }}
              >
                Coming Soon
              </button>
            </div>

            {/* CARD 3: TEAM WORKSPACE (COMING SOON) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E3DA',
                borderRadius: '20px',
                padding: '40px 36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(22, 42, 59, 0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    TEAM
                  </span>

                  <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '3px 10px', borderRadius: '9999px', backgroundColor: 'rgba(22, 42, 59, 0.06)', color: '#667085', border: '1px solid rgba(22, 42, 59, 0.12)' }}>
                    COMING SOON
                  </span>
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0' }}>
                  Agency & Brand Workspace
                </h2>

                <p style={{ fontSize: '14px', color: '#667085', margin: '0 0 28px 0', lineHeight: 1.6 }}>
                  Built for agencies, production studios, and multi-creator teams.
                </p>

                <div style={{ fontSize: '32px', fontWeight: 800, color: '#162A3B', marginBottom: '32px', letterSpacing: '-0.02em' }}>
                  Coming Soon <span style={{ fontSize: '13px', fontWeight: 500, color: '#98A2B3' }}>/ multi-seat</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast('Agency & Brand Workspace is coming soon!')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: '#162A3B',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Coming Soon
              </button>
            </div>

          </div>

          {/* Generous 100px Bottom Whitespace - End of Page */}

        </main>
      </div>
    </div>
  );
};
