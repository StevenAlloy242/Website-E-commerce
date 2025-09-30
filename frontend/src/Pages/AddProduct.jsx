import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const editingProduct = localStorage.getItem('editingProduct');
    if (editingProduct) {
      const product = JSON.parse(editingProduct);
      setName(product.name);
      setOldPrice(product.old_price);
      setNewPrice(product.new_price);
      setCategory(product.category);
      setImage(product.image);
      setEditing(true);
      setEditingId(product.id);
    }
  }, []);

  const getProducts = () => {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  };

  const saveProducts = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const products = getProducts();
    if (editing) {
      const index = products.findIndex(p => p.id === editingId);
      if (index !== -1) {
        products[index] = {
          id: editingId,
          name,
          old_price: parseFloat(oldPrice),
          new_price: parseFloat(newPrice),
          category,
          image,
          added: true
        };
      }
      localStorage.removeItem('editingProduct');
      setEditing(false);
      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        old_price: parseFloat(oldPrice),
        new_price: parseFloat(newPrice),
        category,
        image,
        added: true
      };
      products.push(newProduct);
    }
    saveProducts(products);
    alert(editing ? "Product updated!" : "Product added!");
    setName(""); setOldPrice(""); setNewPrice(""); setCategory(""); setImage("");
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
        <button type="submit">{editing ? "Update Product" : "Add Product"}</button>
      </form>
    </div>
  );
};
export default AddProduct;
