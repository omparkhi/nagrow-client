import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById } from "../../../features/restaurant/orderSlice";
import  OrderStatusUpdate from "./OrderStatusUpdate";

const OrderDetails = () => {
    const dispatch = useDispatch();
    const currentOrderId = localStorage.getItem("currentOrderId");
    const {currentOrder, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        if (currentOrderId) {
            dispatch(fetchOrderById(currentOrderId));
        } 
      }, [currentOrderId, dispatch]);


      if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error.message || error}</p>;
  if (!currentOrder) return <p>No order found</p>;

  const { currentOrderId: id, orderId, status, items, deliveryAddress, paymentStatus, paymentType, totalAmount, userId } = currentOrder;
    return (
        <div>
      <h1>Order Details</h1>

      <h2>Order No: #{orderId}</h2>
      <h2>order status: {status}</h2>
      <OrderStatusUpdate />

      <h3>Items:</h3>
      <ul>
        {items.map((item, idx) => (
          <li key={idx}>
            {item.menuItemId?.name ?? "Unknown"} x {item.quantity} @ ₹{item.menuItemId?.price ?? 0}
          </li>
        ))}
      </ul>

      <h3>Delivery Address: {deliveryAddress}</h3>
      <h3>Payment Status: {paymentStatus}</h3>
      <h3>Payment Type: {paymentType}</h3>
      <h3>Total: ₹{totalAmount}</h3>
      <h3>User Phone: {userId?.phone}</h3>
    </div>
    );
}

export default OrderDetails;