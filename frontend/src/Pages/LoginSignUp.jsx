import React, { useState } from 'react';

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi login/signup
    alert(`${isLogin ? 'Login' : 'Sign Up'} berhasil untuk email: ${email}`);
  };

  return (
    <div className="shop-category" style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="Username"
          placeholder="Username"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" className="shop-hero-btn">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p style={{ marginTop: 16 }}>
        {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
        <button type="button" style={{ background: 'none', border: 'none', color: '#c41717', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default LoginSignUp;
