import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/script-intelligence';

  const { showToast } = useApp();
  const { signIn, signInWithGoogle, signInWithApple, socialAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await signIn(email, password, rememberMe);
      showToast(`Welcome back, ${user.name || 'Creator'}!`, 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const performGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('📌 [Google OAuth Step 3] onSuccess fired. Google returned credential/tokenResponse:', tokenResponse);
      setIsLoading(true);
      setError('');
      try {
        const token = tokenResponse.access_token || (tokenResponse as any).credential;
        console.log('📌 [Google OAuth Step 4 & 5] Credential extracted. Calling signInWithGoogle()...');
        const user = await signInWithGoogle(token);
        console.log('📌 [Google OAuth Step 10] saveSession executed successfully for user:', user);
        showToast(`Welcome, ${user.name || 'Creator'}! Signed in with Google.`, 'success');
        console.log('📌 [Google OAuth Step 11] Redirect executed to target:', redirectTarget);
        navigate(redirectTarget, { replace: true });
      } catch (err: any) {
        console.error('❌ [Google OAuth Error] Step failed during Google authentication flow:', err);
        setError(err.message || 'Failed to authenticate with Google.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errResponse) => {
      console.error('❌ [Google OAuth Error] onError fired. Google Sign-In popup failed or closed:', errResponse);
      setError('Google Sign-In popup was closed or blocked.');
    },
  });

  const handleGoogleAuth = () => {
    console.log('📌 [Google OAuth Step 1 & 2] Popup opening / "Continue with Google" clicked...');
    try {
      performGoogleSignIn();
    } catch (e: any) {
      console.error('❌ [Google OAuth Error] Exception triggering performGoogleSignIn():', e);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      const appleToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
        sub: `apple_usr_${Date.now()}`,
        email: `apple_creator_${Math.floor(Math.random() * 1000)}@kontagi.ai`,
        exp: Math.floor(Date.now() / 1000) + 3600
      }))}.signature`;

      const user = await signInWithApple(appleToken, { name: { firstName: 'Apple', lastName: 'User' } });
      showToast(`Welcome, ${user.name || 'Creator'}! Signed in with Apple.`, 'success');
      navigate(redirectTarget, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Apple.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, fontWeight: 500 }}>
          Sign in to continue creating with Kontagi.
        </p>
      </div>

      {/* Alert Error */}
      {error && (
        <div className="kontagi-auth-alert kontagi-auth-alert-error">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Email Input */}
        <div className="kontagi-auth-input-group">
          <label className="kontagi-auth-label" htmlFor="login-email">
            Email address
          </label>
          <div className="kontagi-auth-input-wrapper">
            <span className="kontagi-auth-icon-left">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              id="login-email"
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

        {/* Password Input */}
        <div className="kontagi-auth-input-group">
          <div className="kontagi-auth-label">
            <label htmlFor="login-password">Password</label>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: '#FF6B3D', textDecoration: 'none', fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>
          <div className="kontagi-auth-input-wrapper">
            <span className="kontagi-auth-icon-left">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              id="login-password"
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
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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

        {/* Remember Me */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{ width: '18px', height: '18px', borderRadius: '5px', accentColor: '#FF6B3D', cursor: 'pointer' }}
          />
          <label htmlFor="remember-me" style={{ fontSize: '13.5px', color: '#162A3B', fontWeight: 500, cursor: 'pointer' }}>
            Remember me on this device
          </label>
        </div>

        {/* Primary Submit Button */}
        <button type="submit" disabled={isLoading} className="kontagi-auth-btn-primary">
          {isLoading ? (
            <>
              <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>

        {/* Social Login Divider */}
        <div className="kontagi-auth-divider">Or continue with</div>

        {/* Social Buttons */}
        <div className="kontagi-google-btn-container">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              console.log('📌 [Google OAuth Step 3] onSuccess fired with OIDC ID Token:', credentialResponse);
              if (credentialResponse.credential) {
                try {
                  setIsLoading(true);
                  const user = await signInWithGoogle(credentialResponse.credential);
                  console.log('📌 [Google OAuth Step 10] saveSession executed for user:', user);
                  showToast(`Welcome back, ${user.name || 'Creator'}!`, 'success');
                  navigate(redirectTarget, { replace: true });
                } catch (err: any) {
                  setError(err.message || 'Failed to authenticate with Google.');
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            onError={() => {
              console.error('❌ [Google OAuth Error] Google Sign-In failed or popup was closed');
              setError('Google Sign-In popup failed or was closed.');
            }}
            useOneTap={false}
            theme="outline"
            shape="rectangular"
            text="continue_with"
            width="400"
          />
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#5E7182' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#FF6B3D', fontWeight: 700, textDecoration: 'none' }}>
            Create account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
