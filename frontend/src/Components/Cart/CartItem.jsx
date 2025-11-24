import React from "react";
import cart_cross_icon from "../Assets/cart_cross_icon.png";
import { getLocalImage } from "../../utils/imageMapper";

const CartItem = ({ item, onRemove, onQtyChange }) => {
  return (
    <tr className="cart-item-row">
      <td className="cart-item-img-cell">
        <img src={getLocalImage(item)} alt={item.name} className="cart-item-img" />
      </td>
      <td className="cart-item-title">{item.name}</td>
      <td className="cart-item-size">{item.size}</td>
      <td className="cart-item-price">${item.new_price}</td>
      <td className="cart-item-qty">
        <input type="number" min={1} value={item.qty} onChange={e => onQtyChange(item.productId, item.size, Number(e.target.value))} className="cart-qty-input" />
      </td>
      <td className="cart-item-total">${item.new_price * item.qty}</td>
      <td className="cart-item-remove">
        <button onClick={() => onRemove(item.productId, item.size)} className="cart-remove-btn">
          <img src={cart_cross_icon} alt="Remove" />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
