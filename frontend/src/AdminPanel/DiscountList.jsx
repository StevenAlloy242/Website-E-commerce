import React, { useState } from "react";
import AddDiscount from "./AddDiscount";
import "./AdminPanel.css";

const initialDiscounts = [
  { code: "DISKON10", value: 10 },
  { code: "DISKON20", value: 20 }
];

const DiscountList = () => {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const handleAdd = (code, value) => {
    setDiscounts([...discounts, { code, value }]);
  };
  const handleRemove = code => {
    setDiscounts(discounts.filter(d => d.code !== code));
  };
  return (
    <div className="admin-discount-list">
      <h2>Discount List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Value (%)</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map(d => (
            <tr key={d.code}>
              <td>{d.code}</td>
              <td>{d.value}%</td>
              <td><button style={{background:"none",border:"none",cursor:"pointer",fontSize:20}} onClick={()=>handleRemove(d.code)}>&times;</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddDiscount onAdd={handleAdd} />
    </div>
  );
};
export default DiscountList;
