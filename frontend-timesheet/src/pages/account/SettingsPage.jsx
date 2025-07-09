// src/pages/account/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiLock, FiBell, FiSave } from 'react-icons/fi';
import { updateUser } from '../../api/timesheetService';

// A reusable card component for consistent styling
const SettingsCard = ({ title, icon, children }) => (
    <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
                {icon}
                {title}
            </h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const SettingsPage = () => {
    const { user, login } = useAuth(); // We might need login to update the user context after a change
    const [isSaving, setIsSaving] = useState(false);
    
    // State for Personal Information form
    const [profileData, setProfileData] = useState({
        userName: '',
        userEmail: '',
        phone: '',
    });

    // State for Password Change form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Populate the form with user data when the component loads
    useEffect(() => {
        if (user) {
            setProfileData({
                userName: user.userName || '',
                userEmail: user.userEmail || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        // In a real app, you would have a dedicated user object from the API
        const updatedUser = await updateUser(user.id, { ...user, ...profileData });
        setIsSaving(false);

        if (updatedUser) {
            // Update the user in the context to reflect changes immediately
            login(updatedUser); 
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        setIsSaving(true);
        // API call to change password would go here.
        // For now, we just simulate it.
        console.log("Changing password with data:", passwordData);
        setTimeout(() => {
            setIsSaving(false);
            alert('Password changed successfully! (Simulation)');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: ''});
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="mt-1 text-sm text-gray-500">Manage your personal information, password, and notification settings.</p>
            </div>

            {/* Personal Information Card */}
            <SettingsCard title="Personal Information" icon={<FiUser className="text-indigo-600"/>}>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium">Full Name</label>
                        <input type="text" name="userName" id="userName" value={profileData.userName} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                    </div>
                    <div>
                        <label htmlFor="userEmail" className="block text-sm font-medium">Email Address</label>
                        <input type="email" name="userEmail" id="userEmail" value={profileData.userEmail} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
                        <input type="tel" name="phone" id="phone" value={profileData.phone} onChange={handleProfileChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50">
                            <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </SettingsCard>

            {/* Change Password Card */}
            <SettingsCard title="Change Password" icon={<FiLock className="text-indigo-600"/>}>
                 <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword"  className="block text-sm font-medium">Current Password</label>
                        <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                    </div>
                    <div>
                        <label htmlFor="newPassword"  className="block text-sm font-medium">New Password</label>
                        <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword"  className="block text-sm font-medium">Confirm New Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                    </div>
                     <div className="text-right">
                        <button type="submit" disabled={isSaving} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50">
                             <FiSave /> {isSaving ? 'Saving...' : 'Update Password'}
                        </button>
                    </div>
                 </form>
            </SettingsCard>

            {/* Notifications Card */}
            <SettingsCard title="Notifications" icon={<FiBell className="text-indigo-600"/>}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-800">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Get emails about approvals and rejections.</p>
                        </div>
                        <label className="switch"><input type="checkbox" defaultChecked/><span></span></label>
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-800">Weekly Summary</h4>
                            <p className="text-sm text-gray-500">Receive a weekly summary of your activities.</p>
                        </div>
                        <label className="switch"><input type="checkbox"/><span></span></label>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};

export default SettingsPage;