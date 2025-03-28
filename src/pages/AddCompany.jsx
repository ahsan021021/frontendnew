import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios directly
import { Building2, Search, Plus, Trash2, Edit } from 'lucide-react';

export function AddCompany() {
  const [companies, setCompanies] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    state: '',
    city: '',
    description: '',
    postalCode: '',
    country: '',
  });

  const API_BASE_URL = 'http://82.180.137.7:5000/api'; // Define the API base URL

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const headers = { Authorization: `Bearer ${token}` }; // Set the Authorization header

      try {
        const response = await axios.get(`${API_BASE_URL}/companies`, { headers });
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  // Handle popup open
  const handleButtonClick = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  // Handle popup close
  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupContent(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding a company
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from localStorage
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/companies`, formData, { headers });
      setCompanies([...companies, response.data]); // Add the new company to the list
      setFormData({
        name: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        state: '',
        city: '',
        description: '',
        postalCode: '',
        country: '',
      }); // Reset the form
      closePopup(); // Close the popup
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Building2 size={32} className="text-indigo-500" />
          <h2 className="text-3xl font-bold text-white">Companies</h2>
        </div>
        <button
          onClick={() => handleButtonClick('add')}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Company</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search companies..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-4 px-6">Company Name</th>
              <th className="text-left py-4 px-6">Website</th>
              <th className="text-left py-4 px-6">Email</th>
              <th className="text-left py-4 px-6">Phone</th>
              <th className="text-left py-4 px-6">Location</th>
              <th className="text-right py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b border-gray-700 text-white">
                <td className="py-4 px-6">{company.name}</td>
                <td className="py-4 px-6">
                  <a
                    href={`https://${company.website}`}
                    className="text-indigo-400 hover:text-indigo-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.website}
                  </a>
                </td>
                <td className="py-4 px-6">{company.email}</td>
                <td className="py-4 px-6">{company.phone}</td>
                <td className="py-4 px-6">{`${company.city}, ${company.country}`}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-400 hover:text-blue-300 mr-3">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Add Company</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="Enter company name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
                  placeholder="Enter website URL"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  Add Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}