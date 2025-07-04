// src/components/features/timesheets/TimesheetForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TimesheetForm = ({ initialData, onSubmit, isSaving }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    status: 'Draft',
    entries: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData({
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        status: initialData.status || 'Draft',
        // In a real app, you would fetch entries for the timesheet
        entries: initialData.entries || [{ date: '', project: '', task: '', hours: 0 }],
      });
    } else {
        // Default values for a new timesheet
        setFormData({
            startDate: '',
            endDate: '',
            status: 'Draft',
            entries: [{ date: '', project: '', task: '', hours: 0 }],
        });
    }
  }, [initialData]);

  const totalHours = useMemo(() => {
    return formData.entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
  }, [formData.entries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEntries = [...formData.entries];
    updatedEntries[index][name] = value;
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };

  const addEntryRow = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { date: '', project: '', task: '', hours: 0 }],
    }));
  };

  const removeEntryRow = (index) => {
    const updatedEntries = formData.entries.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, entries: updatedEntries }));
  };
  
  const handleSubmit = (status) => {
    onSubmit({ ...formData, totalHours, status });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Entries</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task Description</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {formData.entries.map((entry, index) => (
              <tr key={index}>
                <td><input type="date" name="date" value={entry.date} onChange={e => handleEntryChange(index, e)} className="w-full border-none p-2 focus:ring-1 focus:ring-indigo-500 rounded-md" /></td>
                <td><input type="text" name="project" placeholder="Project Name" value={entry.project} onChange={e => handleEntryChange(index, e)} className="w-full border-none p-2 focus:ring-1 focus:ring-indigo-500 rounded-md" /></td>
                <td><input type="text" name="task" placeholder="e.g., Development, Meeting" value={entry.task} onChange={e => handleEntryChange(index, e)} className="w-full border-none p-2 focus:ring-1 focus:ring-indigo-500 rounded-md" /></td>
                <td><input type="number" name="hours" min="0" step="0.5" value={entry.hours} onChange={e => handleEntryChange(index, e)} className="w-24 border-none p-2 focus:ring-1 focus:ring-indigo-500 rounded-md" /></td>
                <td>
                  <button onClick={() => removeEntryRow(index)} className="text-red-500 hover:text-red-700 p-2">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addEntryRow} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
        <FiPlus /> Add Row
      </button>

      <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-lg font-bold text-gray-900">
          Total Hours: <span className="text-indigo-600">{totalHours}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/timesheets')} className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={() => handleSubmit('Draft')} disabled={isSaving} className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 disabled:opacity-50 flex items-center gap-2">
            <FiSave /> Save as Draft
          </button>
          <button onClick={() => handleSubmit('Submitted')} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50">
            {isSaving ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetForm;