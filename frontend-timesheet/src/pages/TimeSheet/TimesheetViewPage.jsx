// src/pages/TimesheetViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { exportToExcel } from '../../utils/exportUtils';
import { FiDownload, FiArrowLeft } from 'react-icons/fi';
import { getTimesheetById } from '../../api/timesheetService';

// StatusBadge component remains the same
const StatusBadge = ({ status }) => {
  const styles = {
    Draft: 'bg-gray-200 text-gray-800',
    Submitted: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-lg leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

const Spinner = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

// --- Main Page Component ---

const TimesheetViewPage = () => {
    const { timesheetId } = useParams();
    // FIX: Simplified state, only need 'timesheet' and 'isLoading'
    const [timesheet, setTimesheet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect to fetch data from API
    useEffect(() => {
        const fetchTimesheet = async () => {
            setIsLoading(true);
            const data = await getTimesheetById(timesheetId);
            console.log('data', data)
            setTimesheet(data); 

            setIsLoading(false);
        };
    
        fetchTimesheet();
    }, [timesheetId]);

    console.log('timesheet', timesheet)

    // Handle the export action
    const handleExport = () => {
        // This check now works correctly because the 'timesheet' state is being updated
        if (!timesheet || !timesheet.entries) {
            alert('No data available to export.');
            return;
        }

        const dataForExport = timesheet.entries.map(entry => ({
            "Timesheet ID": timesheet.timesheetId,
            "Employee Name": timesheet.userName,
            "Period": `${formatDate(timesheet.startDate)} - ${formatDate(timesheet.endDate)}`,
            "Entry Date": formatDate(entry.date),
            "Project": entry.project,
            "Task": entry.task,
            "Hours": entry.hours,
        }));
        
        dataForExport.push({});
        dataForExport.push({
            "Task": "TOTAL",
            "Hours": timesheet.totalHours
        });

        const fileName = `Timesheet_${timesheet.timesheetId}_${timesheet.userName.replace(' ', '_')}`;
        exportToExcel(dataForExport, fileName);
    };
    
    // Moved helper function to the top
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-CA') : 'N/A';

    // FIX: Correct rendering logic
    // 1. Check for loading state first
    if (isLoading) {
        return <Spinner />;
    }

    // 2. After loading, check if data exists
    if (!timesheet) {
        return <div className="text-center py-10 font-semibold">Could not find timesheet with ID: {timesheetId}</div>;
    }

    // 3. If everything is fine, render the page
    return (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 pb-6 border-b">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Timesheet Details</h1>
                    <p className="mt-1 text-gray-500">Period: {formatDate(timesheet.startDate)} to {formatDate(timesheet.endDate)}</p>
                    <p className="text-sm text-gray-500">Submitted By: {timesheet.submittedBy || 'N/A'}</p>
                </div>
                <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Status</div>
                    <StatusBadge status={timesheet.status} />
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900">Entries</h3>
            <div className="overflow-x-auto border rounded-lg">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hours</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {timesheet.entries?.map((entry, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formatDate(entry.date)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{entry.project}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.task}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{entry.hours?.toFixed(1) || '0.0'}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-bold text-gray-900">Total Hours</td>
                            <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">{timesheet.totalHours?.toFixed(1) || '0.0'}</td>
                        </tr>
                    </tfoot>
                 </table>
            </div>

            <div className="pt-6 border-t mt-6 flex justify-end items-center gap-3">
                <Link to="/timesheets" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                    <FiArrowLeft />
                    Back to List
                </Link>

                {timesheet.status === 'Approved' && (
                    <button
                        onClick={handleExport}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                        <FiDownload />
                        Export to Excel
                    </button>
                )}
            </div>
        </div>
    );
}

export default TimesheetViewPage;