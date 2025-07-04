// src/pages/TimesheetAddPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TimesheetForm from '../../components/features/timesheets/TimesheetForm';

const TimesheetAddPage = () => {
  const navigate = useNavigate();

  const handleCreateTimesheet = (formData) => {
    console.log('Creating new timesheet:', formData);
    // In a real app, you would make an API call here.
    // e.g., api.timesheets.create(formData)
    alert(`Timesheet saved with status: ${formData.status}`);
    navigate('/timesheets');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New Timesheet</h1>
      <TimesheetForm onSubmit={handleCreateTimesheet} isSaving={false} />
    </div>
  );
};

export default TimesheetAddPage;