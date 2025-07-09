import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { FiBell } from 'react-icons/fi'; 
import { motion, AnimatePresence } from 'framer-motion';
import { getUnreadNotifications, markNotificationAsRead } from '../../../api/timesheetService';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);
    
    // Polling logic
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const data = await getUnreadNotifications(user.id);
            setNotifications(data);
        };

        fetchNotifications();
        const intervalId = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
        return () => clearInterval(intervalId);
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100">
                <FiBell />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-20"
                    >
                        <div className="p-3 font-semibold text-sm border-b">Notifications</div>
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    // FIX: The Link component now handles marking the notification as read
                                    <Link
                                        key={notif.id}
                                        to={notif.link} 
                                        onClick={() => handleNotificationClick(notif.id)}
                                        className="block p-3 text-sm text-gray-700 border-b hover:bg-gray-50"
                                    >
                                        {notif.message}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(notif.timestamp).toLocaleString()}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-500">You have no new notifications.</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;