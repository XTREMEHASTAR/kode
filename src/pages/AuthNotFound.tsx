import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';

export const AuthNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout
      editorialTitle={
        <>
          Page Not Found.<br />
          <span style={{ color: '#FF6B3D' }}>Let's Get You Back.</span>
        </>
      }
      editorialSubtitle="The page you were looking for doesn't exist or has moved."
    >
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#FF6B3D', lineHeight: 1 }}>
          404
        </div>
        
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#162A3B', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
            Auth Page Not Found
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#5E7182', margin: 0, lineHeight: 1.5 }}>
            The authentication URL you entered could not be located.
          </p>
        </div>

        <button
          type="button"
          className="kontagi-auth-btn-primary"
          onClick={() => navigate('/login')}
        >
          <span>Return to Sign In</span>
        </button>
      </div>
    </AuthLayout>
  );
};
