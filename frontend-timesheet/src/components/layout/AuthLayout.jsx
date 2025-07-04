// src/components/layout/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Outlet sẽ là nơi LoginPage, RegisterPage... được render */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;