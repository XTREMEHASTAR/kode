import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary, #090D16)',
          color: 'var(--text-primary, #FFFFFF)',
          gap: '16px'
        }}
      >
        <div 
          className="spinner" 
          style={{ 
            width: '32px', 
            height: '32px', 
            borderColor: 'rgba(59, 130, 246, 0.2)', 
            borderTopColor: '#3B82F6' 
          }} 
        />
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary, var(--text-muted))' }}>
          Restoring KONTAGI session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save intended destination so login can return user there
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  // Check admin role requirement
  if (requireAdmin && user?.role !== 'ADMIN') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#070B12',
          color: '#FFFFFF',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            padding: '36px',
            borderRadius: '16px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            403
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', color: '#FFFFFF' }}>
            403 Forbidden
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.6 }}>
            Access Restricted — Administrator credentials are required to view the Launch Command Center.
          </p>
          <a
            href="/script-intelligence"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Return to Script Intelligence
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

