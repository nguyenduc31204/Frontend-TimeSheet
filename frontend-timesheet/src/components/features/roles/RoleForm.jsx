import React, { useState, useEffect } from 'react';
import { groupBy } from 'lodash';
import { getAllPermissions } from '../../../api/timesheetService';

const RoleForm = ({ initialData, onSubmit, isSaving }) => {
    const [roleName, setRoleName] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());
    const [allPermissions, setAllPermissions] = useState({});

    useEffect(() => {
        const fetchPermissions = async () => {
            const perms = await getAllPermissions();
            setAllPermissions(groupBy(perms, 'permissionType'));
        };
        fetchPermissions();
    }, []);

    useEffect(() => {
        if (initialData) {
            setRoleName(initialData.roleName || '');
            setRoleDescription(initialData.roleDescription || '');
            setSelectedPermissions(new Set(initialData.permissionIds || []));
        }
    }, [initialData]);

    const handlePermissionChange = (permId) => {
        const newSelection = new Set(selectedPermissions);
        if (newSelection.has(permId)) {
            newSelection.delete(permId);
        } else {
            newSelection.add(permId);
        }
        setSelectedPermissions(newSelection);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const roleData = {
            roleName,
            roleDescription,
            permissionIds: Array.from(selectedPermissions),
        };
        onSubmit(roleData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
            <div>
                <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">Role Name</label>
                <input type="text" id="roleName" value={roleName} onChange={e => setRoleName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
                <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700">Role Description</label>
                <textarea id="roleDescription" value={roleDescription} onChange={e => setRoleDescription(e.target.value)} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
                {Object.entries(allPermissions).map(([type, perms]) => (
                    <div key={type} className="p-4 border rounded-lg">
                        <h4 className="font-semibold capitalize text-gray-800">{type} Management</h4>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {perms.map(perm => (
                                <label key={perm.id} className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedPermissions.has(perm.id)}
                                        onChange={() => handlePermissionChange(perm.id)}
                                    />
                                    <span className="text-gray-700">{perm.permissionName}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Role'}
                </button>
            </div>
        </form>
    );
};
export default RoleForm;