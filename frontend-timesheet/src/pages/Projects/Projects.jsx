import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchDepartments();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('http://localhost:3001/project');
    setProjects(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get('http://localhost:3001/department');
    setDepartments(res.data);
  };

  const getDepartmentName = (id) => {
    const dep = departments.find((d) => d.id === id.toString());
    return dep ? dep.department_name : 'Unknown';
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure to delete this project?')) {
      try {
        await axios.delete(`http://localhost:3001/project/${projectId}`);
        fetchProjects();
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete project');
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Project List</h2>
      <button
        onClick={() => navigate('/Projects/AddProject')}
        className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <FaPlus /> New Project
      </button>

      <table className="min-w-full bg-white shadow-md">
        <thead>
          <tr className="bg-gray-100 text-sm text-left">
            <th className="p-3">Project</th>
            <th className="p-3">Department</th>
            <th className="p-3">Description</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.project_id || p.id} className="border-b">
              <td className="p-3">{p.project_name}</td>
              <td className="p-3">{getDepartmentName(p.department_id)}</td>
                <td className="p-3">
                    {p.project_description || 'No description'}
                </td>
              <td className="p-3">{p.status ? 'Done' : 'Processing'}</td>
              <td className="p-3 flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/Projects/EditProject/${p.project_id || p.id}`)
                  }
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(p.project_id || p.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Projects;
