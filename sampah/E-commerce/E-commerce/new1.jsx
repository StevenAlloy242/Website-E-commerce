import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import "./CSS/ShopCategory.css";
import men_banner from "../Components/Assets/banner_mens.png";
import women_banner from "../Components/Assets/banner_women.png";
import kids_banner from "../Components/Assets/banner_kids.png";

const ShopCategory = (props) => {
  const { all_products } = useContext(ShopContext);
  return (
    <div className="shop-category">
      <img src={props.banner} alt="" />
    </div>
  );
};

export default ShopCategory;
