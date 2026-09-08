import React from 'react';
import { useCart } from '../context/CartContext';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const isOutOfStock = item.stockQuantity === 0;

const formatPrice = (price) => {
  return price?.toLocaleString('en-US');
};

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      {/* CARD IMAGE & BADGES */}
      <div className="relative aspect-square bg-black/40 overflow-hidden">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&auto=format&fit=crop&q=60'}
          alt={item.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isOutOfStock ? 'opacity-50' : ''
          }`}
        />

        {/* SOLD OUT OVERLAY - Most prominent */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="text-3xl font-extrabold text-red-500 bg-black/80 px-6 py-3 rounded-2xl border-2 border-red-500/50 shadow-lg shadow-red-500/20 rotate-[-15deg] tracking-wider">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Format Badge */}
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-purple-500/30 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
          {item.format}
        </span>

        {/* Signed / Autograph Badge */}
        {item.isSigned && (
          <span className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-md text-black font-extrabold text-[10px] uppercase tracking-wider px-2 py-1 rounded-lg shadow-lg shadow-amber-500/20">
            ✍️ Autographed
          </span>
        )}

        {/* Stock Badge - Shows remaining stock or "Out of Stock" */}
        <span className={`absolute bottom-3 left-3 text-[11px] font-medium px-2 py-0.5 rounded-md border ${
          isOutOfStock 
            ? 'bg-red-500/80 text-white border-red-400' 
            : 'bg-black/50 text-gray-300 border-white/10'
        }`}>
          {isOutOfStock ? '🚫 Out of Stock' : `${item.stockQuantity} left`}
        </span>

        {/* Low Stock Warning */}
        {!isOutOfStock && item.stockQuantity <= 3 && (
          <span className="absolute bottom-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-black px-2 py-0.5 rounded-md animate-pulse">
            Only {item.stockQuantity} left!
          </span>
        )}
      </div>

      {/* DETAILS & ACTION */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className={`font-bold text-base leading-snug line-clamp-1 group-hover:text-purple-300 transition-colors ${
            isOutOfStock ? 'text-gray-400' : 'text-white'
          }`}>
            {item.title}
          </h3>
          <p className={`text-xs font-medium mt-1 ${
            isOutOfStock ? 'text-gray-500' : 'text-purple-300/70'
          }`}>
            {item.artist}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Price</span>
            <span className={`text-lg font-extrabold ${
              isOutOfStock ? 'text-gray-500 line-through' : 'text-white'
            }`}>
              Ksh.{formatPrice(item.price)}
            </span>
          </div>

          <button
            onClick={() => !isOutOfStock && addToCart(item)}
            className={`!py-2 !px-3 text-xs flex items-center gap-1.5 ${
              isOutOfStock 
                ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600/30' 
                : 'btn-purple'
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? (
              '🚫 Sold Out'
            ) : (
              <>
                <span>+</span> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;