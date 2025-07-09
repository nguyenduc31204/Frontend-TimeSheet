import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import NotificationBell from '../features/notifications/NotificationBell';

export const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    console.log('user', user)
    const { toggleSidebar, isSidebarOpen } = useLayout();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); 
        navigate('/login'); 
    };

    const navLinkClass = "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100";

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex items-center md:hidden mr-2">
                             <button
                                onClick={toggleSidebar}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                            </button>
                        </div>
                        <Link to="/" className="text-xl font-bold text-indigo-600">
                            TimesheetApp
                        </Link>
                    </div>

                    {isAuthenticated && (
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/" className={({ isActive }) => navLinkClass + (isActive ? ' bg-indigo-50 text-indigo-700 font-semibold' : '')}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/manager/approvals" className={({ isActive }) => navLinkClass + (isActive ? ' bg-indigo-50 text-indigo-700 font-semibold' : '')}>
                                    Approvals
                                </NavLink>
                            </div>
                        </div>
                    )}

                    <div className="hidden md:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                <NotificationBell />
                                <span className="text-sm text-gray-600">Welcome, {user.user_name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <FiLogOut />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className={navLinkClass}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;