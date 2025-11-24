import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import "./AdminPanel.css";
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const editingProduct = sessionStorage.getItem('editingProduct');
    if (editingProduct) {
      const product = JSON.parse(editingProduct);
      setName(product.name);
      setOldPrice(product.old_price);
      setNewPrice(product.new_price);
      setCategory(product.category);
      setImage(product.image);
      setStock(product.stock ?? 0);
      setEditing(true);
      setEditingId(product.id);
    }
  }, []);

  const clearForm = () => {
    setName(""); setOldPrice(""); setNewPrice(""); setCategory(""); setImage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = authToken;
    if (!token) return alert('Anda harus login terlebih dahulu');

    const payload = {
      name,
      old_price: parseFloat(oldPrice),
      new_price: parseFloat(newPrice),
      category,
      image,
      stock: parseInt(stock || 0)
    };

    try {
      if (editing) {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const d = await res.json();
          alert(d.message || 'Gagal mengupdate produk');
        } else {
          alert('Product updated!');
          sessionStorage.removeItem('editingProduct');
          setEditing(false);
          setEditingId(null);
          clearForm();
          // go back to admin panel list
          try { window.dispatchEvent(new Event('app:afterEdit')); } catch(e) {}
          navigate('/admin-panel');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const d = await res.json();
          alert(d.message || 'Gagal menambah produk');
        } else {
          alert('Product added!');
          clearForm();
        }
      }
    } catch (err) {
      alert('Gagal menghubungi server');
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem('editingProduct');
    setEditing(false);
    setEditingId(null);
    clearForm();
    navigate('/admin-panel');
  };

  return (
    <div className="admin-add-product">
      <h2>{editing ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input type="text" placeholder="Product Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="number" placeholder="Old Price" value={oldPrice} onChange={e=>setOldPrice(e.target.value)} required />
        <input type="number" placeholder="New Price" value={newPrice} onChange={e=>setNewPrice(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={image} onChange={e=>setImage(e.target.value)} required />
        <input type="number" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />
        <div style={{display:'flex',gap:8}}>
          <button type="submit">{editing ? "Update Product" : "Add Product"}</button>
          {editing && <button type="button" onClick={handleCancel} style={{background:'#ccc'}}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};
export default AddProduct;
