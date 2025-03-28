import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

function ExportManager() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Export Manager</h2>
          <p className="text-sm text-gray-400 mt-1">0 exports available</p>
        </div>
        <button className="btn-primary">
          <FileSpreadsheet size={18} />
          Export Selected
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter by Keyword:
          </label>
          <input
            type="text"
            placeholder="Enter keyword to filter"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Filter by Location:
          </label>
          <input
            type="text"
            placeholder="Enter location to filter"
            className="input-field"
          />
        </div>
      </div>

      <div className="text-center text-gray-400 py-12">
        No exports match your filter criteria.
      </div>
    </div>
  );
}

export default ExportManager;