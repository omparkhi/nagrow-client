import { useSelector, useDispatch } from "react-redux";
import { fetchOrder } from "../../../features/restaurant/orderSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
    const dispatch = useDispatch();
    const restaurantId = localStorage.getItem("restaurantId");

    const { list: orders, loading, error } = useSelector(
    (state) => state.orders
  );

  console.log(orders);


     useEffect(() => {
    if (restaurantId) dispatch(fetchOrder(restaurantId));
  }, [restaurantId]);

    return(
        <div>
      <h1>Orders</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {orders?.length > 0 ? (
        orders.map((order) => (
          <div key={order.orderId} onClick={() => navigate(`/get/order/${order._id}`)}  className="border p-2 my-2">
            <b>Order #{order.orderId}</b> <br />
            Status: {order.status} <br />
            Amount: ₹{order.totalAmount} <br />
            Items:{" "}
            {order.items
              .map(
                (i) =>
                  `${i.menuItemId?.name ?? "Unknown"} x ${i.quantity}`
              )
              .join(", ")}

          </div>
        ))
      ) : (
        !loading && <p>No orders found.</p>
      )}
    </div>
    )
}

export default OrderPage;