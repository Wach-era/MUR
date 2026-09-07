import React from 'react';
import { useCart } from '../context/CartContext';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      {/* CARD IMAGE & BADGES */}
      <div className="relative aspect-square bg-black/40 overflow-hidden">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=500&auto=format&fit=crop&q=60'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

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

        {/* Condition Badge */}
        <span className="absolute bottom-3 left-3 text-[11px] font-medium px-2 py-0.5 rounded-md bg-black/50 text-gray-300 border border-white/10">
          {item.isPreOwned ? 'Pre-Owned' : 'Brand New'}
        </span>
      </div>

      {/* DETAILS & ACTION */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-purple-300 transition-colors">
            {item.title}
          </h3>
          <p className="text-purple-300/70 text-xs font-medium mt-1">
            {item.artist}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-purple-900/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block">Price</span>
            <span className="text-lg font-extrabold text-white">
              Ksh.{item.price?.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => addToCart(item)}
            className="btn-purple !py-2 !px-3 text-xs flex items-center gap-1.5"
          >
            <span>+</span> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;