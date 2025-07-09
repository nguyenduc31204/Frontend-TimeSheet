// src/pages/admin/UserEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserForm from '../../components/features/users/UserForm';
import { getUserById, updateUser } from '../../api/timesheetService';

const UserEditPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getUserById(userId).then(setInitialData);
    }, [userId]);

    const handleUpdateUser = async (userData) => {
        setIsSaving(true);
        await updateUser(userId, { ...initialData, ...userData });
        setIsSaving(false);
        alert('User updated successfully!');
        navigate('/admin/users');
    };

    if (!initialData) return <div>Loading user data...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit User</h1>
            <UserForm initialData={initialData} onSubmit={handleUpdateUser} isSaving={isSaving} />
        </div>
    );
};
export default UserEditPage;