import React from 'react';

const ItemDetailModal = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 z-[1300] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl mx-2 sm:mx-0 bg-[#140c24] border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h2>
            <p className="text-sm text-purple-300/70">{item.artist}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1.5 sm:p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Image */}
          <div className="aspect-square bg-black/40 rounded-xl overflow-hidden">
            <img 
              src={item.imageUrl || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&auto=format&fit=crop&q=60'} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Format & Price */}
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm">
                {item.format}
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                Ksh {item.price?.toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            <div>
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
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
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-sm">
                  ✍️ Autographed
                </span>
              )}
              {item.isPreOwned && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-sm">
                  📦 Pre-Owned
                </span>
              )}
            </div>

            {/* Genres */}
            {item.genre && item.genre.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Genres</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.genre.map((g, i) => (
                    <span key={i} className="text-xs text-purple-300/70 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Condition */}
            {(item.condition?.mediaGrade || item.condition?.sleeveGrade) && (
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Condition</h4>
                <div className="space-y-1 text-sm">
                  {item.condition.mediaGrade && item.condition.mediaGrade !== 'N/A' && (
                    <p><span className="text-purple-300/60">Media:</span> {item.condition.mediaGrade}</p>
                  )}
                  {item.condition.sleeveGrade && item.condition.sleeveGrade !== 'N/A' && (
                    <p><span className="text-purple-300/60">Sleeve:</span> {item.condition.sleeveGrade}</p>
                  )}
                </div>
              </div>
            )}

            {/* Details */}
            {(item.details?.label || item.details?.pressingInfo) && (
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Details</h4>
                <div className="space-y-1 text-sm">
                  {item.details.label && <p><span className="text-purple-300/60">Label:</span> {item.details.label}</p>}
                  {item.details.pressingInfo && <p><span className="text-purple-300/60">Pressing:</span> {item.details.pressingInfo}</p>}
                  {item.releaseYear && <p><span className="text-purple-300/60">Year:</span> {item.releaseYear}</p>}
                </div>
              </div>
            )}

            {/* Tracklist */}
            {item.details?.tracklist && item.details.tracklist.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Tracklist</h4>
                <ol className="list-decimal list-inside space-y-0.5 text-sm text-purple-200/80">
                  {item.details.tracklist.map((track, i) => (
                    <li key={i}>{track}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;