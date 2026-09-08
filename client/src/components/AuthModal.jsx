import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthModal = ({ isOpen, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering
      ? `${API_URL}/api/auth/register`   
      : `${API_URL}/api/auth/login`;     

    try {
      const res = await axios.post(endpoint, formData);
      login(res.data.user, res.data.token);
      onClose();
    } catch (err) {
      console.error('AUTH ERROR:', err);
      console.error('STATUS:', err.response?.status);
      console.error('DATA:', err.response?.data);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Authentication failed'
      );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm mx-2 sm:mx-0 bg-[#140c24] border border-purple-500/20 rounded-2xl p-4 sm:p-6 shadow-2xl relative text-white my-4" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {isRegistering ? '✨ Create Account' : '👋 Welcome Back'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1.5 sm:p-1 transition-colors rounded-lg hover:bg-purple-900/30 touch-target flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-purple-300/60 mb-4 sm:mb-6">
          {isRegistering 
            ? 'Join our community of music collectors 🎵' 
            : 'Sign in to access your collection and requests'}
        </p>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs sm:text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-medium text-purple-300/70 mb-1">Full Name *</label>
                <input 
                  name="name" 
                  placeholder="Enter your full name" 
                  required 
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-300/70 mb-1">Phone Number</label>
                <input 
                  name="phone" 
                  placeholder="Enter your phone number" 
                  onChange={handleChange} 
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors" 
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Email Address *</label>
            <input 
              name="email" 
              type="email" 
              placeholder="you@example.com" 
              required 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-purple-300/70 mb-1">Password *</label>
            <input 
              name="password" 
              type="password" 
              placeholder="Enter your password" 
              required 
              onChange={handleChange} 
              className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-2.5 sm:py-3 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400 transition-colors" 
            />
            {!isRegistering && (
              <p className="text-[10px] text-purple-300/40 mt-1.5">
                Forgot password? Contact support
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full py-2.5 sm:py-3 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-purple-500/20 cursor-pointer touch-target"
          >
            {isRegistering ? '🚀 Create Account' : '🔑 Log In'}
          </button>
        </form>

        {/* Switch Mode Toggle */}
        <p className="text-[11px] sm:text-xs text-center text-purple-300/70 mt-4 sm:mt-6">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => {
              setError('');
              setIsRegistering(!isRegistering);
            }} 
            className="text-purple-400 font-bold hover:underline hover:text-purple-300 bg-transparent border-none cursor-pointer ml-1 transition-colors touch-target"
          >
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>

        {/* Decorative element */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-purple-500/20 via-purple-400/40 to-purple-500/20 rounded-full" />
      </div>
    </div>
  );
};

export default AuthModal;