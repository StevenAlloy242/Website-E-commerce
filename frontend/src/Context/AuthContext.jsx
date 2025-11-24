import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [balance, setBalance] = useState(0);
  const [authToken, setAuthToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('currentUser');
    const role = sessionStorage.getItem('currentRole');
    const loggedIn = sessionStorage.getItem('userLoggedIn') === 'true';

    if (token && user && loggedIn) {
      setAuthToken(token);
      setCurrentUser(user);
      setCurrentRole(role || 'buyer');
      const bal = sessionStorage.getItem('currentBalance');
      setBalance(bal ? Number(bal) : 0);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (user, role, token) => {
    setAuthToken(token);
    setCurrentUser(user);
    setCurrentRole(role);
    setBalance(0);
    setIsLoggedIn(true);

    // Juga simpan ke sessionStorage
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('currentUser', user);
    sessionStorage.setItem('currentRole', role);
    sessionStorage.setItem('currentBalance', '0');
    sessionStorage.setItem('userLoggedIn', 'true');
  };

  // Logout function
  const logout = () => {
    setAuthToken("");
    setCurrentUser("");
    setCurrentRole("");
    setBalance(0);
    setIsLoggedIn(false);

    // Clear sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentRole');
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('currentBalance');
    // Also clear local cart and notify other parts of app about logout
    try { localStorage.removeItem('cart'); } catch (e) {}
    try { window.dispatchEvent(new Event('app:logout')); } catch (e) {}
  };

  // refresh profile (fetch balance + username/role) from backend
  const refreshProfile = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/users/me', { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (!res.ok) return;
      const data = await res.json();
      setCurrentUser(data.username);
      setCurrentRole(data.role);
      setBalance(Number(data.balance || 0));
      sessionStorage.setItem('currentUser', data.username);
      sessionStorage.setItem('currentRole', data.role);
      sessionStorage.setItem('currentBalance', String(Number(data.balance || 0)));
    } catch (err) {
      console.error('refreshProfile error', err);
    }
  };

    // When authToken changes, refresh profile automatically
    useEffect(() => {
      if (authToken) refreshProfile();
    }, [authToken]);

  const topUp = async (amount) => {
    if (!authToken) throw new Error('Not authenticated');
    const res = await fetch('/api/users/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ amount })
    });
    if (!res.ok) {
      const d = await res.json().catch(()=>({message:'Unknown'}));
      throw new Error(d.message || 'Topup failed');
    }
    const { user } = await res.json();
    setBalance(Number(user.balance || 0));
    sessionStorage.setItem('currentBalance', String(Number(user.balance || 0)));
    return user;
  };

  const value = {
    isLoggedIn,
    currentUser,
    currentRole,
    balance,
    authToken,
    isLoading,
    login,
    logout,
    refreshProfile,
    topUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
