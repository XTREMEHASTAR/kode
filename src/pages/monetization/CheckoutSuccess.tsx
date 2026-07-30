import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';

export const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Refresh subscription cache
    if (user) {
      const activeSub = entitlementService.getSubscription(user);
      entitlementService.setSubscription(user, {
        ...activeSub,
        plan: 'pro',
        status: 'active'
      });
    }
  }, [user]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
      <FreeTierSidebar currentPath="/checkout/success" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Payment Success" />

        <main style={{ flex: 1, padding: '48px 24px', maxWidth: '640px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '2px solid #162A3B',
              padding: '40px 32px',
              boxShadow: '0 12px 36px rgba(22, 42, 59, 0.12)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Geometric Orbit Animation Circle */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '2px solid #22C55E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: '#22C55E',
                margin: '0 auto 20px auto',
                boxShadow: '0 0 0 8px rgba(34, 197, 94, 0.08)'
              }}
            >
              ✓
            </div>

            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                backgroundColor: '#D4A24C',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}
            >
              YOU'RE PRO
            </div>

            <h1
              style={{
                color: '#162A3B',
                fontSize: '26px',
                fontWeight: 800,
                margin: '0 0 10px 0',
                letterSpacing: '-0.02em'
              }}
            >
              KONTAGI Pro is now active.
            </h1>

            <p
              style={{
                color: '#667085',
                fontSize: '15px',
                lineHeight: 1.5,
                margin: '0 0 28px 0'
              }}
            >
              You’ve unlocked deeper creative intelligence for your content.
            </p>

            {/* Unlocked Features Summary */}
            <div
              style={{
                backgroundColor: '#FAF8F3',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'left',
                marginBottom: '32px',
                border: '1px solid #E8E3DA'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#162A3B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                UNLOCKED PRO FEATURES
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {[
                  'Predictive Retention Map',
                  'Full-Script AI Rewrites',
                  'Unlimited Daily Analyses',
                  'Export Full Reports (.txt / .json)',
                  'Advanced Strategy Guidance',
                  'Priority AI Processing'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#162A3B', fontWeight: 600 }}>
                    <span style={{ color: '#FF6B3D', fontWeight: 800 }}>✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => navigate('/script-intelligence')}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#FF6B3D',
                  color: '#FFFFFF',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(255, 107, 61, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                Explore Pro Features →
              </button>

              <button
                onClick={() => navigate('/script-library')}
                style={{
                  width: '100%',
                  padding: '11px 20px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#162A3B',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  border: '1px solid #E8E3DA',
                  cursor: 'pointer'
                }}
              >
                View My Script Library
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
