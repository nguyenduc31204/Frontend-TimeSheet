import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ department_name: '', department_description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:3001/department');
      setDepartments(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this department?')) {
      try {
        await axios.delete(`http://localhost:3001/department/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleAdd = () => {
    setFormData({ department_name: '', department_description: '' });
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (dep) => {
    setFormData(dep);
    setEditingId(dep.id);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ department_name: '', department_description: '' });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/department/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:3001/department', formData);
      }
      handleCancel();
      fetchDepartments();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + "px";
    }
  }, [editingId]); 

  const autoResize = (el) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };


  const totalPages = Math.ceil(departments.length / limit);
  const paginatedDepartments = departments.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Departments Management</h2>

      {showAddForm && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              name="department_name"
              value={formData.department_name}
              onChange={handleChange}
              placeholder="Department name"
              className="w-full md:w-1/3 border rounded px-3 py-2"
            />
            <textarea
              name="department_description"
              value={formData.department_description}
              onChange={(e) => {
                handleChange(e);
                autoResize(e.target);
              }}
              placeholder="Department description"
              className="w-full md:w-1/2 border rounded px-3 py-2 resize-none overflow-hidden"
              rows={1}
            />


            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                <FaSave className="inline mr-1" /> Save
              </button>
              <button onClick={handleCancel} className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500">
                <FaTimes className="inline mr-1" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!showAddForm && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            <FaPlus /> New Department
          </button>
        </div>
      )}

      <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead>
          <tr className="bg-indigo-100 text-gray-700 text-sm uppercase text-center">
            <th className="p-3 w-[5%]">#</th>
            <th className="p-3 w-[25%] text-left">Name</th>
            <th className="p-3 w-[50%] text-left">Description</th>
            <th className="p-3 w-[20%]">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {paginatedDepartments.map((dep, index) => (
            editingId === dep.id ? (
              <tr key={dep.id} className="bg-yellow-50">
                <td className="text-center p-2">{(page - 1) * limit + index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    name="department_name"
                    value={formData.department_name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <textarea
                    name="department_description"
                    value={formData.department_description}
                    onChange={(e) => {
                      handleChange(e);
                      autoResize(e.target);
                    }}
                    className="w-full border rounded px-2 py-1 resize-none overflow-hidden"
                    rows={1}
                    ref={descriptionRef}
                  />

                </td>
                <td className="text-center p-2 space-x-10">
                  <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                    <FaSave /> Save
                  </button>
                  <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                    <FaTimes /> Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={dep.id} className="hover:bg-gray-50 border-b">
                <td className="text-center p-3">{(page - 1) * limit + index + 1}</td>
                <td className="p-3">{dep.department_name}</td>
                <td className="p-3">{dep.department_description}</td>
                <td className="text-center p-3 space-x-10">
                  <button onClick={() => handleEdit(dep)} className="text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1">
                    <FaEdit /> Update
                  </button>
                  <button onClick={() => handleDelete(dep.id)} className="text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">Page {page} / {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DepartmentList;
