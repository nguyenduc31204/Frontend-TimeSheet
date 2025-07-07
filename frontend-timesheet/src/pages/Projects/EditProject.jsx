import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    project_name: '',
    project_description: '',
    department_id: '',
    status: 0,
  });

  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:3001/project/${id}`).then((res) => {
      const project = res.data;
      setFormData({
        project_name: project.project_name || '',
        project_description: project.project_description || '',
        department_id: project.department_id?.toString() || '',
        status: project.status ?? 1,
      });
    });

    axios.get('http://localhost:3001/department').then((res) =>
      setDepartments(res.data)
    );
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:3001/project/${id}`, formData);
    navigate('/Projects');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="project_name"
          placeholder="Project name"
          className="w-full border p-2"
          value={formData.project_name}
          onChange={(e) =>
            setFormData({ ...formData, project_name: e.target.value })
          }
        />

        <textarea
          name="project_description"
          placeholder="Description"
          className="w-full border p-2"
          value={formData.project_description}
          onChange={(e) =>
            setFormData({ ...formData, project_description: e.target.value })
          }
        />

        <select
          className="w-full border p-2 rounded"
          value={formData.department_id}
          onChange={(e) =>
            setFormData({ ...formData, department_id: e.target.value })
          }
        >
          <option value="">-- Select Department --</option>
          {departments.map((dep) => (
            <option key={dep.id} value={dep.id}>
              {dep.department_name}
            </option>
          ))}
        </select>

        <label className="block">
          <input
            type="checkbox"
            checked={formData.status === 1}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.checked ? 1 : 0 })
            }
          />
          {' '}Done
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditProject;
