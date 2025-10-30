import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTotalItems, getSubtotal, getCart, getGrandTotal } from "../../../features/usercart/cartSlice";


const CartSummaryBar = () => {
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  const grandTotal = useSelector(getGrandTotal);
  const totalItem = useSelector(getTotalItems);
  const items = cart?.items || [];
  const restaurantId = cart?.restaurantId;
  const navigate = useNavigate();
  const location = useLocation();
  const isCartPage = location.pathname === `/cart/${restaurantId}`;

  if (isCartPage) return null;
  if (!items || items.length === 0) return null;

  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="pointer-events-auto bg-gray-100 shadow-lg rounded-xl px-4 py-2 flex items-center gap-4 w-fit">
        <div>
          {totalItem} item{totalItem > 1 ? "s" : ""}
        </div>
        <div className="font-bold">₹{grandTotal}</div>
        <button
          onClick={() => navigate(isCartPage ? "/payment-success" : `cart/${restaurantId}`)}
          className="bg-blue-600 text-white px-4 py-1 rounded-xl hover:bg-blue-700"
        >
          View Cart
        </button>
      </div>
    </div>
  );
};

export default CartSummaryBar;
