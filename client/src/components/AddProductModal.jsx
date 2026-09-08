import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AddProductModal = ({ isOpen, onClose, onItemAdded }) => {
  const [formData, setFormData] = useState({
    title: '', 
    artist: '', 
    format: 'Vinyl', 
    price: '', 
    stockQuantity: 1,
    genre: '', 
    releaseYear: '',
    imageUrl: '', 
    isPreOwned: false, 
    isSigned: false,
    mediaGrade: 'N/A',
    sleeveGrade: 'N/A',
    tracklist: '',
    pressingInfo: '',
    label: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
  ...formData,
  price: parseFloat(formData.price),
  stockQuantity: parseInt(formData.stockQuantity),
  genre: formData.genre.split(',').map((g) => g.trim()).filter(Boolean),
  releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : undefined,
  condition: {
    mediaGrade: formData.mediaGrade || 'N/A',
    sleeveGrade: formData.sleeveGrade || 'N/A',
    description: formData.conditionDescription || '',
  },
  details: {
    label: formData.label || undefined,
    pressingInfo: formData.pressingInfo || undefined,
    tracklist: formData.tracklist ? formData.tracklist.split(',').map(t => t.trim()).filter(Boolean) : undefined,
  }
};
      
      const res = await axios.post(`${API_URL}/api/items`, payload);
      onItemAdded(res.data.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error adding item: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl mx-2 sm:mx-0 bg-[#140c24] border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
            ➕ List New Item
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Basic Info - 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Title *</label>
              <input 
                type="text" 
                placeholder="Album/Item title" 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Artist *</label>
              <input 
                type="text" 
                placeholder="Artist name" 
                required 
                value={formData.artist} 
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Format, Price, Stock - 3 columns */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Format *</label>
              <select 
                value={formData.format} 
                onChange={(e) => setFormData({ ...formData, format: e.target.value })} 
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
                type="number" 
                step="0.01" 
                placeholder="2500" 
                required 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Stock Quantity *</label>
              <input 
                type="number" 
                min="0"
                placeholder="1" 
                required 
                value={formData.stockQuantity} 
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Genre & Release Year */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Genres</label>
              <input 
                type="text" 
                placeholder="Rock, Pop, Jazz (comma-separated)" 
                value={formData.genre} 
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Release Year</label>
              <input 
                type="number" 
                placeholder="2024" 
                value={formData.releaseYear} 
                onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Image URL</label>
            <input 
              type="url" 
              placeholder="https://example.com/image.jpg" 
              value={formData.imageUrl} 
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Condition Grades */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Media Grade</label>
              <select 
                value={formData.mediaGrade} 
                onChange={(e) => setFormData({ ...formData, mediaGrade: e.target.value })} 
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
                value={formData.sleeveGrade} 
                onChange={(e) => setFormData({ ...formData, sleeveGrade: e.target.value })} 
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

          {/* Details */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Label</label>
              <input 
                type="text" 
                placeholder="Record label" 
                value={formData.label} 
                onChange={(e) => setFormData({ ...formData, label: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-300/70 mb-1">Pressing Info</label>
              <input 
                type="text" 
                placeholder="e.g. 1st Pressing, Limited Edition" 
                value={formData.pressingInfo} 
                onChange={(e) => setFormData({ ...formData, pressingInfo: e.target.value })} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </div>
          </div>

          {/* Tracklist */}
          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Tracklist</label>
            <input 
              type="text" 
              placeholder="Song 1, Song 2, Song 3 (comma-separated)" 
              value={formData.tracklist} 
              onChange={(e) => setFormData({ ...formData, tracklist: e.target.value })} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer text-purple-300/80 hover:text-white transition-colors touch-target">
              <input 
                type="checkbox" 
                checked={formData.isPreOwned} 
                onChange={(e) => setFormData({ ...formData, isPreOwned: e.target.checked })} 
                className="w-4 h-4 accent-purple-600 bg-black/40 border-purple-500/30 rounded"
              /> 
              📦 Pre-Owned
            </label>
            <label className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer text-purple-300/80 hover:text-white transition-colors touch-target">
              <input 
                type="checkbox" 
                checked={formData.isSigned} 
                onChange={(e) => setFormData({ ...formData, isSigned: e.target.checked })} 
                className="w-4 h-4 accent-purple-600 bg-black/40 border-purple-500/30 rounded"
              /> 
              ✍️ Autographed
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 sm:py-3.5 rounded-xl transition-all shadow-md shadow-emerald-500/20 touch-target mt-2"
          >
            Add to Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;