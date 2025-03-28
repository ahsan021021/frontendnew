import React, { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import axios from 'axios';

function Campaigns() {
  const [showForm, setShowForm] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template: '',
    recipients: [],
    scheduledDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // Get the JWT token from local storage

  // Create axios instance with authorization token
  const axiosInstance = axios.create({
    baseURL: 'http://82.180.137.7:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch campaigns from the backend
  const fetchCampaigns = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/campaigns');
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.response?.data?.message || 'Failed to fetch campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!campaign.name || !campaign.subject || !campaign.content || campaign.recipients.length === 0) {
      setError('Please fill in all required fields and select at least one recipient.');
      setLoading(false);
      return;
    }

    try {
      if (campaign.id) {
        // Update existing campaign
        await axiosInstance.put(`/campaigns/${campaign.id}`, campaign);
      } else {
        // Create new campaign
        await axiosInstance.post('/campaigns', campaign);
      }

      resetForm();
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      setError('Failed to save campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCampaign({ name: '', subject: '', content: '', template: '', recipients: [], scheduledDate: '' });
    setShowForm(false);
  };

  const handleEditCampaign = (campaign) => {
    setCampaign({ ...campaign, id: campaign._id });
    setShowForm(true);
  };

  const handleDeleteCampaign = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this campaign?');
    if (!confirmDelete) return;

    setLoading(true);
    setError('');
    try {
      await axiosInstance.delete(`/campaigns/${id}`);
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Email Campaigns</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4">Campaign Name</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Recipients</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign._id} className="border-b border-gray-700">
                  <td className="py-4 px-4">{campaign.name}</td>
                  <td className="py-4 px-4">{campaign.status}</td>
                  <td className="py-4 px-4">{campaign.recipients.length}</td>
                  <td className="py-4 px-4 flex space-x-2">
                    <button
                      className="text-blue-400 hover:text-blue-300"
                      onClick={() => handleEditCampaign(campaign)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteCampaign(campaign._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-gray-700">
                <td className="py-4 px-4 text-gray-400" colSpan="4">
                  No campaigns created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{campaign.id ? 'Edit Campaign' : 'Create Campaign'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  value={campaign.name}
                  onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  value={campaign.subject}
                  onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  value={campaign.content}
                  onChange={(e) => setCampaign({ ...campaign, content: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Date</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  value={campaign.scheduledDate}
                  onChange={(e) => setCampaign({ ...campaign, scheduledDate: e.target.value })}
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
                  {campaign.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;