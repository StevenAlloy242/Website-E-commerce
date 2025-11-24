import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLocalImage } from '../utils/imageMapper';
import axios from 'axios';

const ShopCategory = ({ category }) => {
  let title = '';
  const [filteredProducts, setFilteredProducts] = useState([]);
  switch (category) {
    case 'Men':
      title = 'Men Collection';
      break;
    case 'Women':
      title = 'Women Collection';
      break;
    case 'Kids':
      title = 'Kids Collection';
      break;
    case 'Cart':
      title = 'Your Cart';
      return <div className="shop-category"><h2>{title}</h2><p>Cart page placeholder (isi keranjang akan tampil di sini).</p></div>;
    case 'Login':
      title = 'Login / Sign Up';
      return <div className="shop-category"><h2>{title}</h2><p>Login page placeholder (form login/sign up akan tampil di sini).</p></div>;
    default:
      title = 'Category';
  }

  useEffect(() => {
    // Fetch products from backend and filter by category so stock values are accurate
    const load = async () => {
      try {
        const res = await axios.get('/api/products');
        const prods = Array.isArray(res.data) ? res.data : [];
        let catKey = '';
        if (category === 'Men') catKey = 'men';
        if (category === 'Women') catKey = 'women';
        if (category === 'Kids') catKey = 'kid';
        setFilteredProducts(prods.filter(p => (p.category || '').toLowerCase() === catKey));
      } catch (e) {
        console.error('Failed to load products for category', e);
        setFilteredProducts([]);
      }
    };
    load();
  }, [category]);

  return (
    <div className="shop-category">
      <h2>{title}</h2>
      <div className="shop-product-list">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} style={{textDecoration:'none',color:'inherit'}}>
              <div className="shop-product-item">
                <img src={getLocalImage(product)} alt={product.name}/>
                <h3>{product.name}</h3>
                <p>Rp {product.new_price.toLocaleString()}</p>
                <span className="shop-product-old">{product.old_price ? `Rp ${Number(product.old_price).toLocaleString()}` : ''}</span>
                <div className={`shop-product-stock ${product.stock === 0 ? 'out' : product.stock < 10 ? 'low' : ''}`}>Stok: {product.stock ?? 0}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ShopCategory;
