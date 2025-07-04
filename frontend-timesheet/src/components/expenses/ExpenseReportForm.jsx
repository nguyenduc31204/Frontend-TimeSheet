// src/components/features/expenses/ExpenseReportForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave } from 'react-icons/fi';
import { getCategories } from '../../api/timesheetService';

const ExpenseReportForm = ({ initialData, onSubmit, isSaving }) => {
  const [formData, setFormData] = useState({ description: '', status: 'Draft', items: [] });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ description: '', status: 'Draft', items: [{ date: '', categoryId: '', description: '', amount: 0 }] });
    }
  }, [initialData]);

  const totalAmount = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [formData.items]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleItemChange = (index, e) => {
    const updatedItems = [...formData.items];
    updatedItems[index][e.target.name] = e.target.value;
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItemRow = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { date: '', categoryId: '', description: '', amount: 0 }] }));
  };

  const removeItemRow = (index) => {
    setFormData(prev => ({ ...prev, items: formData.items.filter((_, i) => i !== index) }));
  };
  
  const handleSubmit = (status) => {
    onSubmit({ ...formData, totalAmount, status });
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Report Description</label>
        <input type="text" name="description" id="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="e.g., Business Trip to HCMC" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Items</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index}>
                <td><input type="date" name="date" value={item.date} onChange={e => handleItemChange(index, e)} className="w-full border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-indigo-500" /></td>
                <td>
                  <select name="categoryId" value={item.categoryId} onChange={e => handleItemChange(index, e)} className="w-full border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-indigo-500">
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </td>
                <td><input type="text" name="description" placeholder="e.g., Taxi, Lunch" value={item.description} onChange={e => handleItemChange(index, e)} className="w-full border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-indigo-500" /></td>
                <td><input type="number" name="amount" min="0" value={item.amount} onChange={e => handleItemChange(index, e)} className="w-full border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-indigo-500" /></td>
                <td>
                  <button onClick={() => removeItemRow(index)} className="text-red-500 hover:text-red-700 p-2"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={addItemRow} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"><FiPlus /> Add Item</button>

      <div className="mt-8 pt-6 border-t flex justify-between items-center">
        <div className="text-lg font-bold">Total Amount: <span className="text-indigo-600">{formatCurrency(totalAmount)}</span></div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/expenses')} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
          <button onClick={() => handleSubmit('Draft')} disabled={isSaving} className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2"><FiSave /> Save Draft</button>
          <button onClick={() => handleSubmit('Submitted')} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700">{isSaving ? 'Submitting...' : 'Submit Report'}</button>
        </div>
      </div>
    </div>
  );
};
export default ExpenseReportForm;