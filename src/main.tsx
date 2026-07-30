import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/design-system.css';
import './styles/global.css';
import './styles/free-tier.css';
import './styles/aura-theme.css';
import './styles/kontagi-auth.css';

if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('🚨 [Global window.onerror Captured]:', { message, source, lineno, colno, error });
  };
  window.onunhandledrejection = (event) => {
    console.error('🚨 [Global window.onunhandledrejection Captured]:', { reason: event.reason });
  };
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '880591406455-9kiamavjl9aavikffvjd6913j77a32gh.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
