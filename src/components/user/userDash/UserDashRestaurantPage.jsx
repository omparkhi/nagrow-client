import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserDashRestaurantPage = () => {
  const { id } = useParams(); // restaurantId from url
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/restaurants/${id}`
        );
        if (data.success) {
          setRestaurant(data.restaurant);
          setMenu(data.menu);
        }
      } catch (err) {
        console.log("Error fetching restaurant details", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        loading...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-screen text-lg text-red-600">
        Restaurant not found
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Restaurant header */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600 mt-2">{restaurant.cuisine}</p>
          <p className="text-gray-600">
            Address: {restaurant.address.street}, {restaurant.address.city},{" "}
            {restaurant.address.state} - {restaurant.address.pincode}
          </p>
          <p className="mt-3 text-yellow-500 font-semibold">
            ⭐ {restaurant.rating} | ⏱ {restaurant.deliveryTime}
          </p>
        </div>
      </div>

      {/* menu section */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Menu</h2>
        {Object.keys(menu).map((category) => (
          <div key={category} className="mb-10">
            <h3 className="text-xl font-bold mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menu[category].map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="font-bold mt-2">₹{item.price}</p>
                  </div>
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    Add +
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashRestaurantPage;
