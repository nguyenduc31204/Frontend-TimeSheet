// src/pages/TimesheetEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTimesheetById, updateTimesheet } from '../../api/timesheetService';
import TimesheetForm from '../../components/features/timesheets/TimesheetForm';

const TimesheetEditPage = () => {
  const { timesheetId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect để fetch dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchTimesheet = async () => {
        console.log('Fetching data for ID:', timesheetId); 
      setIsLoading(true);
      const data = await getTimesheetById(timesheetId);
      setInitialData(data);
      setIsLoading(false);
    };

    fetchTimesheet();
  }, [timesheetId]);

  // Hàm xử lý khi form được submit
  const handleUpdateTimesheet = async (formData) => {
    setIsSaving(true);
    const updatedData = await updateTimesheet(timesheetId, formData);
    setIsSaving(false);

    if (updatedData) {
      alert(`Timesheet ${timesheetId} updated with status: ${updatedData.status}`);
      navigate('/timesheets');
    } else {
      alert(`Failed to update timesheet ${timesheetId}.`);
    }
  };
  
  // Hiển thị trạng thái loading trong khi chờ API
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Xử lý trường hợp không tìm thấy timesheet
  if (!initialData) {
    return <div className="text-center py-10">Timesheet not found.</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Timesheet ({timesheetId})</h1>
      <TimesheetForm 
        initialData={initialData}
        onSubmit={handleUpdateTimesheet} 
        isSaving={isSaving} 
      />
    </div>
  );
};

export default TimesheetEditPage;