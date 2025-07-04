// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Import Outlet
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LayoutProvider } from '../../contexts/LayoutContext';

const MainLayout = () => {
  return (
    <LayoutProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 lg:ml-64">
          <Navbar />
          <main className="p-4 sm:p-6 lg:p-8">
            {/* Outlet sẽ là nơi các trang con (Dashboard, Approvals...) được render */}
            <Outlet /> 
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
};

export default MainLayout;