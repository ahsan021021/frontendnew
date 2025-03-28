import React from 'react';
import { History } from 'lucide-react';

function CsvHistory() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">CSV History</h2>
        <button className="btn-secondary">
          <History size={18} />
          Refresh History
        </button>
      </div>
      <div className="text-center text-gray-400 py-12">
        No CSV exports found. Start scraping and export your results to see them here.
      </div>
    </div>
  );
}

export default CsvHistory;