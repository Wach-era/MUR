import React, { useState } from 'react';
import axios from 'axios';

const AddProductModal = ({ isOpen, onClose, onItemAdded }) => {
  const [formData, setFormData] = useState({
    title: '', artist: '', format: 'Vinyl', price: '', genre: '', imageUrl: '', isPreOwned: false, isSigned: false
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/items', {
        ...formData,
        price: parseFloat(formData.price),
        genre: formData.genre.split(',').map((g) => g.trim())
      });
      onItemAdded(res.data.data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#140c24] border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative text-white">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
        <h2 className="text-xl font-bold mb-4">➕ List New Item</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white" />
          <input type="text" placeholder="Artist" required value={formData.artist} onChange={(e) => setFormData({ ...formData, artist: e.target.value })} className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white" />
          
          <div className="grid grid-cols-2 gap-3">
            <select value={formData.format} onChange={(e) => setFormData({ ...formData, format: e.target.value })} className="bg-[#1c122e] border border-purple-500/30 rounded-xl p-2.5 text-sm text-white">
              <option value="Vinyl">Vinyl</option>
              <option value="CD">CD</option>
              <option value="Cassette">Cassette</option>
              <option value="Photocard">Photocard</option>
              <option value="Merchandise">Merchandise</option>
            </select>
            <input type="number" step="0.01" placeholder="Price ($)" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white" />
          </div>

          <input type="text" placeholder="Genres (comma-separated)" value={formData.genre} onChange={(e) => setFormData({ ...formData, genre: e.target.value })} className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white" />
          <input type="url" placeholder="Image URL" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white" />

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={formData.isPreOwned} onChange={(e) => setFormData({ ...formData, isPreOwned: e.target.checked })} /> Pre-Owned</label>
            <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="checkbox" checked={formData.isSigned} onChange={(e) => setFormData({ ...formData, isSigned: e.target.checked })} /> Autographed</label>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all cursor-pointer mt-4">
            Add to Vault
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;