import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EditItemModal = ({ item, isOpen, onClose, onItemUpdated }) => {
  const [formData, setFormData] = useState({ ...item });

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/items/${item._id}`, formData);
      onItemUpdated(res.data.data);
      onClose();
    } catch (err) {
      alert('Error updating item.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#140c24] border border-purple-500/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">✏️ Edit Item Details</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-purple-300/80 mb-1">Title</label>
            <input 
              name="title" 
              value={formData.title || ''} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-purple-300/80 mb-1">Image URL</label>
            <input 
              name="imageUrl" 
              type="url"
              value={formData.imageUrl || ''} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-purple-300/80 mb-1">Price (Ksh)</label>
            <input 
              name="price" 
              type="number" 
              step="0.01" 
              value={formData.price || 0} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-sm font-medium text-purple-300/80 mb-1">Stock Quantity</label>
            <input 
              name="stockQuantity" 
              type="number" 
              value={formData.stockQuantity || 1} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Condition (Pre-owned checkbox) */}
          <div className="flex items-center gap-3">
            <input 
              name="isPreOwned" 
              type="checkbox" 
              checked={formData.isPreOwned || false} 
              onChange={handleChange} 
              className="w-4 h-4 accent-purple-600 bg-black/40 border-purple-500/30 rounded"
            />
            <label className="text-sm font-medium text-purple-300/80">This item is pre-owned</label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;