import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from '../../Context/CartContext';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    const user = sessionStorage.getItem('currentUser') || '';
    setIsLoggedIn(loggedIn);
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('userLoggedIn');
    sessionStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setCurrentUser('');
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