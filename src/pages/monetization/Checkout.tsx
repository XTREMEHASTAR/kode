import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../services/paymentService';
import { BillingInterval } from '../../types/subscription';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const interval = (searchParams.get('interval') || 'monthly') as BillingInterval;
  const source = searchParams.get('source') || 'checkout';

  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const price = interval === 'monthly' ? 1999 : 18999;
  const tax = Math.round(price * 0.18); // 18% GST / VAT
  const total = price + tax;

  const handlePayment = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/checkout?plan=${plan}&interval=${interval}&source=${source}`)}`);
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Step 1: Create session
      const session = await paymentService.createCheckoutSession(user, {
        plan: 'pro',
        interval,
        source
      });

      // Step 2: Verify payment
      const res = await paymentService.verifyPayment(user, {
        sessionId: session.sessionId,
        paymentId: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        provider: session.provider as any
      });

      if (res.success) {
        navigate('/checkout/success');
      } else {
        setErrorMsg(res.error || 'Payment verification failed.');
        navigate('/checkout/failed');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'An unexpected error occurred during payment processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
      <FreeTierSidebar currentPath="/checkout" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Secure Checkout" />

        <main style={{ flex: 1, padding: '36px 28px', maxWidth: '1000px', width: '100%', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                background: 'none',
                border: 'none',
                color: '#162A3B',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Back to Pricing
            </button>
          </div>

          {/* 2-Column Checkout Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* LEFT COLUMN: Plan Summary */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E8E3DA', padding: '32px', boxShadow: '0 4px 16px rgba(22, 42, 59, 0.04)' }}>
              <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '12px', backgroundColor: '#D4A24C', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '12px' }}>
                SELECTED PLAN
              </div>

              <h2 style={{ color: '#162A3B', fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0' }}>
                KONTAGI Pro
              </h2>

              <p style={{ color: '#667085', fontSize: '14px', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                Full access to predictive retention maps, unlimited AI script optimization, and custom report exports.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #E8E3DA', paddingTop: '20px' }}>
                {[
                  'Predictive Retention Map (Second-by-Second)',
                  'Full-Script AI Rewrites & Optimization',
                  'Unlimited Daily Analyses & AI Copilot',
                  'Export Full Analysis Reports (.txt / .json)',
                  'Priority AI Processing Queue',
                  'Cancel Anytime with 1-click'
                ].map((feat, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#162A3B' }}>
                    <span style={{ color: '#FF6B3D', fontWeight: 800 }}>✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '2px solid #162A3B', padding: '32px', boxShadow: '0 8px 24px rgba(22, 42, 59, 0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ color: '#162A3B', fontSize: '18px', fontWeight: 800, margin: '0 0 20px 0', borderBottom: '1px solid #E8E3DA', paddingBottom: '12px' }}>
                  Order Summary
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#162A3B', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>KONTAGI Pro ({interval === 'monthly' ? 'Monthly' : 'Yearly'})</span>
                    <span style={{ fontWeight: 700 }}>₹{price.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#667085' }}>
                    <span>Tax (18% GST / VAT)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 800, color: '#162A3B', borderTop: '2px solid #162A3B', paddingTop: '16px', marginTop: '8px' }}>
                    <span>Total Due Today</span>
                    <span style={{ color: '#FF6B3D' }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
                    ⚠️ {errorMsg}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#FF6B3D',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 800,
                    border: 'none',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    boxShadow: '0 4px 16px rgba(255, 107, 61, 0.3)',
                    transition: 'all 0.2s ease',
                    marginBottom: '16px'
                  }}
                >
                  {isProcessing ? 'Confirming Payment...' : 'Continue to Secure Payment 🔒'}
                </button>

                <p style={{ color: '#667085', fontSize: '11.5px', textAlign: 'center', lineHeight: 1.4, margin: 0 }}>
                  256-bit encrypted checkout. By confirming, you agree to KONTAGI’s Terms of Service. You can cancel your subscription at any time from your Billing Settings.
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
