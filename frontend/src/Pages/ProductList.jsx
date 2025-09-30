import React from "react";
import all_product from '../Components/Assets/all_product.js';
import "./AdminPanel.css";

const ProductList = () => {
  const getLocalProducts = () => {
    const products = localStorage.getItem('products');
    return products ? JSON.parse(products) : [];
  };

  const saveLocalProducts = (products) => {
    localStorage.setItem('products', JSON.stringify(products));
  };

  const handleRemove = (id) => {
    const products = getLocalProducts();
    const updated = products.filter(p => p.id !== id);
    saveLocalProducts(updated);
    window.location.reload(); // Simple way to refresh
  };

  const handleEdit = (product) => {
    localStorage.setItem('editingProduct', JSON.stringify(product));
    alert("Go to Add Product page to edit this product.");
  };

  const allProducts = [...all_product, ...getLocalProducts()];

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
            <th>Edit</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map(product => (
            <tr key={product.id}>
              <td><img src={product.image} alt={product.name} style={{width:60,borderRadius:8}} /></td>
              <td>{product.name}</td>
              <td>${product.old_price}</td>
              <td>${product.new_price}</td>
              <td>{product.category}</td>
              <td>
                {product.added ? (
                  <button onClick={() => handleEdit(product)} style={{background:"none",border:"none",cursor:"pointer",color:"blue"}}>Edit</button>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {product.added ? (
                  <button onClick={() => handleRemove(product.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:"red"}}>&times;</button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ProductList;
