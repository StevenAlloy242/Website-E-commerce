import React, { useState } from "react";
import "./AdminPanel.css";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    alert("Product added (dummy, frontend only)");
    setName(""); setOldPrice(""); setNewPrice(""); setCategory(""); setImage("");
  };

  return (
    <div className="admin-add-product">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <input type="text" placeholder="Product Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="number" placeholder="Old Price" value={oldPrice} onChange={e=>setOldPrice(e.target.value)} required />
        <input type="number" placeholder="New Price" value={newPrice} onChange={e=>setNewPrice(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
        <input type="text" placeholder="Image URL" value={image} onChange={e=>setImage(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};
export default AddProduct;
