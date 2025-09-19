import React, { useState, useEffect, useRef } from "react";
import {
  MdLocationOn,
  MdSpeed,
  MdPerson,
  MdSearch,
  MdMic,
  MdStar,
  MdStarBorder,
} from "react-icons/md";
import RestaurantData from "./RestaurantData";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // Ant Design Heart
import { AiOutlineBook, AiFillBook } from "react-icons/ai"; // Ant Design Bookmark
import { AiOutlineClockCircle, AiFillStar } from "react-icons/ai"; // Ant Design Clock
import { FiHeart } from "react-icons/fi"; // Feather Outline Heart
import { FiBookmark } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserDashRestaurants = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [isBookMark, setIsBookMark] = useState({});
  const [isFavorited, setIsFavorited] = useState({});

  const handleFavoriteClick = (id) => {
    setIsFavorited((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleBookMarkClick = (id) => {
    setIsBookMark((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/restaurants/home"
        );
        console.log(res.data.restaurants);
        setRestaurants(res.data.restaurants);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <>
      {/* //RestaurantData */}

      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">
          Top Restaurants to Explore
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="group relative bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden  cursor-pointer shadow-lg"
              onClick={() => navigate(`/restaurant/${restaurant._id}`)}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={restaurant.featuredDish?.image}
                  alt={restaurant.featuredDish?.name || restaurant.name}
                  className="h-48 w-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>

              {/* Gradient Overlay */}
              {/* <div className="absolute inset-0 border-1 border-gray-400 rounded-2xl" /> */}

              {/* Top Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 bg-white rounded-full cursor-pointer"
                  onClick={() => handleBookMarkClick(restaurant._id)}
                >
                  <FiBookmark
                    className={`mx-auto h-4 w-4 ${
                      isBookMark[restaurant._id]
                        ? "fill-green-500 text-gray-500 "
                        : "text-gray-500"
                    }`}
                  />
                  {/* {isBookMark ? <AiOutlineBook className="text-white" /> : <AiFillBook className="fill-green-500 text-green-500 transition-colors" />} */}
                </button>
                <button
                  size="sm"
                  // variant="ghost"
                  className="w-8 h-8 p-0 bg-white rounded-full cursor-pointer"
                  onClick={() => handleFavoriteClick(restaurant._id)}
                >
                  <FiHeart
                    className={`mx-auto h-4 w-4 ${
                      isFavorited[restaurant._id]
                        ? "fill-pink-500 text-gray-500"
                        : "text-gray-500"
                    }`}
                  />
                </button>
              </div>
              <div className="absolute flex items-center justify-between pt-2 top-2 left-3">
                <span className="text-[0.9rem] text-white font-bold">
                  at {restaurant.featuredDish?.price}
                </span>
                {/* <span className="text-lg font-bold text-foreground">
              ₹{discountedPrice}
            </span> */}
              </div>
              {/* Delivery Time */}
              <div className="absolute top-42 right-2">
                <div className="bg-white/95 backdrop-blur-sm px-2 py-[0.1rem] rounded-sm flex items-center gap-1">
                  <FiClock className="w-3 h-3 text-gray-700" />
                  <span className="text-[0.8rem] text-gray-700 font-bold">
                    {restaurant.deliveryTimeEstimate}
                  </span>
                </div>
              </div>
              {/* Delivery Time */}
              <div
                className="absolute top-42 bg-white/95 "
                style={{
                  clipPath: "circle(50%)",
                }}
              >
                <div className="px-5 py-[0.1rem] flex items-center gap-1 flex">
                  {/* <FiClock className="w-3 h-3 text-gray-700" /> */}
                  <MdSpeed className="h-3 w-3 text-gray-700" />
                  <span className="text-[0.8rem] text-gray-700 font-bold">
                    {restaurant.distance || "3.5km"}
                  </span>
                </div>
              </div>
              {/* <div className="absolute flex bottom-20 right-3 bg-white/90 text-[0.8rem] text-gray-500 font-bold backdrop-blur-sm rounded-xl px-2">
            <FiClock className="w-3 h-3 mr-1 my-auto" />  
            {restaurant.deliveryTime}
        </div> */}
              {/* Content */}
              <div className="p-4 -space-y-1">
                {/* Restaurant Name & Rating */}
                <div className="flex items-start justify-between">
                  <div className="flex justify-between min-w-full -mt-2">
                    <h3 className="font-bold text-lg truncate">
                      {restaurant.name}
                    </h3>
                    <div className="flex bg-[#00c569] rounded-lg px-1 items-center">
                      <p className="text-sm text-muted-foreground text-white font-bold">
                        {restaurant.rating || "3.0"}
                      </p>
                      <MdStar className="h-3 w-3 text-white ml-1" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-[#6e6e6e]">
                  <MdLocationOn className="h-4 w-4" />
                  <div className="text-[0.9rem] font-semibold">
                    {restaurant.address.street}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[#6e6e6e] ml-1">
                  <div className="text-[0.9rem] font-semibold">
                    {restaurant.featuredDish?.name}
                  </div>
                  <div className="text-[0.9rem] font-semibold truncate ml-2">
                    <span className="mx-1 text-sm">•</span>
                    {restaurant.featuredDish?.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default UserDashRestaurants;
