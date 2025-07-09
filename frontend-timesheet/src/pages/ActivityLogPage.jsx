// src/pages/admin/ActivityLogPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getActivityLogs } from '../api/timesheetService';

// --- Sub-components ---

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

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ user: '', action: '', targetType: '', startDate: '', endDate: '' });
    const [uniqueFilterOptions, setUniqueFilterOptions] = useState({ users: [], actions: [], targetTypes: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const LOGS_PER_PAGE = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            const data = await getActivityLogs();
            setLogs(data);

            // Extract unique values for filter dropdowns
            const users = [...new Set(data.map(log => log.userName))];
            const actions = [...new Set(data.map(log => log.action))];
            const targetTypes = [...new Set(data.map(log => log.targetType))];
            setUniqueFilterOptions({ users, actions, targetTypes });
            
            setIsLoading(false);
        };
        fetchLogs();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1); // Reset to first page on filter change
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if(startDate) startDate.setHours(0,0,0,0);
            if(endDate) endDate.setHours(23,59,59,999);
            
            return (
                (filters.user ? log.userName === filters.user : true) &&
                (filters.action ? log.action === filters.action : true) &&
                (filters.targetType ? log.targetType === filters.targetType : true) &&
                (startDate ? logDate >= startDate : true) &&
                (endDate ? logDate <= endDate : true)
            );
        });
    }, [logs, filters]);

    const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * LOGS_PER_PAGE;
        return filteredLogs.slice(startIndex, startIndex + LOGS_PER_PAGE);
    }, [filteredLogs, currentPage]);

    const formatTimestamp = (ts) => new Date(ts).toLocaleString('en-GB');
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">System Activity Log</h1>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-white rounded-lg shadow-sm">
                <select name="user" value={filters.user} onChange={handleFilterChange} className="rounded-md border-gray-300">
                    <option value="">All Users</option>
                    {uniqueFilterOptions.users.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <select name="action" value={filters.action} onChange={handleFilterChange} className="rounded-md border-gray-300">
                    <option value="">All Actions</option>
                     {uniqueFilterOptions.actions.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <select name="targetType" value={filters.targetType} onChange={handleFilterChange} className="rounded-md border-gray-300">
                    <option value="">All Target Types</option>
                    {uniqueFilterOptions.targetTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="rounded-md border-gray-300"/>
                <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="rounded-md border-gray-300"/>
            </div>

            {/* Log Table */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr>
                            ) : paginatedLogs.length > 0 ? paginatedLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTimestamp(log.timestamp)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.userName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 font-semibold text-xs rounded-full ${log.action === 'Created' ? 'bg-blue-100 text-blue-800' : log.action === 'Updated' ? 'bg-yellow-100 text-yellow-800' : log.action === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.targetType !== 'System' ? `${log.targetType}: ${log.targetName || log.targetId}` : '-'}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="text-center py-10 text-gray-500">No activity logs found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && filteredLogs.length > 0 && (
                    <div className="px-6 py-3 border-t">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                )}
            </div>
        </div>
    );
};
export default ActivityLogPage;