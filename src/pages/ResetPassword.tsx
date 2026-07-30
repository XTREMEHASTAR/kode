import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(password);
      showToast('Password successfully reset!', 'success');
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      editorialTitle={
        <>
          Security First.<br />
          <span style={{ color: '#FF6B3D' }}>Set Your New Key.</span>
        </>
      }
      editorialSubtitle="Choose a strong, unique password to keep your Kontagi workspace protected."
    >
      {isSuccess ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', border: '1px solid #BBF7D0' }}>
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Password updated!
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, lineHeight: 1.5 }}>
              Your password has been successfully reset. You can now sign in with your new credentials.
            </p>
          </div>

          <button
            type="button"
            className="kontagi-auth-btn-primary"
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px' }}
          >
            <span>Sign in to Workspace</span>
          </button>
        </div>
      ) : (
        <>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Reset your password
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, fontWeight: 500 }}>
              Enter your new password below. Must be at least 8 characters.
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
            {/* New Password */}
            <div className="kontagi-auth-input-group">
              <label className="kontagi-auth-label" htmlFor="reset-password">
                New Password
              </label>
              <div className="kontagi-auth-input-wrapper">
                <span className="kontagi-auth-icon-left">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="reset-password"
                  type={showPassword ? 'text' : 'password'}
                  className="kontagi-auth-input has-icon-left has-icon-right"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="kontagi-auth-icon-right-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.022 10.022 0 013.682-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.09-3.013a3 3 0 11-4.243-4.243M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="kontagi-auth-input-group">
              <label className="kontagi-auth-label" htmlFor="reset-confirm">
                Confirm New Password
              </label>
              <div className="kontagi-auth-input-wrapper">
                <span className="kontagi-auth-icon-left">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input
                  id="reset-confirm"
                  type={showPassword ? 'text' : 'password'}
                  className="kontagi-auth-input has-icon-left"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Reset Password</span>
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
