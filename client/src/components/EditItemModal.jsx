import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const EditItemModal = ({ item, isOpen, onClose, onItemUpdated }) => {
  const [formData, setFormData] = useState({ ...item });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        // Ensure nested objects exist
        condition: item.condition || { mediaGrade: 'N/A', sleeveGrade: 'N/A', description: '' },
        details: item.details || { label: '', pressingInfo: '', tracklist: [] },
        // Convert arrays to strings for form inputs
        genre: item.genre ? item.genre.join(', ') : '',
        tracklist: item.details?.tracklist ? item.details.tracklist.join(', ') : '',
      });
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    // Handle nested fields
    if (name.startsWith('condition.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        condition: {
          ...formData.condition,
          [field]: val
        }
      });
    } else if (name.startsWith('details.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        details: {
          ...formData.details,
          [field]: val
        }
      });
    } else {
      setFormData({ ...formData, [name]: val });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare payload
      const payload = {
        ...formData,
        // Convert comma-separated strings back to arrays
        genre: formData.genre ? formData.genre.split(',').map(g => g.trim()).filter(Boolean) : [],
        details: {
          ...formData.details,
          tracklist: formData.tracklist ? formData.tracklist.split(',').map(t => t.trim()).filter(Boolean) : [],
        },
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
      };
      
      // Remove the string versions before sending
      delete payload.tracklist;
      
      const res = await axios.put(`${API_URL}/api/items/${item._id}`, payload);
      onItemUpdated(res.data.data);
      onClose();
    } catch (err) {
      alert('Error updating item: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl mx-2 sm:mx-0 bg-[#140c24] border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white my-4 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
            <span>✏️</span>
            <span className="hidden xs:inline">Edit Item Details</span>
            <span className="xs:hidden">Edit Item</span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1.5 sm:p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Item title/artist preview */}
        <div className="mb-4 sm:mb-6 p-2.5 sm:p-3 bg-purple-950/30 rounded-xl border border-purple-500/20">
          <p className="text-xs text-purple-300/60">Editing</p>
          <p className="text-sm font-semibold text-white truncate">{item.title}</p>
          <p className="text-xs text-purple-300/70 truncate">{item.artist}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Basic Info - 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Title *</label>
              <input 
                name="title"
                value={formData.title || ''} 
                onChange={handleChange} 
                required
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Artist *</label>
              <input 
                name="artist"
                value={formData.artist || ''} 
                onChange={handleChange} 
                required
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Format, Price, Stock - 3 columns */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Format *</label>
              <select 
                name="format"
                value={formData.format || 'Vinyl'} 
                onChange={handleChange} 
                className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Vinyl">🎵 Vinyl</option>
                <option value="CD">💿 CD</option>
                <option value="Cassette">📼 Cassette</option>
                <option value="Photocard">🖼️ Photocard</option>
                <option value="Merchandise">👕 Merchandise</option>
                <option value="Poster">🖼️ Poster</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Price (Ksh) *</label>
              <input 
                name="price"
                type="number" 
                step="0.01" 
                required 
                value={formData.price || 0} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Stock Quantity *</label>
              <input 
                name="stockQuantity"
                type="number" 
                min="0"
                required 
                value={formData.stockQuantity || 0} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Genre & Release Year */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Genres (comma-separated)</label>
              <input 
                name="genre"
                type="text" 
                placeholder="Rock, Pop, Jazz" 
                value={formData.genre || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Release Year</label>
              <input 
                name="releaseYear"
                type="number" 
                placeholder="2024" 
                value={formData.releaseYear || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Image URL</label>
            <input 
              name="imageUrl"
              type="url" 
              placeholder="https://example.com/image.jpg" 
              value={formData.imageUrl || ''} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Condition Grades */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Media Grade</label>
              <select 
                name="condition.mediaGrade"
                value={formData.condition?.mediaGrade || 'N/A'} 
                onChange={handleChange} 
                className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Mint">Mint</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Very Good+">Very Good+</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Poor">Poor</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Sleeve Grade</label>
              <select 
                name="condition.sleeveGrade"
                value={formData.condition?.sleeveGrade || 'N/A'} 
                onChange={handleChange} 
                className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-purple-400"
              >
                <option value="Mint">Mint</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Very Good+">Very Good+</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Poor">Poor</option>
                <option value="N/A">N/A</option>
              </select>
            </div>
          </div>

          {/* Condition Description */}
          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Condition Description</label>
            <input 
              name="condition.description"
              type="text" 
              placeholder="Any additional condition notes..." 
              value={formData.condition?.description || ''} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Label</label>
              <input 
                name="details.label"
                type="text" 
                placeholder="Record label" 
                value={formData.details?.label || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Pressing Info</label>
              <input 
                name="details.pressingInfo"
                type="text" 
                placeholder="e.g. 1st Pressing, Limited Edition" 
                value={formData.details?.pressingInfo || ''} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Tracklist */}
          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Tracklist (comma-separated)</label>
            <input 
              name="tracklist"
              type="text" 
              placeholder="Song 1, Song 2, Song 3" 
              value={formData.tracklist || ''} 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer text-purple-300/80 hover:text-white transition-colors touch-target">
              <input 
                name="isPreOwned"
                type="checkbox" 
                checked={formData.isPreOwned || false} 
                onChange={handleChange} 
                className="w-4 h-4 accent-purple-600 bg-black/40 border-purple-500/30 rounded"
              /> 
              📦 Pre-Owned
            </label>
            <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer text-purple-300/80 hover:text-white transition-colors touch-target">
              <input 
                name="isSigned"
                type="checkbox" 
                checked={formData.isSigned || false} 
                onChange={handleChange} 
                className="w-4 h-4 accent-purple-600 bg-black/40 border-purple-500/30 rounded"
              /> 
              ✍️ Autographed
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 xs:gap-3 pt-2 sm:pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full xs:w-auto px-4 py-2.5 sm:py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-sm font-medium transition-all cursor-pointer touch-target"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full xs:w-auto px-4 py-2.5 sm:py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-purple-500/20 cursor-pointer touch-target disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;