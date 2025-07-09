// src/pages/admin/RoleAddPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RoleForm from '../../components/features/roles/RoleForm';
import { FiArrowLeft } from 'react-icons/fi';
import { createRole } from '../../api/timesheetService';

const RoleAddPage = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);

    /**
     * Handles the form submission to create a new role.
     * @param {object} roleData - The data from the RoleForm.
     */
    const handleCreateRole = async (roleData) => {
        setIsSaving(true);
        
        // Prepare data for API. Add system-generated fields.
        const newRolePayload = {
            ...roleData,
            roleId: `R${String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0')}`, // Example: R01234
            // In a real app, Created By would come from the logged-in user context.
            createdBy: 'Hieu Phan', 
            createdAt: new Date().toISOString(),
        };

        const result = await createRole(newRolePayload);
        setIsSaving(false);

        if (result) {
            alert(`Role "${result.roleName}" created successfully!`);
            navigate('/admin/roles'); // Navigate back to the list after success
        } else {
            alert('Error creating role. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/roles" className="p-2 rounded-full hover:bg-gray-200">
                    <FiArrowLeft className="h-6 w-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Role</h1>
                    <p className="mt-1 text-sm text-gray-500">Define a new role and assign permissions.</p>
                </div>
            </div>
            
            <RoleForm
                // Pass an empty object or null as initialData for 'add' mode
                initialData={null} 
                onSubmit={handleCreateRole} 
                isSaving={isSaving} 
            />
        </div>
    );
};

export default RoleAddPage;