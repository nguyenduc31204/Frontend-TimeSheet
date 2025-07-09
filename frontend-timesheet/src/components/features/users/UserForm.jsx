import React, { useState, useEffect } from 'react';
import { getDepartments, getRoles } from '../../../api/timesheetService';

const UserForm = ({ initialData, onSubmit, isSaving }) => {
    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        phone: '',
        roleId: '',
        departmentId: '',
        status: 'Active',
        password: '',
    });
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const isEditMode = !!initialData;

    useEffect(() => {
        const fetchData = async () => {
            const [fetchedRoles, fetchedDepartments] = await Promise.all([
                getRoles(),
                getDepartments()
            ]);
            setRoles(fetchedRoles);
            setDepartments(fetchedDepartments);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                userName: initialData.userName || '',
                userEmail: initialData.userEmail || '',
                phone: initialData.phone || '',
                roleId: initialData.roleId || '',
                departmentId: initialData.departmentId || '',
                status: initialData.status || 'Active',
                password: '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Find roleName and departmentName from the selected IDs to save them
        const selectedRole = roles.find(r => r.id === formData.roleId);
        const selectedDept = departments.find(d => d.id === formData.departmentId);

        const payload = {
            ...formData,
            roleName: selectedRole ? selectedRole.roleName : '',
            departmentName: selectedDept ? selectedDept.departmentName : ''
        };
        
        // In edit mode, if password is blank, don't send it
        if(isEditMode && !payload.password) {
            delete payload.password;
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-gray-700">User Name</label>
                    <input type="text" name="userName" id="userName" value={formData.userName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300"/>
                </div>
                <div>
                    <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">User Email</label>
                    <input type="email" name="userEmail" id="userEmail" value={formData.userEmail} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300"/>
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} placeholder={isEditMode ? "Leave blank to keep current" : ""} required={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300"/>
                </div>
                <div>
                    <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">Role</label>
                    <select id="roleId" name="roleId" value={formData.roleId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300">
                        <option value="">Select a role</option>
                        {roles.map(role => <option key={role.id} value={role.id}>{role.roleName}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">Department</label>
                    <select id="departmentId" name="departmentId" value={formData.departmentId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300">
                        <option value="">Select a department</option>
                        {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.departmentName}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-6 border-t">
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save User'}
                </button>
            </div>
        </form>
    );
};
export default UserForm;