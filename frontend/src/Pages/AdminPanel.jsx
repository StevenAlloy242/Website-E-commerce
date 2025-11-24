import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [page, setPage] = useState("list");
  const [orders, setOrders] = useState([]);
  const [productNames, setProductNames] = useState({});
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout, authToken } = useAuth();

  const loadOrders = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/orders/all', { headers: { 'Authorization': `Bearer ${authToken}` } });
      if (res.ok) { 
        setOrders(await res.json());
        // Load product names
        const pRes = await fetch('/api/products');
        if (pRes.ok) {
          const products = await pRes.json();
          const nameMap = {};
          products.forEach(p => nameMap[p.id] = p.name);
          setProductNames(nameMap);
        }
        console.log('Orders loaded');
      }
    } catch (e) { 
      console.error('Load orders error', e); 
    }
  };

  useEffect(() => {
    // Redirect jika tidak ada token
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  useEffect(() => {
    // If editingProduct exists (from ProductList edit), open Add page
    const editingProduct = sessionStorage.getItem('editingProduct');
    if (editingProduct) {
      setPage('add');
    }
  }, []);

  useEffect(() => {
    const onOpen = () => setPage('add');
    window.addEventListener('app:openAddProduct', onOpen);
    return () => window.removeEventListener('app:openAddProduct', onOpen);
  }, []);

  useEffect(() => {
    const onAfterEdit = () => {
      // after edit completes, ensure we're back to list and clear editing state
      sessionStorage.removeItem('editingProduct');
      setPage('list');
    };
    window.addEventListener('app:afterEdit', onAfterEdit);
    return () => window.removeEventListener('app:afterEdit', onAfterEdit);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert(`Order marked ${status}`);
        loadOrders(); // Auto-refresh
      }
    } catch (e) {
      console.error('Update status error', e);
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
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-logo">SHOPPER<br /><span>Seller Panel</span></div>
        <div style={{padding: '10px 16px', color: '#666'}}>Signed in as: <strong>{currentUser}</strong></div>
        <button className={page==="add"?"active":""} onClick={()=>{ sessionStorage.removeItem('editingProduct'); setPage("add")}}>Add Product</button>
        <button className={page==="list"?"active":""} onClick={()=>{ sessionStorage.removeItem('editingProduct'); setPage("list")}}>Product List</button>
        <button className={page==="orders"?"active":""} onClick={()=>{ sessionStorage.removeItem('editingProduct'); setPage("orders"); loadOrders();}}>Orders</button>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-main">
        {page === "add" ? <AddProduct /> : page === 'orders' ? (
          <div style={{padding:20}}>
            <h3>All Orders <button onClick={loadOrders} style={{marginLeft:10, padding:'6px 12px', backgroundColor:'#2196F3', color:'white', border:'none', borderRadius:'4px', cursor:'pointer'}}>Refresh</button></h3>
            <div style={{marginTop:12}}>
              {orders.length === 0 ? <p>No orders</p> : orders.map(o=> {
                const items = parseItems(o.items_json);
                return (
                  <div key={o.id} style={{border:'1px solid #ddd', padding:12, marginBottom:12, borderRadius:'6px', backgroundColor:'#f9f9f9'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8, gap:'15px'}}>
                      <div>
                        <strong style={{fontSize:'16px'}}>#{o.id} by {o.username}</strong>
                        <div style={{fontSize:'13px', color:'#666', marginTop:'4px', fontStyle:'italic'}}>{getItemsSummary(o.items_json)}</div>
                      </div>
                      <span style={{backgroundColor:o.status==='shipped'?'#bbdefb':o.status==='delivered'?'#a5d6a7':o.status==='completed'?'#c8e6c9':'#ffcccc', padding:'4px 12px', borderRadius:'12px', fontSize:'12px', fontWeight:'600', whiteSpace:'nowrap'}}>{o.status}</span>
                    </div>
                    <div style={{color:'#999', fontSize:'13px', marginBottom:8}}>{new Date(o.created_at).toLocaleString()}</div>
                    <div style={{backgroundColor:'#f0f0f0', padding:'10px', borderRadius:'4px', marginBottom:10, fontSize:'13px'}}>
                      <strong>Items ({items.length}):</strong>
                      <ul style={{listStyle:'none', padding:0, margin:'6px 0 0 0'}}>
                        {items.map((item, idx) => (
                          <li key={idx} style={{padding:'4px 0', color:'#555'}}>{productNames[item.productId] || `Product #${item.productId}`} - Size: {item.size} - Qty: {item.qty}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{fontWeight:'600', marginBottom:12}}>Total: ${Number(o.total_amount).toFixed(2)}</div>
                    <div style={{display:'flex', gap:'8px'}}>
                      <button onClick={()=>updateOrderStatus(o.id, 'completed')} disabled={o.status === 'completed'} style={{padding:'6px 12px', backgroundColor:o.status === 'completed' ? '#ccc' : '#8BC34A', color:'white', border:'none', borderRadius:'4px', cursor:o.status === 'completed' ? 'not-allowed' : 'pointer', fontSize:'12px', opacity:o.status === 'completed' ? 0.6 : 1}}>Complete</button>
                      <button onClick={()=>updateOrderStatus(o.id, 'shipped')} disabled={o.status === 'completed'} style={{padding:'6px 12px', backgroundColor:o.status === 'completed' ? '#ccc' : '#2196F3', color:'white', border:'none', borderRadius:'4px', cursor:o.status === 'completed' ? 'not-allowed' : 'pointer', fontSize:'12px', opacity:o.status === 'completed' ? 0.6 : 1}}>Mark Shipped</button>
                      <button onClick={()=>updateOrderStatus(o.id, 'delivered')} disabled={o.status === 'completed'} style={{padding:'6px 12px', backgroundColor:o.status === 'completed' ? '#ccc' : '#4CAF50', color:'white', border:'none', borderRadius:'4px', cursor:o.status === 'completed' ? 'not-allowed' : 'pointer', fontSize:'12px', opacity:o.status === 'completed' ? 0.6 : 1}}>Mark Delivered</button>
                      <button onClick={()=>updateOrderStatus(o.id, 'cancelled')} disabled={o.status === 'completed'} style={{padding:'6px 12px', backgroundColor:o.status === 'completed' ? '#ccc' : '#f44336', color:'white', border:'none', borderRadius:'4px', cursor:o.status === 'completed' ? 'not-allowed' : 'pointer', fontSize:'12px', opacity:o.status === 'completed' ? 0.6 : 1}}>Cancel Order</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : <ProductList />}
      </main>
    </div>
  );
};
export default AdminPanel;
