// src/pages/admin/UserAddPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from '../../components/features/users/UserForm';
import { createUser } from '../../api/timesheetService';

const UserAddPage = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateUser = async (userData) => {
        setIsSaving(true);
        const newUser = await createUser(userData);
        setIsSaving(false);
        if (newUser) {
            alert('User created successfully!');
            navigate('/admin/users');
        } else {
            alert('Failed to create user.');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New User</h1>
            <UserForm onSubmit={handleCreateUser} isSaving={isSaving} />
        </div>
    );
};
export default UserAddPage;