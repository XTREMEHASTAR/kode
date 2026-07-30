import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';
import { freeTierService } from '../../services/freeTierService';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';
import { FreeTierUpgradeBanner } from '../../components/free-tier/FreeTierUpgradeBanner';

export const BillingSettings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [countdownStr, setCountdownStr] = useState<string>('00:00:00');

  const subscription = entitlementService.getSubscription(user);
  const isPro = (subscription.plan === 'pro' && subscription.status === 'active') || freeTierService.isProActive();

  const aiQuota = entitlementService.getUsageMetric(user, 'ai_improvement');
  
  const remainingQuota = isPro ? 99999 : freeTierService.getRemainingQuota();
  const totalAnalysisLimit = 3;
  const analysisRemaining = isPro ? 99999 : remainingQuota;

  const totalAiLimit = aiQuota.limit > 0 ? aiQuota.limit : 3;
  const aiRemaining = isPro ? 99999 : Math.max(0, totalAiLimit - aiQuota.used);

  // Live 1-Second Countdown Timer (05:18:24 format)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setCountdownStr(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
      <FreeTierSidebar currentPath="/settings/billing" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader />

        <main style={{ flex: 1, padding: '40px 32px 64px', maxWidth: '780px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
          
          {/* HEADER */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#162A3B', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Workspace
            </h1>
            <p style={{ fontSize: '15px', color: '#667085', margin: 0 }}>
              Manage your daily AI usage.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* CARD 1: CURRENT PLAN */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E3DA',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(22, 42, 59, 0.03)'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#667085', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  CURRENT PLAN
                </span>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#162A3B', margin: '4px 0 0 0' }}>
                  {isPro ? 'Pro' : 'Free'}
                </h2>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: isPro ? '#059669' : '#162A3B',
                backgroundColor: isPro ? 'rgba(16, 185, 129, 0.1)' : 'rgba(22, 42, 59, 0.06)',
                border: isPro ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(22, 42, 59, 0.12)',
                padding: '4px 12px',
                borderRadius: '9999px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                {isPro ? 'PRO' : 'FREE'}
              </span>
            </div>

            {/* CARD 2: TODAY'S USAGE */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E8E3DA',
                padding: '28px',
                boxShadow: '0 2px 8px rgba(22, 42, 59, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#162A3B', margin: 0 }}>
                  Today's Usage
                </h3>
                <div style={{ fontSize: '13px', color: '#667085', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Resets in</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#162A3B' }}>
                    {countdownStr}
                  </span>
                </div>
              </div>

              {/* Responsive 2-Box Usage Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                
                {/* Script Analysis Metric Box */}
                <div style={{
                  backgroundColor: '#FAF8F3',
                  border: '1px solid #E8E3DA',
                  borderRadius: '14px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#162A3B' }}>Script Analysis</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                      ACTIVE
                    </span>
                  </div>

                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#162A3B', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {isPro ? 'Unlimited' : `${analysisRemaining} / ${totalAnalysisLimit}`} <span style={{ fontSize: '13px', fontWeight: 600, color: '#667085' }}>Remaining</span>
                  </div>

                  {/* Visual Segmented Pills (3 Pills) */}
                  {!isPro && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                      {[1, 2, 3].map((seg) => {
                        const isAvailable = seg <= analysisRemaining;
                        return (
                          <div
                            key={seg}
                            style={{
                              flex: 1,
                              height: '8px',
                              borderRadius: '9999px',
                              backgroundColor: isAvailable ? '#162A3B' : 'rgba(22, 42, 59, 0.12)',
                              transition: 'all 300ms ease'
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  <div style={{ fontSize: '12px', color: '#667085' }}>
                    Hook retention & viral scoring
                  </div>
                </div>

                {/* AI Copilot Metric Box */}
                <div style={{
                  backgroundColor: '#FAF8F3',
                  border: '1px solid #E8E3DA',
                  borderRadius: '14px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#162A3B' }}>AI Copilot</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
                      ACTIVE
                    </span>
                  </div>

                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#162A3B', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    {isPro ? 'Unlimited' : `${aiRemaining} / ${totalAiLimit}`} <span style={{ fontSize: '13px', fontWeight: 600, color: '#667085' }}>Remaining</span>
                  </div>

                  {/* Visual Segmented Pills (3 Pills) */}
                  {!isPro && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                      {[1, 2, 3].map((seg) => {
                        const isAvailable = seg <= aiRemaining;
                        return (
                          <div
                            key={seg}
                            style={{
                              flex: 1,
                              height: '8px',
                              borderRadius: '9999px',
                              backgroundColor: isAvailable ? '#FF6B3D' : 'rgba(255, 107, 61, 0.2)',
                              transition: 'all 300ms ease'
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  <div style={{ fontSize: '12px', color: '#667085' }}>
                    Script improvement & rewrite queries
                  </div>
                </div>

              </div>
            </div>

            {/* CARD 3: MINIMAL PREMIUM PRO CTA BANNER */}
            <FreeTierUpgradeBanner />

          </div>

        </main>
      </div>
    </div>
  );
};
