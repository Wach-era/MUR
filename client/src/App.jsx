import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ItemCard from './components/ItemCard';
import AddProductModal from './components/AddProductModal';
import EditItemModal from './components/EditItemModal';
import RequestModal from './components/RequestModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import AuthModal from './components/AuthModal';
import FilterBar from './components/FilterBar';
import CartDrawer from './components/CartDrawer';
import CategoryRow from './components/CategoryRow';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Active Category View ('All' showing rows, or specific format like 'Vinyl')
  const [activeCategoryView, setActiveCategoryView] = useState('All');

  const { totalItemsCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items');
      setItems(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const handleOpenRequestModal = () => {
    if (!isAuthenticated) {
      // Prompt user to sign in before requesting imports
      setIsAuthModalOpen(true);
    } else {
      setIsRequestModalOpen(true);
    }
  };

  const handleItemAdded = (newItem) => {
    setItems((prevItems) => [newItem, ...prevItems]);
  };

  const handleItemUpdated = (updated) => {
    setItems(items.map((i) => (i._id === updated._id ? updated : i)));
  };

  const handleItemDeleted = (id) => {
    setItems(items.filter((i) => i._id !== id));
  };

  const handleViewAll = (format) => {
    setActiveCategoryView(format);
    setSelectedFormat(format);
  };

  const handleBackToAllCategories = () => {
    setActiveCategoryView('All');
    setSelectedFormat('All');
  };

  // Live Filtering Logic for Search / Dedicated Category Page
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.genre && item.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesFormat =
      activeCategoryView !== 'All'
        ? item.format === activeCategoryView
        : selectedFormat === 'All' || item.format === selectedFormat;

    const matchesCondition =
      conditionFilter === 'All' ||
      (conditionFilter === 'New' && !item.isPreOwned) ||
      (conditionFilter === 'PreOwned' && item.isPreOwned);

    return matchesSearch && matchesFormat && matchesCondition;
  });

  return (
    <div className="min-h-screen bg-[#0b0711] text-gray-100 selection:bg-purple-500 selection:text-white pb-16">
      {/* Background Radial Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 glass-panel">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          <div>
            <h1 
              onClick={handleBackToAllCategories}
              className="text-2xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent cursor-pointer tracking-tight"
            >
              🎵 Wax & Grooves Collectibles
            </h1>
            <p className="text-xs text-purple-300/70 font-medium">
              Second-hand vinyls, rare CDs, photocards, and official band merchandise.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* DYNAMIC BUTTON: Customer sees "Request Import", Admin sees "View Requests" */}
            {user?.role === 'admin' ? (
              <button 
                onClick={() => setIsAdminOpen(true)} 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                📋 View Requests
              </button>
            ) : (
              <button 
                onClick={handleOpenRequestModal} 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                📦 Request Import
              </button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)} 
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-medium text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              🛒 Cart ({totalItemsCount})
            </button>

            {/* User Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-purple-900/40">
                <span className="text-xs font-semibold text-purple-200">👤 {user?.name}</span>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminOpen(true)} 
                    className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-xs py-1.5 px-2.5 rounded-lg cursor-pointer font-medium"
                  >
                    ⚙️ Admin Panel
                  </button>
                )}
                <button 
                  onClick={logout} 
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs py-1.5 px-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Sign In / Register
              </button>
            )}

            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                + List Item
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-6 pt-6">
        {/* Header controls when focused on a specific category page */}
        {activeCategoryView !== 'All' && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              Exploring All <span className="text-purple-400">{activeCategoryView}</span> Collectibles
            </h2>
            <button 
              onClick={handleBackToAllCategories}
              className="bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/20 text-xs font-semibold py-2 px-3.5 rounded-xl transition-all cursor-pointer"
            >
              ← Back to All Categories
            </button>
          </div>
        )}

        {/* Existing FilterBar component */}
        <div className="mb-8">
          <FilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFormat={selectedFormat}
            setSelectedFormat={(format) => {
              setSelectedFormat(format);
              setActiveCategoryView(format);
            }}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-purple-300 text-sm font-medium">Loading inventory...</h2>
          </div>
        ) : activeCategoryView === 'All' && searchTerm === '' && conditionFilter === 'All' ? (
          /* HOMEPAGE VIEW: Categorized Horizontal Rows */
          <div className="space-y-10">
            <CategoryRow title="📀 Rare & Pre-Owned Vinyls" formatKey="Vinyl" items={items} onViewAll={handleViewAll} />
            <CategoryRow title="💿 CDs & Compact Discs" formatKey="CD" items={items} onViewAll={handleViewAll} />
            <CategoryRow title="👕 Official Apparel & Merchandise" formatKey="Merchandise" items={items} onViewAll={handleViewAll} />
          </div>
        ) : (
          /* SINGLE CATEGORY / SEARCH GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onItemAdded={handleItemAdded} 
      />
      <RequestModal 
        isOpen={isRequestModalOpen} 
        onClose={() => setIsRequestModalOpen(false)} 
      />
      <EditItemModal 
        item={editingItem} 
        isOpen={!!editingItem} 
        onClose={() => setEditingItem(null)} 
        onItemUpdated={handleItemUpdated} 
      />
      <AdminDashboardModal 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        items={items} 
        onItemDeleted={handleItemDeleted} 
        onEditItem={(item) => setEditingItem(item)} 
      />
      <CartDrawer />
    </div>
  );
}

export default App;