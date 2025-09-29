import React, { useState } from "react";
import "./AdminPanel.css";

const AddDiscount = ({ onAdd }) => {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!code || !value) return;
    onAdd(code, Number(value));
    setCode(""); setValue("");
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit} style={{marginTop:24}}>
      <input type="text" placeholder="Discount Code" value={code} onChange={e=>setCode(e.target.value)} required />
      <input type="number" placeholder="Value (%)" value={value} onChange={e=>setValue(e.target.value)} required min={1} max={100} />
      <button type="submit">Add Discount</button>
    </form>
  );
};
export default AddDiscount;
