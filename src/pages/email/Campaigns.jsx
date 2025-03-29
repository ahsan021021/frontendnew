import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import Select from 'react-select/creatable';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';

function Campaigns() {
  const [showForm, setShowForm] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    template: '',
    recipients: [],
    scheduledDate: '',
  });
  const [templates, setTemplates] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvColumns, setCsvColumns] = useState([]);
  const [selectedEmailColumn, setSelectedEmailColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create axios instance with token from localStorage
  const axiosInstance = axios.create({
    baseURL: 'http://82.180.137.7:5000/api',
  });

  // Add a request interceptor to include the token in every request
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

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

  // Fetch templates from the backend
  const fetchTemplates = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setError(error.response?.data?.message || 'Failed to fetch templates. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscribers from the backend
  const fetchSubscribers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/subscribers');
      setSubscribers(response.data);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      setError(error.response?.data?.message || 'Failed to fetch subscribers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
    fetchSubscribers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!campaign.name || !campaign.subject || !campaign.content || !campaign.template || campaign.recipients.length === 0) {
      setError('Please fill in all required fields and select at least one recipient.');
      setLoading(false);
      return;
    }

    if (new Date(campaign.scheduledDate) < new Date()) {
      setError('Scheduled date cannot be in the past.');
      setLoading(false);
      return;
    }

    try {
      const campaignData = {
        ...campaign,
        recipients: campaign.recipients.map((recipient) => recipient.value || recipient.label),
      };

      if (campaign.id) {
        // Update existing campaign
        await axiosInstance.put(`/campaigns/${campaign.id}`, campaignData);
      } else {
        // Create new campaign
        await axiosInstance.post('/campaigns', campaignData);
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
    setCampaign({
      ...campaign,
      id: campaign._id,
      recipients: campaign.recipients.map((recipient) => ({
        value: recipient,
        label: recipient,
      })),
    });
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

  const handleSendCampaign = async (id) => {
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post(`/campaigns/${id}/send`);
      alert('Campaign sent successfully!');
    } catch (error) {
      console.error('Error sending campaign:', error);
      setError('Failed to send campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllRecipients = () => {
    setCampaign({
      ...campaign,
      recipients: subscribers.map((subscriber) => ({
        value: subscriber.email,
        label: subscriber.email,
      })),
    });
  };

  const handleRecipientChange = (selectedOptions) => {
    setCampaign({ ...campaign, recipients: selectedOptions });
  };

  const handleCSVImport = (acceptedFiles) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setCsvData(results.data);
        setCsvColumns(Object.keys(results.data[0]));
        setShowCSVModal(false);
        setShowMappingModal(true);
      },
    });
  };

  const handleMappingSubmit = () => {
    const emails = csvData
      .map((row) => row[selectedEmailColumn])
      .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emails.length === 0) {
      alert('No valid email addresses found in the selected column.');
      return;
    }

    const newRecipients = emails.map((email) => ({
      value: email,
      label: email,
    }));

    setCampaign({ ...campaign, recipients: [...campaign.recipients, ...newRecipients] });
    setShowMappingModal(false);
  };

  const recipientOptions = subscribers.map((subscriber) => ({
    value: subscriber.email,
    label: subscriber.email,
  }));

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
                      className="text-green-400 hover:text-green-300"
                      onClick={() => handleSendCampaign(campaign._id)}
                    >
                      Send Now
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

      {/* Form Modal */}
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
                <label className="block text-sm font-medium mb-1">Template</label>
                <select
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  value={campaign.template}
                  onChange={(e) => setCampaign({ ...campaign, template: e.target.value })}
                  required
                >
                  <option value="">Select Template</option>
                  {templates.map((template) => (
                    <option key={template._id} value={template._id}>
                      {template.name}
                    </option>
                  ))}
                </select>
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
              <div>
                <label className="block text-sm font-medium mb-1">Recipients</label>
                <Select
                  isMulti
                  options={recipientOptions}
                  value={campaign.recipients}
                  onChange={handleRecipientChange}
                  placeholder="Type to search and select recipients..."
                  noOptionsMessage={() => 'No subscribers found'}
                />
                <button
                  type="button"
                  className="mt-2 text-blue-400 hover:text-blue-300"
                  onClick={handleSelectAllRecipients}
                >
                  Select All Recipients
                </button>
                <button
                  type="button"
                  className="mt-2 text-blue-400 hover:text-blue-300"
                  onClick={() => setShowCSVModal(true)}
                >
                  Import from CSV
                </button>
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

      {/* CSV Import Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Import Recipients from CSV</h3>
            <Dropzone onDrop={handleCSVImport}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-400">Drag & drop a CSV file here, or click to select a file</p>
                </div>
              )}
            </Dropzone>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                onClick={() => setShowCSVModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Map Email Column</h3>
            <select
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => setSelectedEmailColumn(e.target.value)}
              value={selectedEmailColumn}
            >
              <option value="">Select Email Column</option>
              {csvColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                onClick={() => setShowMappingModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                onClick={handleMappingSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;