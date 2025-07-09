// src/pages/admin/UserListPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getUsers } from '../../api/timesheetService';

// --- Sub-components ---

const StatusBadge = ({ status }) => {
    const isActive = status === 'Active';
    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
        </span>
    );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => (
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
                                <p className="text-sm text-gray-500">Are you sure you want to delete the user <strong className="text-gray-900">{userName}</strong>? This action cannot be undone.</p>
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

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userToDelete, setUserToDelete] = useState(null);
    const USERS_PER_PAGE = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            const data = await getUsers();
            setUsers(data);
            setIsLoading(false);
        };
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => 
        users.filter(user =>
            user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * USERS_PER_PAGE;
        const endIndex = startIndex + USERS_PER_PAGE;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage]);

    const openDeleteModal = (user) => setUserToDelete(user);
    const closeDeleteModal = () => setUserToDelete(null);

    const handleConfirmDelete = async () => {
        // if (!userToDelete) return;
        // const success = await deleteUser(userToDelete.id);
        // if (success) {
        //     setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
        //     alert(`User ${userToDelete.userName} deleted successfully.`);
        // } else {
        //     alert('Failed to delete user.');
        // }
        closeDeleteModal();
    };

    if (isLoading) return <div>Loading users...</div>;

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal isOpen={!!userToDelete} onClose={closeDeleteModal} onConfirm={handleConfirmDelete} userName={userToDelete?.userName} />
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <Link to="/admin/users/new" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                    <FiPlus /> Add New User
                </Link>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                {/* User Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedUsers.length > 0 ? paginatedUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{user.userName}</div>
                                        <div className="text-sm text-gray-500">{user.userEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roleName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.departmentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <Link to={`/admin/users/edit/${user.id}`} className="text-indigo-600 hover:text-indigo-900" title="Edit"><FiEdit /></Link>
                                        <button onClick={() => openDeleteModal(user)} className="text-red-600 hover:text-red-900" title="Delete"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">No users found.</td>
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
export default UserListPage;