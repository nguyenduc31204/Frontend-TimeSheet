// src/pages/TimesheetViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockTimesheets } from './TimesheetPage'; // Assuming mock data is exported

const StatusBadge = ({ status }) => { // Re-using the badge component
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


const TimesheetViewPage = () => {
    const { timesheetId } = useParams();
    const [timesheet, setTimesheet] = useState(null);

    useEffect(() => {
        // Fetch data
        const dataToView = mockTimesheets.find(ts => ts.timesheetId === timesheetId);
         if (dataToView) {
            dataToView.entries = [
                { date: '2025-02-21', project: 'Internal CRM', task: 'API Integration', hours: 8 },
                { date: '2025-02-22', project: 'Mobile App', task: 'UI Mockups', hours: 6.5 },
                { date: '2025-02-23', project: 'Internal CRM', task: 'Testing & QA', hours: 8 },
                { date: '2025-02-24', project: 'Mobile App', task: 'State management setup', hours: 8 },
                { date: '2025-02-25', project: 'Internal CRM', task: 'Deployment', hours: 8 },
            ];
        }
        setTimesheet(dataToView);
    }, [timesheetId]);

    if (!timesheet) return <div>Loading...</div>;
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD

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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold text-right">{entry.hours.toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan="3" className="px-6 py-3 text-right text-sm font-bold text-gray-900">Total Hours</td>
                            <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">{timesheet.totalHours.toFixed(1)}</td>
                        </tr>
                    </tfoot>
                 </table>
            </div>

            <div className="pt-6 border-t mt-6 text-right">
                <Link to="/timesheets" className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                    Back to List
                </Link>
            </div>
        </div>
    );
}

export default TimesheetViewPage;