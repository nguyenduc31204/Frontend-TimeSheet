// src/pages/TimesheetPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiEye, FiTrash2, FiSend } from 'react-icons/fi';
import { getTimesheets } from '../../api/timesheetService';

// --- MOCK DATA (Simulating data from your database) ---
// In a real application, this would come from an API call.


// --- Sub-components for better organization ---

const StatusBadge = ({ status }) => {
  const styles = {
    Draft: 'bg-gray-200 text-gray-800',
    Submitted: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
};

const ActionButtons = ({ status, timesheetId }) => {
  // These links would go to the actual pages for editing, viewing, etc.
  if (status === 'Draft') {
    return (
      <div className="flex items-center space-x-2">
        <Link to={`/timesheets/edit/${timesheetId}`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
          <FiEdit />
        </Link>
        <button className="text-green-600 hover:text-green-900" title="Submit">
          <FiSend />
        </button>
        <button className="text-red-600 hover:text-red-900" title="Delete">
          <FiTrash2 />
        </button>
      </div>
    );
  }
  return (
    <Link to={`/timesheets/view/${timesheetId}`} className="text-gray-600 hover:text-gray-900" title="View Details">
      <FiEye />
    </Link>
  );
};

const Spinner = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

// --- Main Page Component ---

const TimesheetPage = () => {
  const [allTimesheets, setAllTimesheets] = useState([]);
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const TABS = ['All', 'Draft', 'Submitted', 'Approved', 'Rejected'];
  const [activeTab, setActiveTab] = useState('All');

  // Simulate fetching data on component mount
  useEffect(() => {
    const fetchTimesheets = async () => {
      setIsLoading(true);
      const data = await getTimesheets();
      setAllTimesheets(data);
      setFilteredTimesheets(data); 
      setIsLoading(false);
    };

    fetchTimesheets();
  }, []);

  // Handle filtering when a tab is clicked
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'All') {
      setFilteredTimesheets(allTimesheets);
    } else {
      setFilteredTimesheets(allTimesheets.filter(ts => ts.status === tab));
    }
  };
  
  // A helper function to format dates
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Timesheets</h1>
        <Link 
          to="/timesheets/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          <FiPlus />
          Submit New Timesheet
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {filteredTimesheets.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTimesheets.map((ts) => (
                    <tr key={ts.timesheetId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(ts.startDate)} - {formatDate(ts.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ts.totalHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={ts.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ts.submittedBy || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <ActionButtons status={ts.status} timesheetId={ts.timesheetId} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 px-4">
                <h3 className="text-lg font-medium text-gray-900">No Timesheets Found</h3>
                <p className="mt-1 text-sm text-gray-500">There are no timesheets with the status "{activeTab}".</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetPage;