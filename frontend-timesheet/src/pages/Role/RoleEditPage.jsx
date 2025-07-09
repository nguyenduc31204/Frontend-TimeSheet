// src/pages/admin/RoleEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoleForm from '../../components/features/roles/RoleForm';
import { getRoleById, updateRole } from '../../api/timesheetService';

const RoleEditPage = () => {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        getRoleById(roleId).then(setInitialData);
    }, [roleId]);

    const handleSave = async (roleData) => {
        await updateRole(roleId, { ...initialData, ...roleData });
        navigate('/admin/roles');
    };

    if (!initialData) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Edit Role</h1>
            <RoleForm initialData={initialData} onSubmit={handleSave} />
        </div>
    );
};
export default RoleEditPage;