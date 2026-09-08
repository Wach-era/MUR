import React from 'react';
import { useCart } from '../context/CartContext';

const ItemCard = ({ item, onClick }) => {
  const { addToCart } = useCart();
  const isOutOfStock = item.stockQuantity === 0;

  const formatPrice = (price) => {
    return price?.toLocaleString('en-US');
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group h-full cursor-pointer hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* CARD IMAGE & BADGES */}
      <div className="relative aspect-square bg-black/40 overflow-hidden">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&auto=format&fit=crop&q=60'}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'opacity-50' : ''
          }`}
        />

        {/* SOLD OUT OVERLAY - Most prominent */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-500 bg-black/80 px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-red-500/50 shadow-lg shadow-red-500/20 rotate-[-15deg] tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Format Badge */}
        <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/60 backdrop-blur-md border border-purple-500/30 text-purple-200 text-[8px] sm:text-xs font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg">
          {item.format}
        </span>

        {/* Signed / Autograph Badge on Image */}
        {item.isSigned && (
          <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-amber-500/90 backdrop-blur-md text-black font-extrabold text-[8px] sm:text-[10px] uppercase tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-lg shadow-amber-500/20">
            ✍️ Autographed
          </span>
        )}

        {/* Stock Badge - Shows remaining stock or "Out of Stock" */}
        <span className={`absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-[8px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md border ${
          isOutOfStock 
            ? 'bg-red-500/80 text-white border-red-400' 
            : 'bg-black/50 text-gray-300 border-white/10'
        }`}>
          {isOutOfStock ? '🚫 Out of Stock' : `${item.stockQuantity} left`}
        </span>

        {/* Low Stock Warning */}
        {!isOutOfStock && item.stockQuantity <= 3 && (
          <span className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-black px-1.5 sm:px-2 py-0.5 rounded-md animate-pulse">
            Only {item.stockQuantity} left!
          </span>
        )}
      </div>

      {/* DETAILS & ACTION */}
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className={`font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-purple-300 transition-colors ${
            isOutOfStock ? 'text-gray-400' : 'text-white'
          }`}>
            {item.title}
          </h3>
          <p className={`text-[10px] sm:text-xs font-medium mt-0.5 sm:mt-1 ${
            isOutOfStock ? 'text-gray-500' : 'text-purple-300/70'
          }`}>
            {item.artist}
          </p>
        </div>

        {/* Genres & Autograph Badge - Clickable area */}
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          {item.isSigned && (
            <span className="inline-block text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-500/30">
              ✍️ Autographed
            </span>
          )}
          {item.genre && item.genre.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.genre.slice(0, 3).map((g, i) => (
                <span key={i} className="text-[7px] sm:text-[8px] text-purple-300/60 bg-purple-500/10 px-1.5 py-0.5 rounded-full border border-purple-500/20">
                  {g}
                </span>
              ))}
              {item.genre.length > 3 && (
                <span className="text-[7px] sm:text-[8px] text-purple-300/40">
                  +{item.genre.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-purple-900/30 flex items-center justify-between">
          <div onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] sm:text-xs text-gray-400 block">Price</span>
            <span className={`text-base sm:text-lg font-extrabold ${
              isOutOfStock ? 'text-gray-500 line-through' : 'text-white'
            }`}>
              Ksh.{formatPrice(item.price)}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) addToCart(item);
            }}
            className={`!py-1.5 sm:!py-2 !px-2 sm:!px-3 text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 touch-target ${
              isOutOfStock 
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/30' 
                : 'btn-purple'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              '🚫 Sold'
            ) : (
              <>
                <span className="text-sm sm:text-base">+</span> 
                <span className="hidden xs:inline">Add to Cart</span>
                <span className="xs:hidden">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;