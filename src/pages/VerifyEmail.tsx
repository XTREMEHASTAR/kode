import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useApp();

  const email = (location.state as any)?.email || localStorage.getItem('kontagi_user_email') || 'you@example.com';

  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = () => {
    if (!canResend) return;
    showToast('Verification email resent successfully.', 'success');
    setResendTimer(45);
    setCanResend(false);
  };

  const handleVerifyNow = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('kontagi_auth', 'true');
      showToast('Email verified! Welcome to Kontagi.', 'success');
      setIsVerified(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      editorialTitle={
        <>
          Verify Email.<br />
          <span style={{ color: '#FF6B3D' }}>Unlock Your Workspace.</span>
        </>
      }
      editorialSubtitle="We verify every account to maintain peak engine accuracy for our creator community."
    >
      {isVerified ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid #BBF7D0' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Email verified!
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, lineHeight: 1.5 }}>
              Your account is fully activated. You can now start scoring hooks and analyzing scripts.
            </p>
          </div>

          <button
            type="button"
            className="kontagi-auth-btn-primary"
            onClick={() => navigate('/script-intelligence')}
            style={{ marginTop: '10px' }}
          >
            <span>Enter Kontagi Studio</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FFF8F5', color: '#FF6B3D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid rgba(255, 107, 61, 0.25)' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: '0 0 6px 0', lineHeight: 1.5 }}>
              We've sent a verification link to:
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#162A3B', margin: 0 }}>
              {email}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              className="kontagi-auth-btn-primary"
              onClick={handleVerifyNow}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                  </svg>
                  <span>Verifying Account...</span>
                </>
              ) : (
                <span>Verify Email & Continue</span>
              )}
            </button>

            <button
              type="button"
              className="kontagi-auth-btn-social"
              onClick={handleResend}
              disabled={!canResend || isLoading}
              style={{ width: '100%' }}
            >
              {canResend ? (
                <span>Resend verification link</span>
              ) : (
                <span>Resend link in {resendTimer}s</span>
              )}
            </button>
          </div>

          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            <Link to="/login" style={{ color: '#FF6B3D', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Sign in</span>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
