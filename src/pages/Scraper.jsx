import React, { useState } from 'react';
import { Search, RotateCcw, MapPin, Phone, Globe, Star, Download } from 'lucide-react';

function Scraper() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([
    {
      id: 1,
      name: "Joe's Coffee Shop",
      address: "123 Main St, New York, NY",
      phone: "(555) 123-4567",
      website: "www.joescoffee.com",
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: "Central Park Cafe",
      address: "456 Park Ave, New York, NY",
      phone: "(555) 987-6543",
      website: "www.centralparkc.com",
      rating: 4.8,
      reviews: 256
    }
  ]);

  const handleStartScraping = () => {
    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-6">Configure Your Scraper</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Keywords (businesses, services, etc.)
            </label>
            <input
              type="text"
              placeholder="Enter a keyword and press Enter"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Locations (cities, neighborhoods, etc.)
            </label>
            <input
              type="text"
              placeholder="Enter a location and press Enter"
              className="input-field"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button className="btn-secondary flex-1">
              <RotateCcw size={18} />
              Reset
            </button>
            <button 
              className={`btn-primary flex-1 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              onClick={handleStartScraping}
              disabled={isLoading}
            >
              <Search size={18} />
              {isLoading ? 'Scraping...' : 'Start Scraping'}
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Scraping Results</h2>
          <button className="btn-secondary">
            <Download size={18} />
            Export to CSV
          </button>
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 px-4">Business Name</th>
                  <th className="pb-3 px-4">Address</th>
                  <th className="pb-3 px-4">Contact</th>
                  <th className="pb-3 px-4">Rating</th>
                  <th className="pb-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium">{result.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {result.address}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          {result.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-gray-400" />
                          {result.website}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-yellow-500" />
                        <span>{result.rating}</span>
                        <span className="text-gray-400">({result.reviews} reviews)</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            No results yet. Configure your scraper and start scraping to see results here.
          </div>
        )}
      </div>
    </div>
  );
}

export default Scraper;