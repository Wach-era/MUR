import React from 'react';

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedFormat,
  setSelectedFormat,
  conditionFilter,
  setConditionFilter,
}) => {
  return (
    <div className="glass-card rounded-2xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Live Search Input */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search artist, album title, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/50 border border-purple-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
        />
        <span className="absolute left-3.5 top-2.5 text-purple-400 text-sm">🔍</span>
      </div>

      {/* Format & Condition Selectors */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        {/* Format Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Format:</label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-[#160e24] text-white border border-purple-500/30 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-purple-400 transition-all cursor-pointer"
          >
            <option value="All" className="bg-[#160e24] text-white">All Formats</option>
            <option value="Vinyl" className="bg-[#160e24] text-white">Vinyls</option>
            <option value="CD" className="bg-[#160e24] text-white">CDs</option>
            <option value="Cassette" className="bg-[#160e24] text-white">Cassettes</option>
            <option value="Photocard" className="bg-[#160e24] text-white">Photocards</option>
            <option value="Merchandise" className="bg-[#160e24] text-white">Merchandise</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Condition:</label>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-[#160e24] text-white border border-purple-500/30 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-purple-400 transition-all cursor-pointer"
          >
            <option value="All" className="bg-[#160e24] text-white">All Items</option>
            <option value="New" className="bg-[#160e24] text-white">Brand New</option>
            <option value="PreOwned" className="bg-[#160e24] text-white">Pre-Owned</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;