import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);
      showToast(res.message, 'success');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      editorialTitle={
        <>
          Account Recovery.<br />
          <span style={{ color: '#FF6B3D' }}>Safe & Seamless.</span>
        </>
      }
      editorialSubtitle="Reset your password securely to regain access to your Kontagi workspace."
    >
      {isSubmitted ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid #BBF7D0' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Check your inbox
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, lineHeight: 1.5 }}>
              We've sent a password reset link to <strong style={{ color: '#162A3B' }}>{email}</strong>. Check your spam folder if you don't see it within a few minutes.
            </p>
          </div>

          <button
            type="button"
            className="kontagi-auth-btn-primary"
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px' }}
          >
            <span>Back to Sign in</span>
          </button>
        </div>
      ) : (
        <>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Forgot your password?
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, fontWeight: 500 }}>
              Enter your email address and we'll send a secure reset link.
            </p>
          </div>

          {error && (
            <div className="kontagi-auth-alert kontagi-auth-alert-error">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="kontagi-auth-input-group">
              <label className="kontagi-auth-label" htmlFor="forgot-email">
                Email address
              </label>
              <div className="kontagi-auth-input-wrapper">
                <span className="kontagi-auth-icon-left">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  className="kontagi-auth-input has-icon-left"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="kontagi-auth-btn-primary">
              {isLoading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                  </svg>
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '14px' }}>
              <Link to="/login" style={{ color: '#FF6B3D', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Sign in</span>
              </Link>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};
