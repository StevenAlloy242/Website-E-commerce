
import React from 'react';
import hero_image from '../Components/Assets/hero_image.png';
import hand_icon from '../Components/Assets/hand_icon.png';
import all_product from '../Components/Assets/all_product.js';

const Shop = () => {
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
      <div className="shop-products">
        <h2>All Products</h2>
        <div className="shop-product-list">
          {all_product.slice(0, 8).map((product) => (
            <a key={product.id} href={`/product/${product.id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div className="shop-product-item">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Rp {product.new_price.toLocaleString()}</p>
                <span className="shop-product-old">Rp {product.old_price.toLocaleString()}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;
