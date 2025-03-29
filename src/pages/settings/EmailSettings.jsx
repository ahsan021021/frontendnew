import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function EmailSettings() {
  const [formData, setFormData] = useState({
    smtpServer: '',
    port: '',
    security: 'tls',
    fromName: '',
    fromEmail: '',
    emailPassword: '',
  });

  // Fetch current email settings when the page loads
  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const response = await axios.get('http://82.180.137.7:5000/api/email-settings', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          const settings = response.data;
          setFormData({
            smtpServer: settings.smtpServer || '',
            port: settings.port || '',
            security: settings.security || 'tls',
            fromName: settings.fromName || '',
            fromEmail: settings.fromEmail || '',
            emailPassword: settings.emailPassword || '',
          });
        }
      } catch (error) {
        console.error('Error fetching email settings:', error);
        toast.error('Failed to fetch email settings. Please try again.');
      }
    };

    fetchEmailSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to update email settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://82.180.137.7:5000/api/email-settings', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success('Email settings updated successfully!');
      } else {
        toast.error('Failed to update email settings');
      }
    } catch (error) {
      console.error('Error updating email settings:', error);
      toast.error('An error occurred while updating email settings');
    }
  };

  // Handle testing the email connection
  const handleTestConnection = async () => {
    try {
      const response = await axios.post('http://82.180.137.7:5000/api/email-settings/test', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        toast.success('Test email sent successfully!');
      } else {
        toast.error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error testing email connection:', error);
      toast.error('An error occurred while testing the email connection');
    }
  };

  return (
    <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold text-white mb-8">Email Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-medium text-white mb-4">SMTP Configuration</h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="group">
                  <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-200 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    name="smtpServer"
                    id="smtpServer"
                    placeholder="smtp.example.com"
                    value={formData.smtpServer}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label htmlFor="port" className="block text-sm font-medium text-gray-200 mb-2">
                    Port
                  </label>
                  <input
                    type="text"
                    name="port"
                    id="port"
                    placeholder="587"
                    value={formData.port}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label htmlFor="security" className="block text-sm font-medium text-gray-200 mb-2">
                    Security
                  </label>
                  <select
                    id="security"
                    name="security"
                    value={formData.security}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  >
                    <option value="none">None</option>
                    <option value="ssl">SSL</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-4">Sender Information</h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="group">
                  <label htmlFor="fromName" className="block text-sm font-medium text-gray-200 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    name="fromName"
                    id="fromName"
                    placeholder="Company Name"
                    value={formData.fromName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-200 mb-2">
                    From Email
                  </label>
                  <input
                    type="email"
                    name="fromEmail"
                    id="fromEmail"
                    placeholder="noreply@example.com"
                    value={formData.fromEmail}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    Email Password
                  </label>
                  <input
                    type="password"
                    name="emailPassword"
                    id="emailPassword"
                    placeholder="••••••••"
                    value={formData.emailPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium
                       transform transition-all duration-200 ease-in-out
                       hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmailSettings;