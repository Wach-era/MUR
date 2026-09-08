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
    <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6 sm:mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
      {/* Live Search Input - Full width on mobile */}
      <div className="relative w-full lg:w-96">
        <input
          type="text"
          placeholder="Search artist, album, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black/50 border border-purple-500/30 rounded-xl py-2.5 sm:py-3 pl-10 pr-4 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all touch-target"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 text-sm">🔍</span>
      </div>

      {/* Format & Condition Selectors - Responsive */}
      <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-2 sm:gap-3 w-full lg:w-auto">
        {/* Format Filter */}
        <div className="flex-1 xs:flex-none flex items-center gap-2 min-w-[140px]">
          <label className="text-[10px] sm:text-xs font-semibold text-purple-300 uppercase tracking-wider whitespace-nowrap">
            Format:
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="flex-1 xs:flex-none bg-[#160e24] text-white border border-purple-500/30 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-400 transition-all cursor-pointer touch-target"
          >
            <option value="All" className="bg-[#160e24] text-white">All</option>
            <option value="Vinyl" className="bg-[#160e24] text-white">🎵 Vinyl</option>
            <option value="CD" className="bg-[#160e24] text-white">💿 CD</option>
            <option value="Cassette" className="bg-[#160e24] text-white">📼 Cassette</option>
            <option value="Photocard" className="bg-[#160e24] text-white">🖼️ Photocard</option>
            <option value="Merchandise" className="bg-[#160e24] text-white">👕 Merch</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div className="flex-1 xs:flex-none flex items-center gap-2 min-w-[120px]">
          <label className="text-[10px] sm:text-xs font-semibold text-purple-300 uppercase tracking-wider whitespace-nowrap">
            Cond:
          </label>
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="flex-1 xs:flex-none bg-[#160e24] text-white border border-purple-500/30 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-400 transition-all cursor-pointer touch-target"
          >
            <option value="All" className="bg-[#160e24] text-white">All</option>
            <option value="New" className="bg-[#160e24] text-white">✨ New</option>
            <option value="PreOwned" className="bg-[#160e24] text-white">📦 Pre-Owned</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;