import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Ambil cart dari localStorage jika ada, jika tidak pakai default
  const defaultCart = [];
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : defaultCart;
  });

  // Simpan cart ke localStorage setiap kali cart berubah
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId, size, qty = 1) => {
    setCart(prev => {
      const found = prev.find(item => item.productId === productId && item.size === size);
      if (found) {
        return prev.map(item =>
          item.productId === productId && item.size === size
            ? { ...item, qty: item.qty + qty }
            : item
        );
      } else {
        return [...prev, { productId, size, qty }];
      }
    });
  };

  const updateQty = (productId, size, qty) => {
    setCart(prev => prev.map(item =>
      item.productId === productId && item.size === size
        ? { ...item, qty: qty < 1 ? 1 : qty }
        : item
    ));
  };

  const removeFromCart = (productId, size) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.size === size)));
  };

  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, updateQty, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
