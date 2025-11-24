import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getCartCount } = useCart();
  const { isLoggedIn, currentUser, currentRole, logout } = useAuth();
  const cartCount = getCartCount();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar navbar-custom">
      {/* Logo */}
      <div className="nav-logo">
        <img src={logo} alt="logo" />
        <p>SHOPPER</p>
      </div>

      {/* Menu */}
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}> <Link to="/">Shop</Link> {menu === "shop" ? <hr /> : <></>} </li>
        <li onClick={() => setMenu("men")}> <Link to="/men">Men</Link> {menu === "men" ? <hr /> : <></>} </li>
        <li onClick={() => setMenu("women")}> <Link to="/women">Women</Link> {menu === "women" ? <hr /> : <></>} </li>
        <li onClick={() => setMenu("kids")}> <Link to="/kids">Kids</Link> {menu === "kids" ? <hr /> : <></>} </li>
      </ul>

      {/* Cart + Login */}
      <div className="nav-login-cart" style={{position:'relative'}}>
        {isLoggedIn ? (
          <div className="user-info">
            <span>Welcome, {currentUser}</span>
            <Link to="/admin-panel">
              <button className="seller-btn">Seller Panel</button>
            </Link>
            <Link to="/buyer-panel">
              <button className="buyer-btn">Buyer Panel</button>
            </Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{cartCount}</div>
      </div>
    </div>
  );
};

export default Navbar;