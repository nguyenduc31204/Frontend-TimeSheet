// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ requiredAction, requiredEntity }) => {
  const { user, hasPermission, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Nếu có yêu cầu quyền cụ thể (cả action và entity)
  if (requiredAction && requiredEntity && !hasPermission(requiredAction, requiredEntity)) {
    return <Navigate to="/unauthorized" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;