import React, { useState } from "react";
import all_product from '../Components/Assets/all_product.jsx';
import CartItem from '../Components/Cart/CartItem';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContext';

function Cart() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { authToken, balance, refreshProfile } = useAuth();
  const [promo, setPromo] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const getAllProducts = () => {
    const localProducts = localStorage.getItem('products');
    const local = localProducts ? JSON.parse(localProducts) : [];
    return [...all_product, ...local];
  };

  const allProducts = getAllProducts();

  const cartItems = cart.map(item => {
    const product = allProducts.find(p => p.id === item.productId);
    return { ...item, ...product };
  });
  const subtotal = cartItems.reduce((sum, item) => sum + item.new_price * item.qty, 0);
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const handleRemove = (productId, size) => {
    removeFromCart(productId, size);
  };
  const handleQtyChange = (productId, size, qty) => {
    updateQty(productId, size, qty);
  };

  const handleCheckout = async () => {
    setCheckoutError("");
    setCheckoutSuccess(false);
    
    console.log('Checkout started. Cart:', cart, 'Total:', total, 'Token:', authToken, 'Balance:', balance);
    
    if (!authToken) {
      setCheckoutError("Please login to checkout");
      return;
    }
    
    if (cart.length === 0) {
      setCheckoutError("Cart is empty");
      return;
    }
    
    if (balance < total) {
      setCheckoutError(`Insufficient balance. You have Rp ${Number(balance || 0).toLocaleString()} but need Rp ${Number(total).toLocaleString()}`);
      return;
    }

    try {
      setCheckoutLoading(true);
      const payload = { items: cart, total };
      console.log('Sending checkout request:', payload);
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });
      
      console.log('Checkout response status:', res.status);
      const data = await res.json();
      console.log('Checkout response data:', data);
      
      if (!res.ok) {
        throw new Error(data.message || 'Checkout failed');
      }
      
      const { orderId, newBalance } = data;
      setCheckoutSuccess(true);
      setCheckoutError("");
      clearCart();
      await refreshProfile();
      setCheckoutLoading(false);
      
      // Auto-hide success msg after 3s
      setTimeout(() => setCheckoutSuccess(false), 3000);
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutLoading(false);
      setCheckoutError(err.message || 'Checkout failed');
    }
  };

  return (
    <div className="cart-page">
      <table className="cart-table">
        <thead>
          <tr>
            <th>Products</th>
            <th>Title</th>
            <th>Size</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map(item => (
            <CartItem key={item.productId + '-' + item.size} item={item} onRemove={handleRemove} onQtyChange={handleQtyChange} />
          ))}
        </tbody>
      </table>
      <div className="cart-bottom">
        <div className="cart-totals">
          <h3>cart Totals</h3>
          <div className="cart-totals-row">
            <span>Subtotal</span>
            <span>Rp {Number(subtotal).toLocaleString()}</span>
          </div>
          <div className="cart-totals-row">
            <span>Shipping Fee</span>
            <span>Free</span>
          </div>
          <div className="cart-totals-row cart-totals-total">
            <span>Total</span>
            <span>Rp {Number(total).toLocaleString()}</span>
          </div>
          {authToken && (
            <div className="cart-totals-row" style={{fontSize:'0.9rem',color:'#666'}}>
              <span>Your Balance</span>
              <span>Rp {Number(balance || 0).toLocaleString()}</span>
            </div>
          )}
          {checkoutSuccess && <div style={{marginTop:8,padding:8,background:'#4caf50',color:'#fff',borderRadius:4,textAlign:'center'}}>✓ Order placed successfully!</div>}
          {checkoutError && <div style={{marginTop:8,padding:8,background:'#f44336',color:'#fff',borderRadius:4}}>{checkoutError}</div>}
          <button onClick={handleCheckout} disabled={checkoutLoading || cart.length === 0} className="cart-checkout-btn" style={{marginTop: '24px', width: '100%', padding: '14px 0', background: checkoutLoading ? '#ccc' : '#e63e3e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: checkoutLoading || cart.length === 0 ? 'not-allowed' : 'pointer'}}>
            {checkoutLoading ? 'Processing...' : 'PROCEED TO CHECKOUT'}
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
