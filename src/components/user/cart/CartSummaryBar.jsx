import React from 'react';
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const CartSummaryBar = () => {
    const{ getTotalItems, getSubtotal, items } = useCart();
    const navigate = useNavigate();

    if(!items || items.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-4 w-fit">
        <div>{getTotalItems()} item{getTotalItems() > 1 ? "s" : ""}</div>
        <div className="font-bold">₹{getSubtotal()}</div>
        <button 
            onClick={() => navigate("/user-cart")}
            className="bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700"
        >
            Go to Cart
        </button>
      </div>
    </div>
  );
};

export default CartSummaryBar;
