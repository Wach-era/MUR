import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RequestModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'my-requests'
  const [formData, setFormData] = useState({
    artist: '',
    title: '',
    format: 'Vinyl',
    notes: '',
    preferredCondition: 'Any'
  });
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { token } = useAuth();

  // Memoized fetch handler so it can be called safely inside hooks and handlers
  const fetchMyRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const authToken = token || localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/requests/my-requests`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setMyRequests(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching user requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  }, [token]);

  // Fetch count immediately whenever modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMyRequests();
    }
  }, [isOpen, fetchMyRequests]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');

    try {
      const authToken = token || localStorage.getItem('token');

      const payload = {
        artist: formData.artist,
        title: formData.title,
        albumOrItemTitle: formData.title,
        format: formData.format,
        notes: formData.notes,
        additionalDetails: formData.notes,
        preferredCondition: formData.preferredCondition
      };

      await axios.post(`${API_URL}/api/requests`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });

      setStatusMsg('Request submitted! Switching to your requests...');
      setFormData({ artist: '', title: '', format: 'Vinyl', notes: '', preferredCondition: 'Any' });
      
      // Refresh list before tab transition
      await fetchMyRequests();

      setTimeout(() => {
        setStatusMsg('');
        setActiveTab('my-requests');
      }, 1200);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error submitting request. Please sign in again.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Met / Sourced':
      case 'Sourced/Shipped':
      case 'In Stock':
      case 'Fulfilled':
        return <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✅ {status}</span>;
      case 'Not Met / Unavailable':
        return <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">❌ Not Met</span>;
      case 'Pending':
      default:
        return <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">🕐 Pending</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg mx-2 sm:mx-0 bg-[#140c24] border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white max-h-[92vh] sm:max-h-[85vh] flex flex-col my-4"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>📦</span>
            <span className="hidden xs:inline">Import Requests</span>
            <span className="xs:hidden">Requests</span>
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1.5 sm:p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs - scrollable on mobile */}
        <div className="flex gap-2 sm:gap-3 border-b border-purple-900/40 my-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-2 px-1 sm:px-0 text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'new'
                ? 'border-b-2 border-amber-400 text-amber-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ✏️ Submit Request
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`pb-2 px-1 sm:px-0 text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'my-requests'
                ? 'border-b-2 border-amber-400 text-amber-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 My Requests ({myRequests.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-0 sm:pr-1">
          {activeTab === 'new' ? (
            <div>
              <p className="text-[10px] sm:text-xs text-purple-300/70 mb-3 sm:mb-4">
                Can't find what you're looking for? Tell us what you need and we'll import it!
              </p>

              {statusMsg && (
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-[10px] sm:text-xs font-semibold">
                  {statusMsg}
                </div>
              )}
              {errorMsg && (
                <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-[10px] sm:text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-purple-300/70 mb-1">Artist Name *</label>
                  <input 
                    name="artist" 
                    placeholder="Enter artist name" 
                    required 
                    value={formData.artist}
                    onChange={handleChange} 
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-purple-300/70 mb-1">Album / Merch Title *</label>
                  <input 
                    name="title" 
                    placeholder="Enter album or merchandise title" 
                    required 
                    value={formData.title}
                    onChange={handleChange} 
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors" 
                  />
                </div>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-purple-300/70 mb-1">Format</label>
                    <select 
                      name="format" 
                      value={formData.format} 
                      onChange={handleChange} 
                      className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
                    >
                      <option value="Vinyl">🎵 Vinyl</option>
                      <option value="CD">💿 CD</option>
                      <option value="Cassette">📼 Cassette</option>
                      <option value="Photocard">🖼️ Photocard</option>
                      <option value="Merchandise">👕 Merchandise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-purple-300/70 mb-1">Condition</label>
                    <select 
                      name="preferredCondition" 
                      value={formData.preferredCondition} 
                      onChange={handleChange} 
                      className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white focus:outline-none focus:border-purple-400 transition-colors cursor-pointer"
                    >
                      <option value="Any">Any Condition</option>
                      <option value="New">✨ Brand New</option>
                      <option value="PreOwned">📦 Pre-Owned</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-purple-300/70 mb-1">Additional Details</label>
                  <textarea 
                    name="notes" 
                    placeholder="Specific details (e.g. 1st Pressing, Size L, Year)" 
                    value={formData.notes}
                    onChange={handleChange} 
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors h-16 sm:h-20" 
                  />
                </div>

                <div className="flex flex-col-reverse xs:flex-row justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="w-full xs:w-auto px-4 py-2.5 sm:py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-all touch-target"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="w-full xs:w-auto px-4 py-2.5 sm:py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20 touch-target"
                  >
                    📤 Submit Request
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {loadingRequests ? (
                <p className="text-center py-8 text-purple-300/60 text-xs">Loading your requests...</p>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-8 text-purple-300/60 text-xs">
                  <p>You haven't submitted any custom requests yet.</p>
                  <button 
                    onClick={() => setActiveTab('new')} 
                    className="mt-3 px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-xl font-semibold transition-all touch-target"
                  >
                    Create Your First Request
                  </button>
                </div>
              ) : (
                myRequests.map((req) => (
                  <div key={req._id} className="p-2.5 sm:p-3 bg-black/30 border border-purple-500/20 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex-1 w-full min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {req.title || req.albumOrItemTitle}
                      </div>
                      <div className="text-[10px] sm:text-xs text-purple-300/70">
                        {req.artist} • <span className="text-purple-400">{req.format}</span>
                      </div>
                      {(req.notes || req.additionalDetails) && (
                        <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 italic truncate">
                          "{req.notes || req.additionalDetails}"
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 self-start sm:self-center">
                      {getStatusBadge(req.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestModal;