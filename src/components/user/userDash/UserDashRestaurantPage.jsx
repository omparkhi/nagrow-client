import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Restaurant from "../../../assets/restaurant.jpg";
import {MdLocationOn, MdStar, MdArrowBack, MdSearch} from "react-icons/md";
import { FiClock } from "react-icons/fi";

const UserDashRestaurantPage = () => {
  const navigate = useNavigate();
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
          console.log("Restaurant data:", data.restaurant);
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

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/user-home");
    }
  };
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
    <section> 
    <div className="max-w-full mx-auto">
      {/* Restaurant header */}
      <div className="relative w-full bg-[#131222] rounded-b-[20px]">
        <div className="absolute flex w-full text-xl text-white gap-2 items-center font-bold pl-4 pt-2">
        <MdArrowBack onClick={handleBack} className="cursor-pointer" />
        </div>
      <div className="w-fit sm:w-xl md:w-2xl flex flex-row items-center mx-auto gap-2 py-6 px-6">
        <div>
          <img src={restaurant?.documents?.shopPhotoUrl || Restaurant} alt={restaurant.name} className="h-30 w-30 rounded-[10px] object-cover" />
        </div> 
        <div className="h-30 flex-1 bg-white rounded-[10px] px-4 pt-4">
          <p className="text-gray-800 font-bold sm:text-[1rem] border-gray-400 border-b-1 inline ">Best at <span className="capitalize">{Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine} </span></p>
          <div className="flex justify-between mt-2">
          <h1 className="text-2xl font-bold capitalize">{restaurant.name}</h1>
          <div className="flex bg-[#00c569] rounded-lg px-1 items-center">
            <p className="text-sm text-muted-foreground text-white font-bold">
              {restaurant.rating || "3.0"}
            </p>
            <MdStar className="h-3 w-3 text-white ml-1" />
          </div>
          </div>
          <div className="flex gap-2 text-sm text-gray-700 font-bold">
            <div className="flex items-center">
              <FiClock className="w-4 h-4" />
              <span className="ml-1 ">
                {restaurant.deliveryTimeEstimate}
              </span>
            </div> | 
              <div className="flex items-center">
                    <MdLocationOn className="h-4 w-4" />
                    <span className="">
                    {restaurant.address.street}
                    </span>
                  </div>
                  </div>
        </div>
      </div>
      </div>
      </div>

      {/* menu section */}
      <div className="w-full flex justify-center mt-1 px-6 sm:px-0">
        <div className="flex justify-between w-full sm:w-xl md:w-2xl bg-white border border-[#686767] rounded-md px-4 py-2 items-center">
          <input
            type="text"
            name="address"
            placeholder="Search an area or address"
            className="w-full  placeholder:font-semibold placeholder:text-[#1c1c1e] outline-none"
          />
          <MdSearch className="text-xl text-[#1c1c1e]" />
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="max-w-2xl w-full px-6 py-8 rounded-lg text-centerr">
        <h2 className="text-2xl font-semibold mb-2">Menu</h2>
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
    </section>
  );
};

export default UserDashRestaurantPage;

