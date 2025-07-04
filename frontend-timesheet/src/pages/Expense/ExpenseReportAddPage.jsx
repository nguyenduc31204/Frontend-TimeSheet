// src/pages/ExpenseReportAddPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseReportForm from '../../components/expenses/ExpenseReportForm';
import { createExpenseReport } from '../../api/timesheetService';

const ExpenseReportAddPage = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateReport = async (formData) => {
    setIsSaving(true);
    const newReport = await createExpenseReport(formData);
    setIsSaving(false);
    if (newReport) {
      alert(`Report created successfully with ID: ${newReport.id}`);
      navigate('/expenses');
    } else {
      alert('Failed to create report.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">New Expense Report</h1>
      <ExpenseReportForm onSubmit={handleCreateReport} isSaving={isSaving} />
    </div>
  );
};
export default ExpenseReportAddPage;