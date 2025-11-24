import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./AdminPanel.css";
import { getLocalImage } from "../utils/imageMapper";
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, currentRole, authToken } = useAuth();
  const username = currentUser;
  const role = currentRole || 'buyer';
  const token = authToken;
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setError(null);
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      console.log('Fetching products with headers:', headers);
      // Admin sees all products, regular users see only their own
      const url = role === 'admin' ? '/api/products' : '/api/products?owner=me';
      const res = await fetch(url, { headers });
      console.log('Products response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('Products data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Products data is not an array:', data);
        setProducts([]);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleRemove = async (id) => {
    if (!confirm('Hapus produk ini?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      const d = await res.json();
      if (!res.ok) return alert(d.message || 'Gagal menghapus');
      alert('Berhasil menghapus produk');
      fetchProducts();
    } catch (err) {
      alert('Gagal menghubungi server');
    }
  };

  const handleEdit = (product) => {
    sessionStorage.setItem('editingProduct', JSON.stringify(product));
    // Dispatch event so AdminPanel (if open) can switch to Add (edit) mode immediately
    try { window.dispatchEvent(new Event('app:openAddProduct')); } catch (e) {}
    // Navigate to admin panel where AddProduct form will read editingProduct
    navigate('/admin-panel');
  };

  if (loading) return <div style={{padding: '20px'}}>Loading products...</div>;
  if (error) return <div style={{padding: '20px', color: 'red'}}>Error: {error}</div>;

  return (
    <div className="admin-product-list">
      <h2>All Products List</h2>
      {products.length === 0 ? (
        <p style={{textAlign: 'center', color: '#999'}}>No products found</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Products</th>
              <th>Title</th>
              <th>Old Price</th>
              <th>New Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><img src={getLocalImage(product)} alt={product.name} style={{width:60,borderRadius:8}} /></td>
                <td>{product.name}</td>
                <td>${product.old_price}</td>
                <td>${product.new_price}</td>
                <td style={{fontWeight: 'bold', color: (product.stock || 0) === 0 ? '#d63031' : (product.stock || 0) < 10 ? '#ff6b6b' : '#27ae60'}}>{product.stock || 0}</td>
                <td>{product.category}</td>
                <td>{product.owner_username || 'admin'}</td>
                <td>
                  {product.owner_username === username || role === 'admin' ? (
                    <button onClick={() => handleEdit(product)} style={{background:"none",border:"none",cursor:"pointer",color:"blue"}}>Edit</button>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  {product.owner_username === username || role === 'admin' ? (
                    <button onClick={() => handleRemove(product.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"red"}}>&times;</button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default ProductList;
