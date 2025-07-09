// src/pages/admin/RoleListPage.jsx
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import { getRoles } from '../../api/timesheetService';

// --- Sub-components (Reused from UserListPage) ---

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, roleName }) => (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Confirm Deletion</Dialog.Title>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Are you sure you want to delete the role <strong className="text-gray-900">{roleName}</strong>? This may affect users assigned to this role.</p>
                            </div>
                            <div className="mt-4 flex justify-end space-x-2">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200">Cancel</button>
                                <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">Delete</button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-between text-sm">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="inline-flex items-center gap-2 px-3 py-1 rounded-md disabled:opacity-50 bg-white border">
                <FiChevronLeft/> Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="inline-flex items-center gap-2 px-3 py-1 rounded-md disabled:opacity-50 bg-white border">
                Next <FiChevronRight/>
            </button>
        </div>
    );
};


// --- Main Page Component ---

const RoleListPage = () => {
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [roleToDelete, setRoleToDelete] = useState(null);
    const ROLES_PER_PAGE = 5;

    useEffect(() => {
        const fetchRoles = async () => {
            setIsLoading(true);
            const data = await getRoles();
            setRoles(data);
            setIsLoading(false);
        };
        fetchRoles();
    }, []);

    const filteredRoles = useMemo(() => 
        roles.filter(role =>
            role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
        ), [roles, searchTerm]);

    const totalPages = Math.ceil(filteredRoles.length / ROLES_PER_PAGE);
    const paginatedRoles = useMemo(() => {
        const startIndex = (currentPage - 1) * ROLES_PER_PAGE;
        const endIndex = startIndex + ROLES_PER_PAGE;
        return filteredRoles.slice(startIndex, endIndex);
    }, [filteredRoles, currentPage]);

    const openDeleteModal = (role) => setRoleToDelete(role);
    const closeDeleteModal = () => setRoleToDelete(null);

    const handleConfirmDelete = async () => {
        // if (!roleToDelete) return;
        // const success = await deleteRole(roleToDelete.id); 
        // if (success) {
        //     setRoles(prevRoles => prevRoles.filter(r => r.id !== roleToDelete.id));
        //     alert(`Role ${roleToDelete.roleName} deleted successfully.`);
        // } else {
        //     alert('Failed to delete role.');
        // }
        closeDeleteModal();
    };

    if (isLoading) return <div>Loading roles...</div>;

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal isOpen={!!roleToDelete} onClose={closeDeleteModal} onConfirm={handleConfirmDelete} roleName={roleToDelete?.roleName} />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
                <Link to="/admin/roles/new" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                    <FiPlus /> Create New Role
                </Link>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by role name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/3 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                {/* Roles Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedRoles.length > 0 ? paginatedRoles.map(role => (
                                <tr key={role.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{role.roleName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.roleDescription}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.permissionIds?.length || 0} assigned</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <Link to={`/admin/roles/edit/${role.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit & Assign Permissions"><FiEdit /></Link>
                                        <button onClick={() => openDeleteModal(role)} className="text-red-600 hover:text-red-900" title="Delete"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-10 text-gray-500">No roles found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                <div className="mt-4 px-6 py-3 border-t">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
            </div>
        </div>
    );
};
export default RoleListPage;