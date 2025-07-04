import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '../../contexts/LayoutContext';

const useAuth = () => {
  // Giả sử người dùng đã đăng nhập. Nếu chưa, bạn có thể trả về { user: null }
  const user = {
    name: 'Nguyễn Văn An',
    avatarUrl: `https://i.pravatar.cc/150?u=nguyenvanan`,
  };

  const logout = () => {
    console.log('User logged out');
    // Logic đăng xuất thật sẽ ở đây
    alert('Bạn đã đăng xuất!');
  };

  return { user, logout };
};
// ----------------------------

export const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toggleSidebar, isSidebarOpen } = useLayout();

  const activeLinkStyle = {
    backgroundColor: '#EEF2FF', // bg-indigo-50
    color: '#4338CA',           // text-indigo-700
    fontWeight: '600'
  };

  const navLinkClass = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Tên ứng dụng */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              TimesheetApp
            </Link>
          </div>

          {/* Menu trên Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) => navLinkClass + (isActive ? ' bg-indigo-50 text-indigo-700 font-semibold' : '')}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/manager/approvals"
                className={({ isActive }) => navLinkClass + (isActive ? ' bg-indigo-50 text-indigo-700 font-semibold' : '')}
              >
                Approvals
              </NavLink>
            </div>
          </div>

          {/* Thông tin người dùng trên Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <img className="h-8 w-8 rounded-full" src={user.avatarUrl} alt={user.name} />
            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <FiLogOut />
            </button>
          </div>

          {/* Nút Hamburger trên Mobile */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      
    </nav>
  );
};

export default Navbar;