import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

function ProfileSettings() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 py-8">
        <h3 className="text-2xl font-semibold leading-6 text-white mb-8">Profile Information</h3>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
            <div className="group">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-2">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                         transition-all duration-200 ease-in-out
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                         hover:border-gray-500"
              />
            </div>

            <div className="group">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-2">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                         transition-all duration-200 ease-in-out
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                         hover:border-gray-500"
              />
            </div>
          </div>

          <div className="group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                       transition-all duration-200 ease-in-out
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                       hover:border-gray-500"
            />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium leading-6 text-white mb-6">Change Password</h3>
              <div className="space-y-6">
                <div className="group">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-700 text-white placeholder-gray-400 
                             transition-all duration-200 ease-in-out
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50
                             hover:border-gray-500"
                  />
                </div>

                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
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

export default ProfileSettings;