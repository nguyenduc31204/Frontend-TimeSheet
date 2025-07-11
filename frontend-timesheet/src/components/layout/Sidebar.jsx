
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLayout } from '../../contexts/LayoutContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiClipboard, FiCheckSquare, FiBriefcase, FiUsers, FiShield,
  FiSettings, FiLogOut, FiArchive, FiDollarSign, FiActivity
} from 'react-icons/fi';

const menuItems = [
  {
    section: 'Overview',
    items: [
      // Dashboard không yêu cầu quyền cụ thể, ai cũng thấy
      { name: 'Dashboard', icon: <FiHome />, path: '/' }, 
    ],
  },
  {
    section: 'Business',
    items: [
      // Giả sử tên permission_type_name trong DB là 'timesheet' và 'expense_report'
      { name: 'Timesheet', icon: <FiClipboard />, path: '/timesheets', requiredAction: '', requiredEntity: 'timesheet' },
      { name: 'Expense report', icon: <FiDollarSign />, path: '/expenses', requiredAction: '', requiredEntity: 'expense_report' },
    ],
  },
  {
    section: 'Approve',
    items: [
       // Giả sử có quyền Review trên 'timesheet' để vào trang này
      { name: 'Request pending', icon: <FiCheckSquare />, path: '/manager/approvals', requiredAction: 'Review', requiredEntity: 'timesheet' },
    ],
  },
  {
    section: 'General Management',
    items: [
      { name: 'Project', icon: <FiBriefcase />, path: '/projects', requiredAction: '', requiredEntity: 'project' },
      { name: 'Department', icon: <FiUsers />, path: '/departments', requiredAction: '', requiredEntity: 'department' },
      { name: 'Cost category', icon: <FiArchive />, path: '/categories', requiredAction: '', requiredEntity: 'category' },
  
      
    ],
  },
  {
    section: 'System Administration',
    items: [
      { name: 'Users', icon: <FiUsers />, path: '/admin/users', requiredAction: 'manage', requiredEntity: 'user' },
      { name: 'Roles and Permissions', icon: <FiShield />, path: '/admin/roles', requiredAction: 'manage', requiredEntity: 'role' },
      { name: 'Activity history', icon: <FiActivity />, path: '/admin/logs', requiredAction: 'View', requiredEntity: 'log' },
    ],
  },
];


const SidebarContent = () => {
  const { hasPermission } = useAuth();

  return (
    <div className="flex flex-col h-full">
        <div className="h-16 flex-shrink-0 flex items-center px-6">
            <Link to="/" className="text-2xl font-bold text-white">
                TimeApp
            </Link>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-3">
            {menuItems.map((section) => {
                const visibleItems = section.items.filter(item => 
                    !item.requiredAction || hasPermission(item.requiredAction, item.requiredEntity)
                );
                
                if (visibleItems.length === 0) return null;
                
                return (
                    <div key={section.section}>
                        <h3 className="px-3 pt-3 pb-1 text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                            {section.section}
                        </h3>
                        <div className="mt-1 space-y-1">
                            {visibleItems.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                );
            })}
        </nav>
        <div className="px-4 py-3 mt-auto border-t border-indigo-500/30 flex-shrink-0">
             <NavLink to="/account/settings" className={({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors w-full mb-1 ${isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}>
                <FiSettings className="mr-3 text-lg" />
                Settings
            </NavLink>
             <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-indigo-100 hover:bg-indigo-500 hover:text-white w-full">
                <FiLogOut className="mr-3 text-lg" />
                Logout
            </a>
        </div>
    </div>
  );
};

export const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useLayout();

  return (
    <>
      {/* Sidebar cho Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 bg-indigo-600">
        <SidebarContent />
      </aside>

      {/* Sidebar cho Mobile (trượt ra) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-64 bg-indigo-600 z-40 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;