import React from 'react';

function StageCard({ stage, onClick }) {
  return (
    <div 
      className="bg-[#2a2a2a] rounded-xl p-4 md:p-6 border border-red-900/30 cursor-pointer hover:border-red-500 transition"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${stage.id === '1' ? 'bg-blue-500' : 'bg-green-500'}`} />
          <h3 className="text-base md:text-lg font-semibold truncate">{stage.name}</h3>
        </div>
        <div className="text-xs md:text-sm text-gray-400 whitespace-nowrap ml-2">
          {stage.opportunities} Opportunities
        </div>
      </div>
      <div className="text-xl md:text-2xl font-bold text-red-500">
        Rs{stage.value.toLocaleString()}
      </div>
    </div>
  );
}

export default StageCard;