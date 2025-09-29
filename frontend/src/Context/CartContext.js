import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([
    { productId: 1, qty: 2 },
    { productId: 2, qty: 1 },
    { productId: 13, qty: 1 },
    { productId: 25, qty: 2 },
    { productId: 30, qty: 1 }
  ]);

  const addToCart = (productId, qty = 1) => {
    setCart(prev => {
      const found = prev.find(item => item.productId === productId);
      if (found) {
        return prev.map(item => item.productId === productId ? { ...item, qty: item.qty + qty } : item);
      } else {
        return [...prev, { productId, qty }];
      }
    });
  };

  const updateQty = (productId, qty) => {
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, qty: qty < 1 ? 1 : qty } : item));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateQty, removeFromCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
