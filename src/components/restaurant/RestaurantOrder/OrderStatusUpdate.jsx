import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus } from "../../../features/restaurant/orderSlice";

const OrderStatusUpdate = () => {
    const dispatch = useDispatch();
    const { currentOrder, loading } = useSelector((state) => state.orders);
    if(!currentOrder) return null;

    const handleStatusChange = (nextStatus) => {
        if(loading) return;dispatch(updateOrderStatus({ id: currentOrder._id, status: nextStatus }));

    }

    const statusFlow = {
        placed: "accepted",
        accepted: "preparing",
        preparing: "ready",
        ready: "on the way",
        "on the way": "delivered",
    }

    const nextStatus = statusFlow[currentOrder.status];


    return (
        <div>
            {nextStatus && (
                <button 
                    onClick={() => handleStatusChange(nextStatus)}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    mark as {nextStatus}
                </button>
                
            )}

            {currentOrder.status !== "cancelled" && currentOrder.status !== "delivered" && (
        <button
          onClick={() => handleStatusChange("cancelled")}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded ml-2"
        >
          Cancel Order
        </button>
      )}
        </div>
    );
}

export default OrderStatusUpdate;