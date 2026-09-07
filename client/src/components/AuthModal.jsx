import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

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
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

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
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#140c24] border border-purple-500/20 rounded-2xl p-6 shadow-2xl relative text-white" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xl p-1 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegistering && (
            <>
              <input 
                name="name" 
                placeholder="Full Name" 
                required 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
              <input 
                name="phone" 
                placeholder="Phone Number" 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
              />
            </>
          )}

          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            required 
            onChange={handleChange} 
            className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required 
            onChange={handleChange} 
            className="w-full bg-black/40 border border-purple-500/30 rounded-xl p-2.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400" 
          />

          <button 
            type="submit" 
            className="w-full py-2.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
          >
            {isRegistering ? 'Register' : 'Log In'}
          </button>
        </form>

        {/* Switch Mode Toggle */}
        <p className="text-xs text-center text-purple-300/70 mt-4">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => {
              setError('');
              setIsRegistering(!isRegistering);
            }} 
            className="text-purple-400 font-bold hover:underline bg-transparent border-none cursor-pointer ml-1"
          >
            {isRegistering ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;