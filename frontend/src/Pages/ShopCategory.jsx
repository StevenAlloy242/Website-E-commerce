import React from 'react';
import all_product from '../Components/Assets/all_product.js';
import { Link } from 'react-router-dom';

const ShopCategory = ({ category }) => {
  let title = '';
  let filteredProducts = [];
  switch (category) {
    case 'Men':
      title = 'Men Collection';
      filteredProducts = all_product.filter(p => p.category === 'men');
      break;
    case 'Women':
      title = 'Women Collection';
      filteredProducts = all_product.filter(p => p.category === 'women');
      break;
    case 'Kids':
      title = 'Kids Collection';
      filteredProducts = all_product.filter(p => p.category === 'kid');
      break;
    case 'Cart':
      title = 'Your Cart';
      return <div className="shop-category"><h2>{title}</h2><p>Cart page placeholder (isi keranjang akan tampil di sini).</p></div>;
    case 'Login':
      title = 'Login / Sign Up';
      return <div className="shop-category"><h2>{title}</h2><p>Login page placeholder (form login/sign up akan tampil di sini).</p></div>;
    default:
      title = 'Category';
      filteredProducts = [];
  }

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
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Rp {product.new_price.toLocaleString()}</p>
                <span className="shop-product-old">Rp {product.old_price.toLocaleString()}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default ShopCategory;
