import React from "react";
import all_product from '../Components/Assets/all_product.js';
import "./AdminPanel.css";

const ProductList = () => {
  return (
    <div className="admin-product-list">
      <h2>All Products List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Products</th>
            <th>Title</th>
            <th>Old Price</th>
            <th>New Price</th>
            <th>Category</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {all_product.map(product => (
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} style={{width:60,borderRadius:8}} /></td>
              <td>{product.name}</td>
              <td>${product.old_price}</td>
              <td>${product.new_price}</td>
              <td>{product.category}</td>
              <td><button style={{background:"none",border:"none",cursor:"pointer",fontSize:20}}>&times;</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ProductList;
