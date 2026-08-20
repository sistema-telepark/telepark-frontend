import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { TokenService } from '../../services/token.service';

const ProtectedRoute = () => {
  const location = useLocation();

  if (!TokenService.getLocalAccessToken()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;