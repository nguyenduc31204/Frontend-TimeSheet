// src/pages/ExpenseReportEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseReportForm from '../../components/expenses/ExpenseReportForm';
import { getExpenseReportById, updateExpenseReport } from '../../api/timesheetService';

const ExpenseReportEditPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getExpenseReportById(reportId);
      setInitialData(data);
    };
    fetchReport();
  }, [reportId]);

  const handleUpdateReport = async (formData) => {
    setIsSaving(true);
    const updatedReport = await updateExpenseReport(reportId, formData);
    setIsSaving(false);
    if (updatedReport) {
      alert(`Report ${reportId} updated successfully.`);
      navigate('/expenses');
    } else {
      alert('Failed to update report.');
    }
  };

  if (!initialData) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Expense Report ({reportId})</h1>
      <ExpenseReportForm initialData={initialData} onSubmit={handleUpdateReport} isSaving={isSaving} />
    </div>
  );
};
export default ExpenseReportEditPage;