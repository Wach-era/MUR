import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CartDrawer = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal,
    clearCart 
  } = useCart();

  const { token } = useAuth();

  // Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  
  // M-Pesa Payment State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({ type: '', message: '' });

  if (!isCartOpen) return null;

  const cartItems = cart || [];

  // Check if any cart item exceeds available stock or is sold out
  const invalidStockItem = cartItems.find((item) => {
    const stock = item.stockQuantity ?? 1;
    return stock <= 0 || item.quantity > stock;
  });

  const isCheckoutDisabled = Boolean(invalidStockItem);

  // Intercept checkout to check authentication and stock validation first
  const handleProceedToCheckout = () => {
    if (isCheckoutDisabled) {
      alert(`Cannot checkout: "${invalidStockItem?.title}" is out of stock or exceeds available quantity.`);
      return;
    }

    const authToken = token || localStorage.getItem('token');
    
    if (!authToken) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsMpesaModalOpen(true);
  };

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      cleaned = '254' + cleaned;
    }
    return cleaned;
  };

  const handleInitiateMpesa = async (e) => {
    e.preventDefault();
    const formattedPhone = formatPhoneNumber(phoneNumber);

    if (formattedPhone.length !== 12 || !formattedPhone.startsWith('254')) {
      setPaymentStatus({ 
        type: 'error', 
        message: 'Please enter a valid M-Pesa phone number (e.g., 0712345678 or 254712345678).' 
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStatus({ type: 'info', message: 'Sending M-Pesa STK Push to your phone...' });

    try {
      const authToken = token || localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/payments/stkpush`,
        {
          phone: formattedPhone,
          amount: Math.round(Number(subtotal) || 0),
          accountReference: 'CrateCheckout'
        },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      if (response.data.success) {
        setPaymentStatus({ 
          type: 'success', 
          message: 'STK Push sent! Please check your phone and enter your M-Pesa PIN.' 
        });

        setTimeout(() => {
          setIsMpesaModalOpen(false);
          setPaymentStatus({ type: '', message: '' });
          setPhoneNumber('');
          if (clearCart) clearCart();
          setIsCartOpen(false);
        }, 4000);
      } else {
        setPaymentStatus({ type: 'error', message: response.data.message || 'Payment initiation failed.' });
      }
    } catch (err) {
      setPaymentStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to trigger M-Pesa payment. Please check your connection.' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          className="w-full max-w-md bg-[#120a1f] border-l border-purple-500/20 text-white flex flex-col h-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header - responsive */}
          <div className="p-3 sm:p-5 border-b border-purple-900/40 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              🛒 Your Cart 
              <span className="text-[10px] sm:text-xs text-purple-400 font-normal">
                ({cartItems.length} items)
              </span>
            </h2>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-white text-xl p-1.5 sm:p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Item List - responsive */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 sm:py-16 text-purple-300/60">
                <p className="text-3xl sm:text-4xl mb-3">📦</p>
                <p className="text-sm font-medium">Your crate is empty.</p>
                <p className="text-[10px] sm:text-xs text-purple-300/40 mt-1">Explore the feed to find vinyls and merch!</p>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = Number(item.price) || 0;
                const itemQty = Number(item.quantity) || 1;
                const availableStock = item.stockQuantity ?? 1;
                const isOutOfStock = availableStock <= 0;
                const isExceedingStock = itemQty > availableStock;

                return (
                  <div 
                    key={item._id} 
                    className={`glass-card p-2.5 sm:p-3 rounded-xl flex gap-2 sm:gap-3 items-center bg-black/20 border ${
                      isOutOfStock || isExceedingStock ? 'border-red-500/50 bg-red-950/10' : 'border-purple-500/10'
                    }`}
                  >
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=200'} 
                      alt={item.title || 'Item'} 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg bg-black/40 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h4>
                      <p className="text-[10px] sm:text-xs text-purple-300/70 truncate">{item.artist} ({item.format})</p>
                      
                      {/* Stock Warning Badge */}
                      {isOutOfStock ? (
                        <span className="inline-block mt-1 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          OUT OF STOCK
                        </span>
                      ) : isExceedingStock ? (
                        <span className="inline-block mt-1 text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Only {availableStock} left
                        </span>
                      ) : (
                        <p className="text-xs sm:text-sm font-bold text-purple-400 mt-1">
                          Ksh.{(itemPrice * itemQty).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls - smaller on mobile */}
                    <div className="flex items-center gap-1 sm:gap-2 bg-black/40 border border-purple-500/20 rounded-lg p-0.5 sm:p-1">
                      <button 
                        onClick={() => updateQuantity(item._id, itemQty - 1)}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-purple-900/40 text-purple-200 hover:bg-purple-800 text-xs flex items-center justify-center font-bold transition-colors touch-target"
                      >
                        -
                      </button>
                      <span className="text-[10px] sm:text-xs font-semibold px-0.5 sm:px-1 min-w-[16px] sm:min-w-[20px] text-center">
                        {itemQty}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item._id, itemQty + 1)}
                        disabled={itemQty >= availableStock}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-purple-900/40 text-purple-200 hover:bg-purple-800 text-xs flex items-center justify-center font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-target"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-500 hover:text-red-400 text-xs sm:text-sm p-1 transition-colors touch-target"
                      aria-label="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer - responsive */}
          {cartItems.length > 0 && (
            <div className="p-3 sm:p-5 border-t border-purple-900/40 bg-black/30 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-xs sm:text-sm text-purple-300">Subtotal:</span>
                <span className="text-base sm:text-xl font-extrabold text-emerald-400">
                  Ksh.{(Number(subtotal) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-purple-300/50 text-center">Taxes &amp; shipping calculated at checkout</p>
              
              <button 
                onClick={handleProceedToCheckout}
                disabled={isCheckoutDisabled}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-emerald-600 text-xs sm:text-sm touch-target"
              >
                <span>
                  {isCheckoutDisabled ? '⚠️ Item(s) Out of Stock' : '📱 Pay with M-Pesa →'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal Triggered when paying without logging in */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* M-Pesa Modal - responsive */}
      {isMpesaModalOpen && (
        <div 
          className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => !isProcessing && setIsMpesaModalOpen(false)}
        >
          <div 
            className="w-full max-w-md mx-2 sm:mx-0 bg-[#120a1f] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white space-y-4 my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-purple-900/40 pb-3">
              <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-emerald-400">
                <span>📲</span> M-Pesa Express
              </h3>
              {!isProcessing && (
                <button 
                  onClick={() => setIsMpesaModalOpen(false)}
                  className="text-gray-400 hover:text-white p-1.5 sm:p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
                  aria-label="Close payment"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
              <span className="text-xs text-purple-200">Total Payable:</span>
              <span className="text-base sm:text-lg font-black text-emerald-400">
                Ksh. {(Number(subtotal) || 0).toLocaleString()}
              </span>
            </div>

            <form onSubmit={handleInitiateMpesa} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-300 mb-1">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isProcessing}
                  required
                  className="w-full bg-[#1c122e] border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-white placeholder-purple-400/40 focus:outline-none focus:border-emerald-400 text-sm"
                />
                <span className="text-[10px] text-purple-300/60 mt-1 block">
                  An M-Pesa prompt will pop up on this phone asking for your PIN.
                </span>
              </div>

              {paymentStatus.message && (
                <div className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                  paymentStatus.type === 'error' 
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300' 
                    : paymentStatus.type === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                    : 'bg-purple-900/40 border border-purple-500/30 text-purple-200'
                }`}>
                  {paymentStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm touch-target"
              >
                {isProcessing ? '⏳ Initiating Prompt...' : `📲 Send M-Pesa (Ksh ${Math.round(Number(subtotal) || 0)})`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;