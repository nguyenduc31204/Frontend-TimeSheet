// src/pages/TimesheetEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// We need the mock data here to find the timesheet to edit
import { mockTimesheets } from './TimesheetPage'; // Assuming mock data is exported from TimesheetPage
import TimesheetForm from '../../components/features/timesheets/TimesheetForm';

const TimesheetEditPage = () => {
  const { timesheetId } = useParams();
  const navigate = useNavigate();
  const [timesheetData, setTimesheetData] = useState(null);

  useEffect(() => {
    // In a real app, fetch data from API: api.timesheets.getById(timesheetId)
    const dataToEdit = mockTimesheets.find(ts => ts.timesheetId === timesheetId);
    // Let's add some mock entries for the form
    if (dataToEdit) {
        dataToEdit.entries = [
            { date: '2025-02-28', project: 'Project Phoenix', task: 'Initial setup', hours: 8 },
            { date: '2025-03-01', project: 'Project Phoenix', task: 'Component design', hours: 8 },
        ];
    }
    setTimesheetData(dataToEdit);
  }, [timesheetId]);

  const handleUpdateTimesheet = (formData) => {
    console.log(`Updating timesheet ${timesheetId}:`, formData);
    // API call: api.timesheets.update(timesheetId, formData)
    alert(`Timesheet ${timesheetId} updated with status: ${formData.status}`);
    navigate('/timesheets');
  };
  
  if (!timesheetData) {
    return <div>Loading...</div>; // Or a Spinner component
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Timesheet ({timesheetId})</h1>
      <TimesheetForm 
        initialData={timesheetData}
        onSubmit={handleUpdateTimesheet} 
        isSaving={false} 
      />
    </div>
  );
};

export default TimesheetEditPage;