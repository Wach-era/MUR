import React from 'react';
import ItemCard from './ItemCard';

const CategoryRow = ({ title, formatKey, items, onViewAll, onItemClick }) => {
  const categoryItems = items.filter((item) => item.format === formatKey);

  if (categoryItems.length === 0) return null;

  return (
    <section className="mb-8 sm:mb-12">
      {/* Category Section Header - responsive */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-purple-900/40">
        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
          <span className="text-[10px] sm:text-xs font-normal text-purple-400/60">
            ({categoryItems.length})
          </span>
        </h2>
        
        <button
          onClick={() => onViewAll(formatKey)}
          className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 font-semibold text-[10px] sm:text-xs py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-xl transition-all hover:text-white cursor-pointer flex items-center gap-1 touch-target"
        >
          <span className="hidden xs:inline">View All</span>
          <span className="xs:hidden">All</span>
          <span className="hidden xs:inline">{formatKey}s</span>
          <span>→</span>
        </button>
      </div>

      {/* Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="block sm:hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {categoryItems.slice(0, 6).map((item) => (
            <div key={item._id} className="min-w-[160px] max-w-[200px] snap-start flex-shrink-0">
              <ItemCard item={item} onClick={onItemClick} />
            </div>
          ))}
        </div>
        {categoryItems.length > 6 && (
          <button
            onClick={() => onViewAll(formatKey)}
            className="w-full mt-3 text-center text-xs text-purple-400 hover:text-purple-300 font-medium py-2 border border-purple-500/20 rounded-xl bg-purple-950/20 transition-colors touch-target"
          >
            See all {categoryItems.length} {formatKey}s →
          </button>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categoryItems.slice(0, 4).map((item) => (
          <ItemCard key={item._id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </section>
  );
};

export default CategoryRow;