import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { AuthLayout } from '../components/AuthLayout';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
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

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const user = await signUp(name, email, password);
      showToast(`Welcome to Kontagi, ${user.name}! Workspace created.`, 'success');
      navigate('/script-intelligence');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
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
        showToast(`Welcome to Kontagi, ${user.name}! Signed in with Google.`, 'success');
        console.log('📌 [Google OAuth Step 11] Redirect executed to /script-intelligence');
        navigate('/script-intelligence');
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
    console.log('📌 [Google OAuth Step 1 & 2] Popup opening / "Sign up with Google" clicked...');
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
      showToast(`Welcome to Kontagi, ${user.name}! Signed in with Apple.`, 'success');
      navigate('/script-intelligence');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Apple.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      editorialTitle={
        <>
          Predict Audience<br />
          <span style={{ color: '#FF6B3D' }}>Retention Instantly.</span>
        </>
      }
      editorialSubtitle="Join creators using AI hook intelligence to boost views before filming."
    >
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
          Create your Kontagi Workspace
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, fontWeight: 500 }}>
          Start analyzing scripts & hooks in under 30 seconds.
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Full Name */}
        <div className="kontagi-auth-input-group">
          <label className="kontagi-auth-label" htmlFor="signup-name">
            Full Name
          </label>
          <div className="kontagi-auth-input-wrapper">
            <span className="kontagi-auth-icon-left">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              id="signup-name"
              type="text"
              className="kontagi-auth-input has-icon-left"
              placeholder="Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="kontagi-auth-input-group">
          <label className="kontagi-auth-label" htmlFor="signup-email">
            Email address
          </label>
          <div className="kontagi-auth-input-wrapper">
            <span className="kontagi-auth-icon-left">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              id="signup-email"
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

        {/* Password Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="kontagi-auth-input-group">
            <label className="kontagi-auth-label" htmlFor="signup-password">
              Password
            </label>
            <div className="kontagi-auth-input-wrapper">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="kontagi-auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="kontagi-auth-input-group">
            <label className="kontagi-auth-label" htmlFor="signup-confirm-password">
              Confirm Password
            </label>
            <div className="kontagi-auth-input-wrapper">
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="kontagi-auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '2px' }}>
          <input
            id="agree-terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ width: '18px', height: '18px', borderRadius: '5px', accentColor: '#FF6B3D', cursor: 'pointer', marginTop: '2px' }}
          />
          <label htmlFor="agree-terms" style={{ fontSize: '13px', color: '#5E7182', lineHeight: 1.4, cursor: 'pointer' }}>
            I agree to Kontagi's{' '}
            <Link to="/terms" style={{ color: '#162A3B', fontWeight: 600, textDecoration: 'underline' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" style={{ color: '#162A3B', fontWeight: 600, textDecoration: 'underline' }}>
              Privacy Policy
            </Link>.
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
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Workspace</span>
          )}
        </button>

        {/* Social Login Divider */}
        <div className="kontagi-auth-divider">Or sign up with</div>

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
                  showToast(`Welcome to Kontagi, ${user.name || 'Creator'}!`, 'success');
                  navigate('/script-intelligence');
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
            text="signup_with"
            width="400"
          />
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#5E7182' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF6B3D', fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
