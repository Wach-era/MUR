import React from 'react';

const ItemDetailModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl mx-2 sm:mx-0 bg-[#140c24] border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white my-4 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with prominent close button */}
        <div className="flex justify-between items-start gap-3 mb-4 sticky top-0 bg-[#140c24]/95 backdrop-blur-sm z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 -mt-4 sm:-mt-6 rounded-t-2xl border-b border-purple-900/30">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-white truncate">{item.title}</h2>
            <p className="text-xs sm:text-sm text-purple-300/70 truncate">{item.artist}</p>
          </div>
          <button 
            onClick={onClose} 
            className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-white text-xl sm:text-2xl transition-all duration-200 flex items-center justify-center touch-target border border-purple-500/30 hover:border-purple-400 shadow-lg shadow-purple-500/20"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2">
          {/* Image */}
          <div className="aspect-square bg-black/40 rounded-xl overflow-hidden">
            <img 
              src={item.imageUrl || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&auto=format&fit=crop&q=60'} 
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Details */}
          <div className="space-y-3 sm:space-y-4">
            {/* Format & Price */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs sm:text-sm font-medium">
                {item.format}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">
                Ksh {item.price?.toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            <div>
              <span className={`inline-block px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${
                item.stockQuantity > 0 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {item.stockQuantity > 0 ? `✅ In Stock (${item.stockQuantity} available)` : '🚫 Sold Out'}
              </span>
            </div>

            {/* Signed & Pre-owned */}
            <div className="flex flex-wrap gap-2">
              {item.isSigned && (
                <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs sm:text-sm font-medium">
                  ✍️ Autographed
                </span>
              )}
              {item.isPreOwned && (
                <span className="px-3 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs sm:text-sm font-medium">
                  📦 Pre-Owned
                </span>
              )}
            </div>

            {/* Genres */}
            {item.genre && item.genre.length > 0 && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Genres</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.genre.map((g, i) => (
                    <span key={i} className="text-[10px] sm:text-xs text-purple-300/70 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Release Year */}
            {item.releaseYear && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">Release Year</h4>
                <p className="text-sm sm:text-base text-white">{item.releaseYear}</p>
              </div>
            )}

            {/* Condition */}
            {(item.condition?.mediaGrade || item.condition?.sleeveGrade || item.condition?.description) && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Condition</h4>
                <div className="space-y-1 text-sm bg-black/20 p-2 sm:p-3 rounded-xl border border-purple-500/10">
                  {item.condition.mediaGrade && item.condition.mediaGrade !== 'N/A' && (
                    <p className="text-xs sm:text-sm"><span className="text-purple-300/60">Media:</span> {item.condition.mediaGrade}</p>
                  )}
                  {item.condition.sleeveGrade && item.condition.sleeveGrade !== 'N/A' && (
                    <p className="text-xs sm:text-sm"><span className="text-purple-300/60">Sleeve:</span> {item.condition.sleeveGrade}</p>
                  )}
                  {item.condition.description && (
                    <p className="text-xs text-purple-300/50 mt-1 italic">{item.condition.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Details */}
            {(item.details?.label || item.details?.pressingInfo) && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Details</h4>
                <div className="space-y-1 text-sm bg-black/20 p-2 sm:p-3 rounded-xl border border-purple-500/10">
                  {item.details.label && <p className="text-xs sm:text-sm"><span className="text-purple-300/60">Label:</span> {item.details.label}</p>}
                  {item.details.pressingInfo && <p className="text-xs sm:text-sm"><span className="text-purple-300/60">Pressing:</span> {item.details.pressingInfo}</p>}
                </div>
              </div>
            )}

            {/* Tracklist */}
            {item.details?.tracklist && item.details.tracklist.length > 0 && (
              <div>
                <h4 className="text-[10px] sm:text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Tracklist</h4>
                <ol className="list-decimal list-inside space-y-0.5 text-xs sm:text-sm text-purple-200/80 bg-black/20 p-2 sm:p-3 rounded-xl border border-purple-500/10">
                  {item.details.tracklist.map((track, i) => (
                    <li key={i} className="break-words">{track}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Bottom close button for mobile */}
        <div className="mt-6 pt-4 border-t border-purple-900/30 sm:hidden">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md shadow-purple-500/20 touch-target"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;