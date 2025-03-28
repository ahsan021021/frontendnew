import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

// Create an axios instance with base URL and token interceptor
const instance = axios.create({
  baseURL: 'http://82.180.137.7:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get the token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Set the token in the headers
  }
  return config;
});

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    content: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch templates from the backend
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError('Failed to fetch templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Create new template
      const response = await instance.post('/templates', template);
      setTemplates([...templates, response.data]); // Update local state with the new template
      resetForm();
    } catch (error) {
      console.error('Error saving template:', error);
      setError('Failed to save template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTemplate({ name: '', content: '', category: '' });
    setShowForm(false);
  };

  const handleDeleteTemplate = async (id) => {
    setLoading(true);
    setError('');
    try {
      await instance.delete(`/templates/${id}`);
      setTemplates(templates.filter((template) => template._id !== id)); // Update local state
    } catch (error) {
      console.error('Error deleting template:', error);
      setError('Failed to delete template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Email Templates</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Template
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <Grid className="h-5 w-5" />
          </button>
          <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template._id} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold">{template.name}</h3>
              <p className="text-gray-400 text-sm mt-1">Category: {template.category}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  className="text-red-500 hover:text-red-400"
                  onClick={() => handleDeleteTemplate(template._id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Create Template</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                value={template.content}
                onChange={(e) => setTemplate({ ...template, content: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                value={template.category}
                onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Templates;