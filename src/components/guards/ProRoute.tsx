import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { entitlementService } from '../../services/entitlementService';

interface ProRouteProps {
  children: React.ReactNode;
}

export const ProRoute: React.FC<ProRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  const sub = entitlementService.getSubscription(user);
  const isPro = sub?.plan === 'pro' || sub?.status === 'active' || user?.plan === 'pro' || user?.role === 'PRO' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isPro) {
    return <Navigate to="/pricing?required=pro" replace />;
  }

  return <>{children}</>;
};
