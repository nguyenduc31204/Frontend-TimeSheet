// src/pages/manager/ApprovalPage.jsx
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiFilter, FiEye } from 'react-icons/fi';
import { Dialog, Transition } from '@headlessui/react';
import { approveItem, createNotification, getPendingApprovals, rejectItem } from '../../api/timesheetService';

const RejectionModal = ({ isOpen, onClose, onSubmit, item }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }
        onSubmit(reason);
        setReason('');
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-30" /></Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Reason for Rejection</Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Please provide a clear reason for rejecting this {item?.type}.</p>
                                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} className="mt-2 w-full rounded-md border-gray-300 shadow-sm" placeholder="e.g., Incorrect hours logged on Tuesday..."></textarea>
                                </div>
                                <div className="mt-4 flex justify-end space-x-2">
                                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                                    <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Confirm Rejection</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};


// --- Main Page Component ---
const ApprovalPage = () => {
    const [approvals, setApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [itemToReject, setItemToReject] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const data = await getPendingApprovals();
            // Add a 'type' field to each item for easier identification
            const formattedData = data.map(item => ({
                ...item,
                type: item.timesheetId ? 'Timesheet' : 'Expense Report'
            }));
            setApprovals(formattedData);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const filteredApprovals = useMemo(() =>
        approvals.filter(item =>
            item.userName?.toLowerCase().includes(filter.toLowerCase())
        ),
        [approvals, filter]
    );

    const handleApprove = async (item) => {
        const itemType = item.type === 'Timesheet' ? 'timesheets' : 'expense_reports';
        const result = await approveItem(itemType, item.id);
        
        if (result) {
            // Sau khi duyệt thành công, tạo thông báo
            await createNotification({
                id: `N${String(Date.now()).slice(-5)}`, 
                userId: item.userId, 
                message: `Your ${item.type.toLowerCase()} (${item.description || item.id}) has been approved.`,
                link: item.type === 'Timesheet' ? `/timesheets/view/${item.id}` : `/expenses/view/${item.id}`,
                isRead: false,
                timestamp: new Date().toISOString()
            });

            setApprovals(prev => prev.filter(p => p.id !== item.id));
            alert(`${item.type} ${item.id} has been approved.`);
        } else {
            alert(`Failed to approve ${item.type} ${item.id}.`);
        }
    };

    const handleConfirmReject = async (reason) => {
        if (!itemToReject) return;
        const itemType = itemToReject.type === 'Timesheet' ? 'timesheets' : 'expense_reports';
        const result = await rejectItem(itemType, itemToReject.id, reason);

        if (result) {
            // Sau khi từ chối thành công, tạo thông báo
            await createNotification({
                id: `N${String(Date.now()).slice(-5)}`,
                userId: itemToReject.userId,
                message: `Your ${itemToReject.type.toLowerCase()} (${itemToReject.description || itemToReject.id}) has been rejected. Reason: ${reason}`,
                link: itemToReject.type === 'Timesheet' ? `/timesheets/view/${itemToReject.id}` : `/expenses/view/${itemToReject.id}`,
                isRead: false,
                timestamp: new Date().toISOString()
            });

            setApprovals(prev => prev.filter(p => p.id !== itemToReject.id));
            alert(`${itemToReject.type} ${itemToReject.id} has been rejected.`);
        } else {
            alert(`Failed to reject ${itemToReject.type} ${itemToReject.id}.`);
        }
        setItemToReject(null);
    };
    
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : 'N/A';
    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="space-y-6">
            <RejectionModal isOpen={!!itemToReject} onClose={() => setItemToReject(null)} onSubmit={handleConfirmReject} item={itemToReject}/>
            <h1 className="text-3xl font-bold text-gray-900">Approval Queue</h1>
            
            {/* Filter Controls */}
            <div className="relative">
                <FiFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Filter by employee name..." value={filter} onChange={e => setFilter(e.target.value)} className="w-full sm:w-1/3 pl-10 pr-4 py-2 rounded-lg border border-gray-300" />
            </div>

            {/* Approvals Table */}
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted On</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="5" className="text-center py-10">Loading pending approvals...</td></tr>
                        ) : filteredApprovals.length > 0 ? filteredApprovals.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.userName || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.submissionDate)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                                    {item.type === 'Timesheet' ? `${item.totalHours} hours` : formatCurrency(item.totalAmount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <Link to={item.type === 'Timesheet' ? `/timesheets/view/${item.id}` : `/expenses/view/${item.id}`} className="p-2 rounded-full text-gray-500 hover:bg-gray-100" title="View Details"><FiEye/></Link>
                                    <button onClick={() => handleApprove(item)} className="p-2 rounded-full text-green-600 hover:bg-green-100" title="Approve"><FiCheck/></button>
                                    <button onClick={() => setItemToReject(item)} className="p-2 rounded-full text-red-600 hover:bg-red-100" title="Reject"><FiX/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-500">No pending approvals. Great job!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalPage;