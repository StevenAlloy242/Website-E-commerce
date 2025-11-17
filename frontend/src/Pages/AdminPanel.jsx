import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [page, setPage] = useState("list");
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, logout, authToken } = useAuth();

  useEffect(() => {
    // Redirect jika tidak ada token
    if (!authToken) {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-logo">SHOPPER<br /><span>Seller Panel</span></div>
        <div style={{padding: '10px 16px', color: '#666'}}>Signed in as: <strong>{currentUser}</strong></div>
        <button className={page==="add"?"active":""} onClick={()=>setPage("add")}>Add Product</button>
        <button className={page==="list"?"active":""} onClick={()=>setPage("list")}>Product List</button>
        <button onClick={handleLogout}>Logout</button>
      </aside>
      <main className="admin-main">
        {page === "add" ? <AddProduct /> : <ProductList />}
      </main>
    </div>
  );
};
export default AdminPanel;
