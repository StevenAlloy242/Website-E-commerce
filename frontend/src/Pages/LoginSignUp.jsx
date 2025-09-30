import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'; // Assuming same CSS

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const LoginSignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      navigate('/admin-panel');
    }
  }, [navigate]);

  const handleSubmit = e => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem('isLoggedIn', 'true');
      navigate('/admin-panel');
    } else {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <label htmlFor="admin-username">Masukkan Username</label>
        <input id="admin-username" type="text" placeholder="Masukkan Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <label htmlFor="admin-password">Masukkan Password</label>
        <input id="admin-password" type="password" placeholder="Masukkan Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="admin-login-error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginSignUp;
