import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category_name: '', category_description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3001/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('ERROR:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete this category?')) {
      try {
        await axios.delete(`http://localhost:3001/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Lỗi khi xoá:', err);
      }
    }
  };

  const handleAdd = () => {
    setFormData({ category_name: '', category_description: '' });
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleEdit = (cat) => {
    setFormData(cat);
    setEditingId(cat.id);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ category_name: '', category_description: '' });
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/categories/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:3001/categories', formData);
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi lưu:', err);
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

  const totalPages = Math.ceil(categories.length / limit);
  const paginatedCategories = categories.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Categories Management</h2>

      
      {showAddForm && (

        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
              placeholder="category name"
              className="w-full md:w-1/3 border rounded px-3 py-2"
            />
            <textarea
              name="category_description"
              value={formData.category_description}
              onChange={(e) => {
                handleChange(e);
                autoResize(e.target);
              }}
              placeholder="Category description"
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

      {/* Nút thêm mới */}
      {!showAddForm && (
        <div className="flex justify-end mb-3">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            <FaPlus /> New Category
          </button>
        </div>
      )}

      {/* Bảng danh mục */}
      <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
        <thead>
          <tr className="bg-indigo-100 text-gray-700 text-sm uppercase text-center">
            <th className="p-3 w-[5%]">#</th>
            <th className="p-3 w-[25%] text-left">Category</th>
            <th className="p-3 w-[50%] text-left">Description</th>
            <th className="p-3 w-[20%]">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700">
          {paginatedCategories.map((cat, index) => (
            editingId === cat.id ? (
              <tr key={cat.id} className="bg-yellow-50">
                <td className="text-center p-2">{(page - 1) * limit + index + 1}</td>
                <td className="p-2">
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <textarea
                    name="category_description"
                    value={formData.category_description}
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
              <tr key={cat.id} className="hover:bg-gray-50 border-b">
                <td className="text-center p-3">{(page - 1) * limit + index + 1}</td>
                <td className="p-3">{cat.category_name}</td>
                <td className="p-3">{cat.category_description}</td>
                <td className="text-center p-3 space-x-10">
                  <button onClick={() => handleEdit(cat)} className="text-yellow-600 hover:text-yellow-700 inline-flex items-center gap-1">
                    <FaEdit /> Update
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-700 inline-flex items-center gap-1">
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
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

export default CategoryList;
