import React from 'react';
import { NotFoundPage } from '../../pages/NotFoundPage';

interface DevOnlyRouteProps {
  children: React.ReactNode;
}

export const DevOnlyRoute: React.FC<DevOnlyRouteProps> = ({ children }) => {
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';

  if (!isDev) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};
