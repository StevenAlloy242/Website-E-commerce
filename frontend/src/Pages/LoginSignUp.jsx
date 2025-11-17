import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './AdminPanel.css'; // Assuming same CSS
import './LoginSignUp.css'; // Additional CSS for LoginSignUp page

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, currentRole, login } = useAuth();

  useEffect(() => {
    // Jika sudah login, redirect
    if (isLoggedIn) {
      if (currentRole === 'admin') navigate('/admin-panel');
      else navigate('/');
    }
  }, [isLoggedIn, currentRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isLogin && !agreeTerms) {
      setError("Anda harus setuju dengan syarat & ketentuan!");
      setIsLoading(false);
      return;
    }

    if (isLogin) {
      // Login via API
      try {
        console.log('Attempting login with:', { username, password });
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        console.log('Login response status:', res.status);
        const data = await res.json();
        console.log('Login response data:', data);
        if (!res.ok) {
          setError(data.message || 'Username atau password salah');
          setIsLoading(false);
          return;
        }
        const user = data.user;
        const token = data.token;
        // Gunakan context untuk login
        login(user.username, user.role, token);
        // Redirect akan handle oleh useEffect
      } catch (err) {
        console.error('Login error:', err);
        setError('Gagal menghubungi server');
        setIsLoading(false);
      }
    } else {
      // Sign Up via API
      if (password !== confirmPassword) {
        setError("Password tidak cocok!");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Signup failed');
          setIsLoading(false);
          return;
        }
        const user = data.user;
        const token = data.token;
        // Gunakan context untuk login
        login(user.username, user.role || 'buyer', token);
        // Redirect akan handle oleh useEffect
      } catch (err) {
        setError('Gagal menghubungi server');
        setIsLoading(false);
      }
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
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="Enter Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', paddingRight: '40px' }}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              fontSize: '18px'
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {!isLogin && (
          <>
            <label htmlFor="confirm-password">Confirm Password</label>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
              <input 
                id="confirm-password" 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px'
                }}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </>
        )}
        {error && <div className="admin-login-error">{error}</div>}
        {!isLogin && (
          <label className="terms-checkbox">
            <input type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} />
            <span>By continuing, I agree to the terms of use & privacy policy.</span>
          </label>
        )}
        <button type="submit">{isLogin ? "Login" : "Continue"}</button>
        {isLogin && (
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7c7c7c' }}>
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(false); }} style={{ color: '#ff4141', fontWeight: '600', textDecoration: 'none' }}>Sign up here</a>
          </p>
        )}
        {!isLogin && (
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#7c7c7c' }}>
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(true); }} style={{ color: '#ff4141', fontWeight: '600', textDecoration: 'none' }}>Login here</a>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginSignUp;