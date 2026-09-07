import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
      const res = await axios.get('/api/requests/my-requests', {
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

      await axios.post('/api/requests', payload, {
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
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">✅ {status}</span>;
      case 'Not Met / Unavailable':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">❌ Not Met</span>;
      case 'Pending':
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">🕐 Pending</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#140c24] border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative text-white max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-white">📦 Import Requests</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-3 border-b border-purple-900/40 my-3">
          <button
            onClick={() => setActiveTab('new')}
            className={`pb-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'new'
                ? 'border-b-2 border-amber-400 text-amber-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Submit Request
          </button>
          <button
            onClick={() => setActiveTab('my-requests')}
            className={`pb-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'my-requests'
                ? 'border-b-2 border-amber-400 text-amber-300'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            My Submitted Requests ({myRequests.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'new' ? (
            <div>
              <p className="text-xs text-purple-300/70 mb-4">
                Can't find what you're looking for? Tell us what you need and we'll import it!
              </p>

              {statusMsg && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold">{statusMsg}</div>}
              {errorMsg && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold">{errorMsg}</div>}

              <form onSubmit={handleSubmit} className="space-y-3">
                <input 
                  name="artist" 
                  placeholder="Artist Name" 
                  required 
                  value={formData.artist}
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
                />
                <input 
                  name="title" 
                  placeholder="Album / Merch Title" 
                  required 
                  value={formData.title}
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    name="format" 
                    value={formData.format} 
                    onChange={handleChange} 
                    className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Vinyl">Vinyl</option>
                    <option value="CD">CD</option>
                    <option value="Cassette">Cassette</option>
                    <option value="Photocard">Photocard</option>
                    <option value="Merchandise">Merchandise</option>
                  </select>

                  <select 
                    name="preferredCondition" 
                    value={formData.preferredCondition} 
                    onChange={handleChange} 
                    className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Any">Any Condition</option>
                    <option value="New">Brand New</option>
                    <option value="PreOwned">Pre-Owned</option>
                  </select>
                </div>

                <textarea 
                  name="notes" 
                  placeholder="Specific details (e.g. 1st Pressing, Size L, Year)" 
                  value={formData.notes}
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 h-20" 
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={onClose} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs font-semibold transition-all">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-md">Submit Request</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-3">
              {loadingRequests ? (
                <p className="text-center py-8 text-purple-300/60 text-xs">Loading your requests...</p>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-8 text-purple-300/60 text-xs">
                  <p>You haven't submitted any custom requests yet.</p>
                  <button 
                    onClick={() => setActiveTab('new')} 
                    className="mt-3 px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-xl font-semibold transition-all"
                  >
                    Create Your First Request
                  </button>
                </div>
              ) : (
                myRequests.map((req) => (
                  <div key={req._id} className="p-3 bg-black/30 border border-purple-500/20 rounded-xl flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">
                        {req.title || req.albumOrItemTitle}
                      </div>
                      <div className="text-xs text-purple-300/70">
                        {req.artist} • <span className="text-purple-400">{req.format}</span>
                      </div>
                      {(req.notes || req.additionalDetails) && (
                        <p className="text-[11px] text-gray-400 mt-1 italic">
                          "{req.notes || req.additionalDetails}"
                        </p>
                      )}
                    </div>
                    <div>
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