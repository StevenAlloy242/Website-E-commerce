import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage as initial cache
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const { isLoggedIn, authToken } = useAuth();
  const saveTimerRef = useRef(null);

  // Persist to localStorage immediately for fast UI
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (e) {}
  }, [cart]);

  // Clear cart when user logs out
  useEffect(() => {
    const handleLogout = () => {
      setCart([]);
    };
    window.addEventListener('app:logout', handleLogout);
    return () => window.removeEventListener('app:logout', handleLogout);
  }, []);

  // When logged in, load server cart and MERGE with local cart (silent merge)
  useEffect(() => {
    const mergeCarts = (serverCart = [], localCart = []) => {
      const map = new Map();
      const push = (item) => {
        if (!item || !item.productId) return;
        const key = `${item.productId}::${item.size || ''}`;
        if (!map.has(key)) map.set(key, { ...item });
        else {
          const existing = map.get(key);
          existing.qty = (Number(existing.qty) || 0) + (Number(item.qty) || 0);
          map.set(key, existing);
        }
      };
      serverCart.forEach(push);
      localCart.forEach(push);
      return Array.from(map.values());
    };

    const loadAndMerge = async () => {
      if (!isLoggedIn || !authToken) return;
      try {
        const res = await fetch('/api/users/cart', { headers: { 'Authorization': `Bearer ${authToken}` } });
        if (!res.ok) return;
        const data = await res.json();
        const serverCart = data && data.cart ? data.cart : [];
        const localCart = (() => { try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch (e) { return []; } })();

        // If both empty, nothing to do
        if ((!Array.isArray(serverCart) || serverCart.length === 0) && (!Array.isArray(localCart) || localCart.length === 0)) return;

        // Merge silently (sum quantities for same productId+size)
        const merged = mergeCarts(Array.isArray(serverCart) ? serverCart : [], Array.isArray(localCart) ? localCart : []);

        // Update local cart with merged result and persist to server so server becomes authoritative
        setCart(merged);
        try {
          await fetch('/api/users/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({ cart: merged })
          });
        } catch (e) {
          // swallow network errors silently
          console.debug('Failed to push merged cart to server (silent):', e.message || e);
        }
      } catch (err) {
        console.error('Failed to load/merge server cart', err);
      }
    };

    loadAndMerge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, authToken]);

  // Save cart to server on every change (small debounce to batch quick updates)
  useEffect(() => {
    if (!isLoggedIn || !authToken) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await fetch('/api/users/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ cart })
        });
      } catch (err) {
        console.error('Failed to save cart to server', err);
      }
    }, 200);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [cart, isLoggedIn, authToken]);

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
