import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import './BuyerPanel.css';

export default function BuyerPanel(){
  const { authToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productNames, setProductNames] = useState({});

  const loadOrders = async ()=>{
    if(!authToken) return;
    setLoading(true);
    try{
      const oRes = await fetch('/api/orders', { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (oRes.ok) {
        const ordersData = await oRes.json();
        setOrders(ordersData);
        // Load product names for all items in orders
        const pRes = await fetch('/api/products');
        if (pRes.ok) {
          const products = await pRes.json();
          const nameMap = {};
          products.forEach(p => nameMap[p.id] = p.name);
          setProductNames(nameMap);
        }
      }
      const nRes = await fetch('/api/users/notifications', { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (nRes.ok) setNotifications((await nRes.json()).notifications || []);
    }catch(err){
      console.error('BuyerPanel load error', err);
    }finally{setLoading(false)}
  };

  useEffect(()=>{
    loadOrders();
  }, [authToken]);

  const clearNotifications = async ()=>{
    try{
      const res = await fetch('/api/users/notifications/clear', { method: 'POST', headers: { 'Authorization': `Bearer ${authToken}` } });
      if(res.ok) setNotifications([]);
    }catch(e){console.error(e)}
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        alert('Order cancelled');
        loadOrders(); // Auto-refresh
      } else {
        const errData = await res.json();
        alert(`Cancel failed: ${errData.message}`);
      }
    } catch (err) {
      console.error('Cancel order error', err);
      alert('Error cancelling order');
    }
  };

  const parseItems = (itemsJson) => {
    try {
      return JSON.parse(itemsJson);
    } catch (e) {
      return [];
    }
  };

  const getItemsSummary = (itemsJson) => {
    const items = parseItems(itemsJson);
    return items.map(item => `${productNames[item.productId] || `Product #${item.productId}`} x${item.qty}`).join(', ');
  };

  return (
    <div className="buyer-panel">
      <aside className="buyer-sidebar">
        <div className="buyer-logo">SHOPPER<br /><span>Buyer Panel</span></div>
        <button onClick={loadOrders}>Refresh</button>
      </aside>

      <main className="buyer-main">
        <section className="buyer-section">
          <h3>Notifications <button onClick={clearNotifications} className="btn-clear">Clear</button></h3>
          {notifications.length === 0 ? <p>No notifications</p> : (
            <ul className="notifications-list">
              {notifications.map((n,i)=>(<li key={i}>{n.message} <small>({new Date(n.created_at).toLocaleString()})</small></li>))}
            </ul>
          )}
        </section>

        <section className="buyer-section">
          <h3>Your Orders</h3>
          {loading ? <p>Loading...</p> : (
            orders.length === 0 ? <p>No orders yet</p> : (
              <div className="orders-list">
                {orders.map(o=> {
                  const items = parseItems(o.items_json);
                  return (
                    <div key={o.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <strong>Order #{o.id}</strong>
                          <div className="order-items-summary">{getItemsSummary(o.items_json)}</div>
                        </div>
                        <span className={`order-status status-${o.status}`}>{o.status}</span>
                      </div>
                      <div className="order-date">{new Date(o.created_at).toLocaleString()}</div>
                      <div className="order-items">
                        <strong>Items ({items.length}):</strong>
                        <ul>
                          {items.map((item, idx) => (
                            <li key={idx}>{productNames[item.productId] || `Product #${item.productId}`} - Size: {item.size} - Qty: {item.qty}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="order-total">Total: ${Number(o.total_amount).toFixed(2)}</div>
                      <div className="order-actions">
                        {(o.status === 'shipped' || o.status === 'delivered') && (
                          <button onClick={() => cancelOrder(o.id)} className="btn-cancel">Cancel Order</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}
