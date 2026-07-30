import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotFoundPage } from '../../pages/NotFoundPage';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    const redirectUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  if (!isAdmin) {
    // Hide admin route existence from non-admin users
    return <NotFoundPage />;
  }

  return <>{children}</>;
};
