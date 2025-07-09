import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ requiredAction, requiredEntity }) => {
  const { user, hasPermission, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredAction && requiredEntity && !hasPermission(requiredAction, requiredEntity)) {
    return <Navigate to="/unauthorized" replace />; 
  }

  return <Outlet />;
};

export default ProtectedRoute;