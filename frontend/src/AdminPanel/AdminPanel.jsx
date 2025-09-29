import React, { useState } from "react";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [page, setPage] = useState("list");
  return (
    <div className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-logo">SHOPPER<br /><span>Admin Panel</span></div>
        <button className={page==="add"?"active":""} onClick={()=>setPage("add")}>Add Product</button>
        <button className={page==="list"?"active":""} onClick={()=>setPage("list")}>Product List</button>
      </aside>
      <main className="admin-main">
        {page === "add" ? <AddProduct /> : <ProductList />}
      </main>
    </div>
  );
};
export default AdminPanel;
