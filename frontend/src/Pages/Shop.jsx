import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import './Shop.css';
import hero_image from '../Components/Assets/hero_image.png';
import hand_icon from '../Components/Assets/hand_icon.png';
import { getLocalImage } from '../utils/imageMapper';
import { Link, useLocation } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const { isLoggedIn, currentUser, balance, topUp, refreshProfile } = useAuth();
  const location = useLocation();
  const [topupAmount, setTopupAmount] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupError, setTopupError] = useState('');

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Compute randomized sample and reset when route changes or products change
  useEffect(() => {
    if (!Array.isArray(products) || products.length === 0) {
      setRandomProducts([]);
      return;
    }
    const perCategory = Math.ceil(8 / 3);
    const cats = {
      men: products.filter(p => (p.category || '').toLowerCase() === 'men'),
      women: products.filter(p => (p.category || '').toLowerCase() === 'women'),
      kid: products.filter(p => (p.category || '').toLowerCase() === 'kid'),
    };

    const sample = (arr, n) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.slice(0, Math.min(n, copy.length));
    };

    const combined = [
      ...sample(cats.men, perCategory),
      ...sample(cats.women, perCategory),
      ...sample(cats.kid, perCategory),
    ];

    const unique = [];
    const seen = new Set();
    for (const p of combined) {
      if (p && !seen.has(p.id)) { unique.push(p); seen.add(p.id); }
    }
    if (unique.length < 8) {
      const remaining = products.filter(p => p && !seen.has(p.id));
      unique.push(...sample(remaining, 8 - unique.length));
    }

    setRandomProducts(unique.slice(0, 8));
  }, [products, location.pathname]);

  return (
    <div className="shop-container">
      {/* Hero Section */}
      <div className="shop-hero">
        <div className="shop-hero-content">
          <h1 className="shop-hero-title">New Arrivals Only</h1>
          <img src={hand_icon} alt="Hand Icon" className="shop-hero-hand" />
          <p className="shop-hero-desc">We deliver the best and latest collections for you. Get your style updated with our newest arrivals!</p>
          <button className="shop-hero-btn">Latest Collection</button>
        </div>
        <img src={hero_image} alt="Hero" className="shop-hero-img" />
      </div>

      {/* Product List */}
      <div className="shop-products" style={{display:'flex',gap:24}}>
        <h2>All Products</h2>
        <div style={{flex:1}}>
          <div className="shop-product-list">
            {
              (() => {
                // Choose a small randomized sample from each category (men, women, kid)
                const perCategory = Math.ceil(8 / 3);
                const cats = {
                  men: products.filter(p => p.category === 'men'),
                  women: products.filter(p => p.category === 'women'),
                  kid: products.filter(p => p.category === 'kid'),
                };

                const sample = (arr, n) => {
                  if (!Array.isArray(arr) || arr.length === 0) return [];
                  const copy = [...arr];
                  for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                  }
                  return copy.slice(0, Math.min(n, copy.length));
                };

                const combined = [
                  ...sample(cats.men, perCategory),
                  ...sample(cats.women, perCategory),
                  ...sample(cats.kid, perCategory),
                ];

                // Deduplicate and fill up to 8 with remaining products if needed
                const unique = [];
                const seen = new Set();
                for (const p of combined) {
                  if (p && !seen.has(p.id)) { unique.push(p); seen.add(p.id); }
                }
                if (unique.length < 8) {
                  const remaining = products.filter(p => p && !seen.has(p.id));
                  unique.push(...sample(remaining, 8 - unique.length));
                }

                return randomProducts.map(product => (
                  <a key={product.id} href={`/product/${product.id}`} style={{textDecoration:'none',color:'inherit'}}>
                    <div className="shop-product-item">
                      <img src={getLocalImage(product)} alt={product.name} className="shop-product-img" />
                      <h3>{product.name}</h3>
                      <p>Rp {Number(product.new_price).toLocaleString()}</p>
                      <span className="shop-product-old">{product.old_price ? `Rp ${Number(product.old_price).toLocaleString()}` : ''}</span>
                      <div className={`shop-product-stock ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : ''}`}>Stok: {product.stock ?? 0}</div>
                    </div>
                  </a>
                ));
              })()
            }
          </div>
        </div>

        {/* Right panel: Top-up / Balance */}
        <aside style={{width:300,borderLeft:'1px solid #eee',paddingLeft:20}}>
          <div style={{position:'sticky',top:20}}>
            <h3>Your Balance</h3>
            <div style={{fontSize:22,fontWeight:'bold',marginBottom:12}}>Rp {Number(balance || 0).toLocaleString()}</div>
            {isLoggedIn ? (
              <div>
                <label style={{display:'block',marginBottom:6}}>Top-up Amount (numbers only)</label>
                <input type="number" value={topupAmount} onChange={e=>setTopupAmount(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
                <button onClick={async ()=>{
                  setTopupError('');
                  const amt = Number(topupAmount);
                  if (!amt || amt <= 0) { setTopupError('Enter a positive amount'); return; }
                  try {
                    setTopupLoading(true);
                    await topUp(amt);
                    setTopupAmount('');
                    await refreshProfile();
                    setTopupLoading(false);
                  } catch (err) {
                    setTopupLoading(false);
                    setTopupError(err.message || 'Topup failed');
                  }
                }} style={{width:'100%',padding:10,background:'#2a9d8f',color:'#fff',border:'none',borderRadius:6,cursor:'pointer'}} disabled={topupLoading}>{topupLoading ? 'Processing...' : 'Top Up'}</button>
                {topupError && <div style={{color:'red',marginTop:8}}>{topupError}</div>}
              </div>
            ) : (
              <div>Please login to top-up your balance.</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Shop;
