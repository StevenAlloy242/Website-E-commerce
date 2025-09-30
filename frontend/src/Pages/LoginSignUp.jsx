import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'; // Assuming same CSS

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('userLoggedIn') === 'true') {
      navigate('/');
    }
  }, [navigate]);

  const getUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // Login
      const users = getUsers();
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        sessionStorage.setItem('userLoggedIn', 'true');
        sessionStorage.setItem('currentUser', user.username);
        navigate('/');
      } else {
        setError("Username atau password salah!");
      }
    } else {
      // Sign Up
      if (password !== confirmPassword) {
        setError("Password tidak cocok!");
        return;
      }
      const users = getUsers();
      if (users.find(u => u.username === username)) {
        setError("Username sudah terdaftar!");
        return;
      }
      users.push({ username, password });
      saveUsers(users);
      sessionStorage.setItem('userLoggedIn', 'true');
      sessionStorage.setItem('currentUser', username);
      navigate('/');
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <div className="toggle">
          <button type="button" onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>Login</button>
          <button type="button" onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>Sign Up</button>
        </div>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {!isLogin && (
          <>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input id="confirm-password" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </>
        )}
        {error && <div className="admin-login-error">{error}</div>}
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
    </div>
  );
};

export default LoginSignUp;
