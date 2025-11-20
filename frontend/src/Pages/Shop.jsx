import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import './Shop.css';
import hero_image from '../Components/Assets/hero_image.png';
import hand_icon from '../Components/Assets/hand_icon.png';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const { isLoggedIn, currentUser, balance, topUp, refreshProfile } = useAuth();
  const [topupAmount, setTopupAmount] = useState('');
  const [topupLoading, setTopupLoading] = useState(false);
  const [topupError, setTopupError] = useState('');

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

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
            {products.slice(0, 8).map((product) => (
              <a key={product.id} href={`/product/${product.id}`} style={{textDecoration:'none',color:'inherit'}}>
                <div className="shop-product-item">
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>Rp {Number(product.new_price).toLocaleString()}</p>
                  <span className="shop-product-old">{product.old_price ? `Rp ${Number(product.old_price).toLocaleString()}` : ''}</span>
                </div>
              </a>
            ))}
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
