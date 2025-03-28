import React from 'react';
import { Calendar, Bell, Settings, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 shadow-md px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold text-white">Calendar Pro</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
          
          <button className="p-2 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white">
            <Settings className="h-5 w-5" />
          </button>
          
          <button className="flex items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;