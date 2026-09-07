import React from 'react';
import ItemCard from './ItemCard';

const CategoryRow = ({ title, formatKey, items, onViewAll }) => {
  const categoryItems = items.filter((item) => item.format === formatKey);

  if (categoryItems.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Category Section Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-purple-900/40">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>
        
        <button
          onClick={() => onViewAll(formatKey)}
          className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 font-semibold text-xs py-2 px-4 rounded-xl transition-all hover:text-white cursor-pointer flex items-center gap-1.5"
        >
          View All {formatKey}s <span>→</span>
        </button>
      </div>

      {/* Grid displaying up to 4 preview items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryItems.slice(0, 4).map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default CategoryRow;