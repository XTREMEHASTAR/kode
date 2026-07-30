import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FreeTierHeader } from '../../components/free-tier/FreeTierHeader';
import { FreeTierSidebar } from '../../components/free-tier/FreeTierSidebar';

export const CheckoutFailed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F3', fontFamily: "'Satoshi', 'General Sans', sans-serif" }}>
      <FreeTierSidebar currentPath="/checkout/failed" />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <FreeTierHeader title="Payment Error" />

        <main style={{ flex: 1, padding: '48px 24px', maxWidth: '540px', width: '100%', margin: '0 auto', textAlign: 'center' }}>
          
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E8E3DA',
              padding: '40px 32px',
              boxShadow: '0 8px 24px rgba(22, 42, 59, 0.06)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1.5px solid #EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                color: '#EF4444',
                margin: '0 auto 20px auto'
              }}
            >
              ✕
            </div>

            <h1
              style={{
                color: '#162A3B',
                fontSize: '22px',
                fontWeight: 800,
                margin: '0 0 10px 0'
              }}
            >
              Payment Couldn't Be Completed
            </h1>

            <p
              style={{
                color: '#667085',
                fontSize: '14.5px',
                lineHeight: 1.5,
                margin: '0 0 28px 0'
              }}
            >
              Your account has not been charged. Please try again or select another payment method.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => navigate('/checkout?plan=pro')}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#FF6B3D',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>

              <button
                onClick={() => navigate('/pricing')}
                style={{
                  width: '100%',
                  padding: '11px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  color: '#162A3B',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  border: '1px solid #E8E3DA',
                  cursor: 'pointer'
                }}
              >
                Choose Another Plan
              </button>

              <button
                onClick={() => navigate('/script-intelligence')}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#556B7D',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Return to KONTAGI
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};
