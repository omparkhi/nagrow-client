import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrderById } from "../../../features/restaurant/orderSlice";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import OrderSound from "../../../assets/Notification/order.mp3";
import DeliveryRouteMap from "../../maps/DeliveryRouteMap";

const UserOrderPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    // const currentOrderId = localStorage.getItem("currentOrderId");
    const { currentOrder, loading, error } = useSelector((state) => state.orders);

    const stageOrderRank = (stage) => {
  const stages = {
    placed: 1,
    accepted: 2,
    preparing: 3,
    ready: 4,
    "on the way": 5,
    delivered: 6,
  };
  return stages[stage] || 0;
};


const audio = useRef(null);
    useEffect(() => {
        if(!id) return;
        dispatch(fetchUserOrderById(id));
        

        audio.current = new Audio(OrderSound);

        const socket = io("http://localhost:3000");
        socket.emit("joinOrderRoom", {orderId: id});

        // const audio = new Audio(OrderSound); 

        socket.on("orderStatusUpdate", (data) => {
            if(data._id === id) {
                audio.current.play().catch(() => {
                    document.addEventListener("click", () => audio.current.play(), { once: true });
                });

                toast.info(data.message);
                dispatch(fetchUserOrderById(id));
                
            }
        });

        
        return () => {
            socket.off("orderStatusUpdate");
            socket.disconnect();
        }
    }, [id, dispatch]);

    useEffect(() => {
  if (currentOrder) {
    console.log("Updated order:", currentOrder);
  }
}, [currentOrder]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error.message}</p>;
    if (!currentOrder) return <p>No order found</p>;
  

    return (
        <div className="max-w-xl mx-auto p-4">
           <DeliveryRouteMap
            restaurantLocation={{
              lat: currentOrder.restaurantId.address.location.coordinates[1],
              lng: currentOrder.restaurantId.address.location.coordinates[0],
            }}
            deliveryLocation={{
              lat: currentOrder.deliveryAddress.coordinates[1],
              lng: currentOrder.deliveryAddress.coordinates[0],
            }}
            riderLocation={
              currentOrder.riderId?.location
                ? {
                    lat: currentOrder.riderId.location.coordinates[1],
                    lng: currentOrder.riderId?.location.coordinates[0],
                  }
                : null
            } 

          />
         
      <h2 className="text-xl font-bold mb-2">Order Details</h2>

      <div className="bg-white shadow p-4 rounded-md">
        <p className="font-semibold">Order No: #{currentOrder.orderId}</p>
        <p>Status: <strong className="capitalize">{currentOrder.status}</strong></p>

        <h3 className="mt-3 font-semibold">Items:</h3>
        {currentOrder.items.map((order) => (
          <div key={order._id} className="text-sm">
            {order.menuItemId?.name ?? "Unknown"} x {order.quantity} @ ₹{order.menuItemId?.price}
          </div>
        ))}

        <p className="mt-3">Delivery Address:</p>
        <p className="text-sm">{currentOrder.deliveryAddress.formattedAddress}</p>

        <p className="mt-2">Payment: {currentOrder.paymentType} ({currentOrder.paymentStatus})</p>
        <p className="mt-2 font-semibold">Total: ₹{currentOrder.totalAmount}</p>
      </div>

      {/* Status Steps */}
      <div className="mt-5">
        <h3 className="font-semibold mb-2">Order Tracking</h3>
        <div className="space-y-2">
          {["placed", "accepted", "preparing", "ready", "on the way", "delivered"]
            .map((stage) => (
              <div key={stage} className={`p-2 rounded ${
                stage === currentOrder.status ? "bg-green-200" :
                stageOrderRank(stage) < stageOrderRank(currentOrder.status) ? "bg-green-100" :
                "bg-gray-100"
              }`}>
                {stage.toUpperCase()}
              </div>
          ))}
        </div>
      </div>
      <button onClick={() => new Audio(OrderSound).play()}>Test Sound</button>

    </div>
    
    )
};

export default UserOrderPage;