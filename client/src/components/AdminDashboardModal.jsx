import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboardModal = ({ isOpen, onClose, items = [], onItemDeleted, onEditItem, onItemUpdated }) => {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [decrementingId, setDecrementingId] = useState(null);
  const { token } = useAuth();

  const getAuthToken = useCallback(() => {
    return token || localStorage.getItem('token');
  }, [token]);

  const fetchCustomerRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const authToken = getAuthToken();
      const res = await axios.get('/api/requests/admin/all', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setRequests(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    
    if (activeTab === 'requests') {
      fetchCustomerRequests();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeTab, fetchCustomerRequests, onClose]);

  if (!isOpen) return null;

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item from inventory?')) return;
    try {
      const authToken = getAuthToken();
      await axios.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      onItemDeleted(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item.');
    }
  };

  const handleDecrementStock = async (itemId, currentStock) => {
    if (currentStock <= 0) {
      alert('This item is already out of stock!');
      return;
    }

    setDecrementingId(itemId);
    try {
      const authToken = getAuthToken();
      const res = await axios.patch(
        `/api/items/${itemId}/decrement`, 
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (res.data.success && onItemUpdated) {
        onItemUpdated(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decrement stock.');
    } finally {
      setDecrementingId(null);
    }
  };

  const handleStatusChange = async (reqId, newStatus) => {
    const previousRequests = [...requests];

    setRequests((prev) =>
      prev.map((r) => (r._id === reqId ? { ...r, status: newStatus } : r))
    );

    try {
      const authToken = getAuthToken();
      await axios.patch(`/api/requests/${reqId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch (err) {
      alert('Failed to update request status.');
      setRequests(previousRequests);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (statusFilter === 'All') return true;
    return req.status === statusFilter;
  });

  return (
    <div 
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-5xl bg-[#120a1f] border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative text-white max-h-[80vh] flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-purple-900/40">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>⚙️</span> Admin Control Panel
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1 transition-colors rounded-lg hover:bg-purple-900/30" 
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-purple-900/40 my-4">
          <button 
            className={`pb-2.5 px-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'inventory' 
                ? 'border-b-2 border-purple-400 text-purple-300' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            Manage Inventory ({items.length})
          </button>
          <button 
            className={`pb-2.5 px-2 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'requests' 
                ? 'border-b-2 border-purple-400 text-purple-300' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Customer Requests ({requests.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'inventory' ? (
            <div className="overflow-x-auto">
              {items.length === 0 ? (
                <p className="text-center py-8 text-purple-300/60 text-sm">No inventory items available.</p>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-purple-900/40 text-purple-300/80 font-semibold text-xs uppercase">
                      <th className="py-3 px-2">Title</th>
                      <th className="py-3 px-2">Artist</th>
                      <th className="py-3 px-2">Format</th>
                      <th className="py-3 px-2">Price</th>
                      <th className="py-3 px-2">Stock</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/30">
                    {items.map((item) => (
                      <tr key={item._id} className="hover:bg-purple-900/10 transition-colors">
                        <td className="py-3 px-2 font-bold text-white">{item.title}</td>
                        <td className="py-3 px-2 text-purple-200/80">{item.artist}</td>
                        <td className="py-3 px-2 text-purple-200/80">{item.format}</td>
                        <td className="py-3 px-2 font-semibold text-purple-300">
                          {typeof item.price === 'number' ? `Ksh ${item.price.toLocaleString()}` : item.price}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                            item.stockQuantity > 0 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {item.stockQuantity}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-2">
                          <button 
                            onClick={() => handleDecrementStock(item._id, item.stockQuantity)}
                            disabled={item.stockQuantity <= 0 || decrementingId === item._id}
                            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title="Decrement stock by 1"
                          >
                            {decrementingId === item._id ? 'Updating...' : '🛍️ Sold In-Store'}
                          </button>
                          <button 
                            onClick={() => { onClose(); onEditItem(item); }} 
                            className="px-3 py-1 bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-500/30 rounded-lg text-xs font-semibold transition-all"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(item._id)} 
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-lg text-xs font-semibold transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Filter Controls */}
              <div className="flex items-center justify-between bg-purple-950/40 p-3 rounded-xl border border-purple-500/20 mb-2">
                <span className="text-xs font-bold text-purple-300">Filter Requests:</span>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#1c122e] text-white border border-purple-500/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="All">All Statuses ({requests.length})</option>
                  <option value="Pending">🕐 Pending</option>
                  <option value="Met / Sourced">✅ Met / Sourced</option>
                  <option value="In Stock">📦 In Stock</option>
                  <option value="Not Met / Unavailable">❌ Not Met</option>
                </select>
              </div>

              {loadingRequests ? (
                <p className="text-center py-8 text-purple-300/60 text-sm">Loading customer requests...</p>
              ) : filteredRequests.length === 0 ? (
                <p className="text-center py-8 text-purple-300/60 text-sm">No requests found matching "{statusFilter}".</p>
              ) : (
                filteredRequests.map((req) => (
                  <div key={req._id} className="p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-purple-900/40 bg-purple-950/20">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">
                        {req.title || req.albumOrItemTitle} <span className="font-normal text-purple-300/80">by</span> <em className="not-italic font-medium text-purple-200">{req.artist}</em> <span className="text-xs text-purple-400">({req.format})</span>
                      </div>
                      <div className="text-xs text-purple-300/70 mt-1">
                        Requested by: <strong className="text-white">{req.user?.name || 'Customer'}</strong> ({req.user?.email || 'No email'} | {req.user?.phone || 'No phone'})
                      </div>
                      {(req.notes || req.additionalDetails) && (
                        <p className="mt-2 text-xs text-gray-300 bg-black/30 p-2 rounded-lg border border-purple-500/20">
                          Note: {req.notes || req.additionalDetails}
                        </p>
                      )}
                    </div>

                    <div className="w-full md:w-auto">
                      <label className="block text-xs font-bold text-purple-300 mb-1">Status:</label>
                      <select 
                        value={req.status} 
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        className="bg-[#1c122e] text-white border border-purple-500/30 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-purple-400 w-full md:w-48 cursor-pointer"
                      >
                        <option value="Pending">🕐 Pending</option>
                        <option value="Met / Sourced">✅ Met / Sourced</option>
                        <option value="In Stock">📦 In Stock (Added to Store)</option>
                        <option value="Not Met / Unavailable">❌ Request Not Met</option>
                      </select>
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

export default AdminDashboardModal;