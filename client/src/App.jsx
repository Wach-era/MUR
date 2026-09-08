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
import ItemDetailModal from './components/ItemDetailModal';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  const handleOpenRequestModal = () => {
    if (!isAuthenticated) {
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
    <div className="min-h-screen bg-[#0b0711] text-gray-100 selection:bg-purple-500 selection:text-white flex flex-col">
      {/* Background Radial Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* HEADER NAVBAR - Responsive */}
      <header className="sticky top-0 z-40 glass-panel">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-0 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 min-h-[60px] sm:h-20">
          {/* Logo - responsive */}
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 
              onClick={handleBackToAllCategories}
              className="text-base sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent cursor-pointer tracking-tight"
            >
              🎵 MUR Music Store
            </h1>
            <p className="text-[8px] sm:text-xs text-purple-300/70 font-medium hidden xs:block">
              Own a piece of your favourite music artform
            </p>
          </div>

          {/* Nav Buttons - responsive */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
            {/* Request Import Button */}
            {user?.role === 'admin' ? (
              <button 
                onClick={() => setIsAdminOpen(true)} 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-[10px] sm:text-xs py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl transition-all shadow-md touch-target"
              >
                📋 View Requests
              </button>
            ) : (
              <button 
                onClick={handleOpenRequestModal} 
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-[10px] sm:text-xs py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl transition-all shadow-md touch-target"
              >
                📦 Request Import
              </button>
            )}

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 font-medium text-[10px] sm:text-xs py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl transition-all touch-target flex items-center gap-1"
            >
              🛒 <span className="hidden xs:inline">Cart</span> ({totalItemsCount})
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-purple-900/40">
                <span className="text-[10px] sm:text-xs font-semibold text-purple-200 hidden xs:inline">
                  👤 {user?.name?.split(' ')[0]}
                </span>
                {user?.role === 'admin' && (
                  <button 
                    onClick={() => setIsAdminOpen(true)} 
                    className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/30 text-[10px] sm:text-xs py-1 px-1.5 sm:py-1.5 sm:px-2.5 rounded-lg touch-target"
                  >
                    ⚙️
                  </button>
                )}
                <button 
                  onClick={logout} 
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-[10px] sm:text-xs py-1 px-1.5 sm:py-1.5 sm:px-2.5 rounded-lg touch-target"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-[10px] sm:text-xs py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl transition-all shadow-md touch-target"
              >
                <span className="hidden xs:inline">Sign In / Register</span>
                <span className="xs:hidden">Sign In</span>
              </button>
            )}

            {/* Admin Add Item Button */}
            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsAddModalOpen(true)} 
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold py-1.5 px-2 sm:py-2 sm:px-3.5 rounded-xl transition-all shadow-md touch-target"
              >
                + List
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 w-full">
        {/* Category header */}
        {activeCategoryView !== 'All' && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl font-bold text-white">
              Exploring All <span className="text-purple-400">{activeCategoryView}</span> Collectibles
            </h2>
            <button 
              onClick={handleBackToAllCategories}
              className="bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/20 text-[10px] sm:text-xs font-semibold py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-xl transition-all touch-target"
            >
              ← Back
            </button>
          </div>
        )}

        {/* FilterBar */}
        <div className="mb-6 sm:mb-8">
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

        {/* Loading / Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-purple-300 text-xs sm:text-sm font-medium">Loading inventory...</h2>
          </div>
        ) : activeCategoryView === 'All' && searchTerm === '' && conditionFilter === 'All' ? (
          <div className="space-y-8 sm:space-y-10">
            <CategoryRow 
              title="🎵 Rare & Pre-Owned Vinyls" 
              formatKey="Vinyl" 
              items={items} 
              onViewAll={handleViewAll}
              onItemClick={(item) => setSelectedItem(item)} 
            />
            <CategoryRow 
              title="💿 CDs & Compact Discs" 
              formatKey="CD" 
              items={items} 
              onViewAll={handleViewAll}
              onItemClick={(item) => setSelectedItem(item)} 
            />
            <CategoryRow 
              title="📼 Cassettes" 
              formatKey="Cassette" 
              items={items} 
              onViewAll={handleViewAll}
              onItemClick={(item) => setSelectedItem(item)} 
            />
            <CategoryRow 
              title="🖼️ Photocards & Memorabilia" 
              formatKey="Photocard" 
              items={items} 
              onViewAll={handleViewAll}
              onItemClick={(item) => setSelectedItem(item)} 
            />
            <CategoryRow 
              title="👕 Official Merchandise" 
              formatKey="Merchandise" 
              items={items} 
              onViewAll={handleViewAll}
              onItemClick={(item) => setSelectedItem(item)} 
            />
            <CategoryRow 
              title="🖼️ Posters" 
              formatKey="Poster" 
              items={items} 
              onViewAll={handleViewAll}
              onItemClick={(item) => setSelectedItem(item)} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ItemCard 
                  key={item._id} 
                  item={item} 
                  onClick={(item) => setSelectedItem(item)} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-purple-300/60">
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-sm font-medium">No items found</p>
                <p className="text-xs text-purple-300/40 mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 sm:mt-16 border-t border-purple-900/30 bg-[#0b0711]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Brand */}
            <div className="col-span-1 sm:col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                🎵 MUR Music
              </h3>
              <p className="text-xs text-purple-300/60 mt-2">
                Own a piece of your favourite music artform.
              </p>
              <div className="flex gap-3 mt-3">
                <a href="#" className="text-purple-400/60 hover:text-purple-300 transition-colors" aria-label="Instagram">
                  📸
                </a>
                <a href="#" className="text-purple-400/60 hover:text-purple-300 transition-colors" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" className="text-purple-400/60 hover:text-purple-300 transition-colors" aria-label="YouTube">
                  ▶️
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={handleBackToAllCategories}
                    className="text-xs text-purple-300/60 hover:text-purple-200 transition-colors"
                  >
                    Browse All
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleOpenRequestModal}
                    className="text-xs text-purple-300/60 hover:text-purple-200 transition-colors"
                  >
                    Request Import
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="text-xs text-purple-300/60 hover:text-purple-200 transition-colors"
                  >
                    View Cart
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">Contact</h4>
              <ul className="space-y-2 text-xs">
                <li className="text-purple-300/60">
                  📞 <a href="tel:+254111767994" className="hover:text-purple-200 transition-colors">0111767994</a>
                </li>
                <li className="text-purple-300/60">
                  ✉️ <a href="mailto:hillarybrucewachira@gmail.com" className="hover:text-purple-200 transition-colors break-all">hillarybrucewachira@gmail.com</a>
                </li>
                <li className="text-purple-300/60">
                  📍 Nairobi, Kenya
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">Store Info</h4>
              <ul className="space-y-2 text-xs">
                <li className="text-purple-300/60">
                  🕐 Mon-Fri: 9AM - 6PM
                </li>
                <li className="text-purple-300/60">
                  🕐 Sat: 10AM - 4PM
                </li>
                <li className="text-purple-300/60">
                  🕐 Sun: Closed
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-purple-900/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-purple-300/40">
            <p>
              © {new Date().getFullYear()} MUR Music Store. All rights reserved.
            </p>
            <p className="flex items-center gap-3">
              <span>Made with 🎵 in Nairobi</span>
              <span className="hidden xs:inline">|</span>
              <span className="hidden xs:inline">v1.0.0</span>
            </p>
          </div>
        </div>
      </footer>

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
        onItemUpdated={handleItemUpdated}
      />
      <CartDrawer />
      <ItemDetailModal 
        item={selectedItem} 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
}

export default App;