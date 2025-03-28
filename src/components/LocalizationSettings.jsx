import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function LocalizationSettings() {
  const [formData, setFormData] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '24',
    currency: 'USD',
  });

  // Fetch localization settings on page load
  useEffect(() => {
    const fetchLocalization = async () => {
      try {
        const response = await axios.get('http://82.180.137.7:5000/api/localization', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }, // Include the token in the request
        });
        const settings = response.data;
        if (settings) {
          setFormData({
            language: settings.defaultLanguage || 'en',
            timezone: settings.timeZone || 'UTC',
            dateFormat: settings.dateFormat || 'MM/DD/YYYY',
            timeFormat: settings.timeFormat || '24',
            currency: settings.currency || 'USD',
          });
        }
      } catch (error) {
        console.error('Error fetching localization settings:', error);
        toast.error('Failed to fetch localization settings');
      }
    };

    fetchLocalization();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://82.180.137.7:5000/api/localization', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the request
        },
      });

      if (response.status === 200) {
        toast.success('Localization settings updated successfully!');
      } else {
        toast.error('Failed to update localization settings');
      }
    } catch (error) {
      console.error('Error updating localization settings:', error);
      toast.error('An error occurred while updating localization settings');
    }
  };

  return (
    <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold text-white mb-8">Localization Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label htmlFor="language" className="block text-sm font-medium text-gray-200 mb-2">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white 
                       transition-all duration-200 ease-in-out
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       hover:border-gray-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
            </select>
          </div>

          <div className="group">
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-200 mb-2">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white 
                       transition-all duration-200 ease-in-out
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       hover:border-gray-500"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time (EST)</option>
              <option value="CST">Central Time (CST)</option>
              <option value="MST">Mountain Time (MST)</option>
              <option value="PST">Pacific Time (PST)</option>
            </select>
          </div>

          <div className="group">
            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-200 mb-2">
              Date Format
            </label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white 
                       transition-all duration-200 ease-in-out
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       hover:border-gray-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div className="group">
            <label htmlFor="timeFormat" className="block text-sm font-medium text-gray-200 mb-2">
              Time Format
            </label>
            <select
              id="timeFormat"
              name="timeFormat"
              value={formData.timeFormat}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white 
                       transition-all duration-200 ease-in-out
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       hover:border-gray-500"
            >
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </div>

          <div className="group">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-200 mb-2">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white 
                       transition-all duration-200 ease-in-out
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       hover:border-gray-500"
            >
              <option value="USD">US Dollar (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="JPY">Japanese Yen (JPY)</option>
              <option value="AUD">Australian Dollar (AUD)</option>
            </select>
          </div>

          <div className="flex justify-end pt-6">
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

export default LocalizationSettings;