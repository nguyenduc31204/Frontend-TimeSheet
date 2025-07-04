import React, { useState } from 'react';

// Mock data cho mục đích demo
const mockData = {
  timesheets: [
    {
      id: 1,
      employee: 'John Doe',
      department: 'Engineering',
      project: 'Project A',
      submissionDate: '2025-07-01',
      type: 'Timesheet',
      totalHours: 40,
      status: 'Pending',
      entries: [
        { date: '2025-06-30', hours: 8, task: 'Development' },
        { date: '2025-07-01', hours: 8, task: 'Testing' },
      ],
    },
    {
      id: 2,
      employee: 'Jane Smith',
      department: 'Marketing',
      project: 'Project B',
      submissionDate: '2025-07-02',
      type: 'Expense Report',
      totalAmount: 150.75,
      status: 'Pending',
      items: [
        { category: 'Travel', amount: 100.5, description: 'Flight' },
        { category: 'Meals', amount: 50.25, description: 'Client dinner' },
      ],
    },
  ],
  departments: ['Engineering', 'Marketing', 'Sales'],
  projects: ['Project A', 'Project B', 'Project C'],
  employees: ['John Doe', 'Jane Smith', 'Bob Johnson'],
};

const TimesheetApproval = () => {
  const [timesheets, setTimesheets] = useState(mockData.timesheets);
  const [filters, setFilters] = useState({ employee: '', department: '', project: '', status: '' });
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredTimesheets = timesheets.filter((item) => {
    return (
      (filters.employee === '' || item.employee === filters.employee) &&
      (filters.department === '' || item.department === filters.department) &&
      (filters.project === '' || item.project === filters.project) &&
      (filters.status === '' || item.status === filters.status)
    );
  });

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    setTimesheets((prev) =>
      prev.map((item) =>
        selected.includes(item.id)
          ? { ...item, status: action === 'approve' ? 'Approved' : 'Rejected' }
          : item
      )
    );
    setSelected([]);
  };

  const handleAction = (id, action, reason = '') => {
    setTimesheets((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: action === 'approve' ? 'Approved' : 'Rejected', rejectReason: reason }
          : item
      )
    );
    setShowRejectModal(null);
    setRejectReason('');
  };

  const openDetailsModal = (item) => {
    setModal(item);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timesheet Approval</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          name="employee"
          value={filters.employee}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Employees</option>
          {mockData.employees.map((emp) => (
            <option key={emp} value={emp}>
              {emp}
            </option>
          ))}
        </select>
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Departments</option>
          {mockData.departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        <select
          name="project"
          value={filters.project}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Projects</option>
          {mockData.projects.map((proj) => (
            <option key={proj} value={proj}>
              {proj}
            </option>
          ))}
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => handleBulkAction('approve')}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Approve Selected
          </button>
          <button
            onClick={() => handleBulkAction('reject')}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Reject Selected
          </button>
        </div>
      )}

      {/* Data Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">
              <input
                type="checkbox"
                onChange={(e) =>
                  setSelected(e.target.checked ? timesheets.map((t) => t.id) : [])
                }
                checked={selected.length === timesheets.length && timesheets.length > 0}
              />
            </th>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2 text-left">Submission Date</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTimesheets.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
              <td className="p-2">{item.employee}</td>
              <td className="p-2">{item.submissionDate}</td>
              <td className="p-2">{item.type}</td>
              <td className="p-2">
                {item.type === 'Timesheet' ? `${item.totalHours} hours` : `$${item.totalAmount.toFixed(2)}`}
              </td>
              <td className="p-2">{item.status}</td>
              <td className="p-2">
                <button
                  onClick={() => openDetailsModal(item)}
                  className="text-blue-500 mr-2"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleAction(item.id, 'approve')}
                  className="text-green-500 mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectModal(item.id)}
                  className="text-red-500"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Details Modal */}
      {modal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">{modal.type} Details</h2>
            <p><strong>Employee:</strong> {modal.employee}</p>
            <p><strong>Department:</strong> {modal.department}</p>
            <p><strong>Project:</strong> {modal.project}</p>
            <p><strong>Submission Date:</strong> {modal.submissionDate}</p>
            <p><strong>Status:</strong> {modal.status}</p>
            {modal.type === 'Timesheet' ? (
              <>
                <p><strong>Total Hours:</strong> {modal.totalHours}</p>
                <h3 className="text-lg font-semibold mt-4">Entries</h3>
                <table className="w-full mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Hours</th>
                      <th className="p-2 text-left">Task</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modal.entries.map((entry, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{entry.date}</td>
                        <td className="p-2">{entry.hours}</td>
                        <td className="p-2">{entry.task}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <p><strong>Total Amount:</strong> ${modal.totalAmount.toFixed(2)}</p>
                <h3 className="text-lg font-semibold mt-4">Expense Items</h3>
                <table className="w-full mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Amount</th>
                      <th className="p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modal.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{item.category}</td>
                        <td className="p-2">${item.amount.toFixed(2)}</td>
                        <td className="p-2">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <button
              onClick={() => setModal(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Reject Reason</h2>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter reason for rejection"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowRejectModal(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(showRejectModal, 'reject', rejectReason)}
                className="bg-red-500 text-white px-4 py-2 rounded"
                disabled={!rejectReason}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetApproval;