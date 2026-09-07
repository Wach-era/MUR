import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Clear cart function (needed after successful checkout)
  const clearCart = () => setCart([]);

  // Add item to cart with stock validation
  const addToCart = (item) => {
    // Prevent adding item if completely out of stock
    if (item.stockQuantity !== undefined && item.stockQuantity <= 0) {
      alert('Sorry, this item is sold out!');
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem._id === item._id);

      if (existingItemIndex > -1) {
        const existingItem = prevCart[existingItemIndex];
        const maxStock = item.stockQuantity ?? existingItem.stockQuantity ?? 1;

        // Don't allow adding more than total stock quantity
        if (existingItem.quantity >= maxStock) {
          alert(`Sorry, only ${maxStock} copy available for this collectible!`);
          return prevCart;
        }

        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          stockQuantity: maxStock // Sync stock quantity
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    setIsCartOpen(true); // Open drawer automatically on add
  };

  // Remove single item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === id) {
          const maxStock = item.stockQuantity ?? Infinity;
          if (newQuantity > maxStock) {
            alert(`Only ${maxStock} copy available!`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);