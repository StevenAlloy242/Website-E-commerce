import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [currentRole, setCurrentRole] = useState("");
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
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (user, role, token) => {
    setAuthToken(token);
    setCurrentUser(user);
    setCurrentRole(role);
    setIsLoggedIn(true);

    // Juga simpan ke sessionStorage
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('currentUser', user);
    sessionStorage.setItem('currentRole', role);
    sessionStorage.setItem('userLoggedIn', 'true');
  };

  // Logout function
  const logout = () => {
    setAuthToken("");
    setCurrentUser("");
    setCurrentRole("");
    setIsLoggedIn(false);

    // Clear sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentRole');
    sessionStorage.removeItem('userLoggedIn');
  };

  const value = {
    isLoggedIn,
    currentUser,
    currentRole,
    authToken,
    isLoading,
    login,
    logout,
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
