import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotFoundPage } from '../../pages/NotFoundPage';

interface InternalRouteProps {
  children: React.ReactNode;
}

export const InternalRoute: React.FC<InternalRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  const isInternal = user?.role === 'INTERNAL' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isInternal) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};
