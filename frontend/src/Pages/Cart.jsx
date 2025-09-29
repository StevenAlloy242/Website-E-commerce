import React, { useState } from "react";
import all_product from '../Components/Assets/all_product.js';
import CartItem from '../Components/Cart/CartItem';
import { useCart } from '../Context/CartContext';

function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();
  const [promo, setPromo] = useState("");
  const cartItems = cart.map(item => {
    const product = all_product.find(p => p.id === item.productId);
    return { ...item, ...product };
  });
  const subtotal = cartItems.reduce((sum, item) => sum + item.new_price * item.qty, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleRemove = (productId) => {
    removeFromCart(productId);
  };
  const handleQtyChange = (productId, qty) => {
    updateQty(productId, qty);
  };

  return (
    <div className="cart-page">
      <table className="cart-table">
        <thead>
          <tr>
            <th>Products</th>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <CartItem key={item.productId} item={item} onRemove={handleRemove} onQtyChange={handleQtyChange} />
          ))}
        </tbody>
      </table>
      <div className="cart-bottom">
        <div className="cart-totals">
          <h3>cart Totals</h3>
          <div className="cart-totals-row">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="cart-totals-row">
            <span>Shipping Fee</span>
            <span>Free</span>
          </div>
          <div className="cart-totals-row cart-totals-total">
            <span>Total</span>
            <span>${total}</span>
          </div>
          <button className="cart-checkout-btn" style={{marginTop: '24px', width: '100%', padding: '14px 0', background: '#e63e3e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer'}}>
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promo">
          <p>If you have a promo code, Enter it here</p>
          <form onSubmit={e => { e.preventDefault(); alert('Promo code submitted: ' + promo); }}>
            <input type="text" placeholder="promo code" value={promo} onChange={e => setPromo(e.target.value)} className="cart-promo-input" />
            <button type="submit" className="cart-promo-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
