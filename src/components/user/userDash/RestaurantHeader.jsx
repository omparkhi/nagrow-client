import React, { useState, useEffect } from "react";
import Restaurant from "../../../assets/restaurant.jpg";
import {
  MdLocationOn,
  MdStar,
  MdArrowBack,
  MdSearch,
  MdRestaurant,
} from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";
import { GiKnifeFork } from "react-icons/gi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RestaurantHeader = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const { id } = useParams(); // restaurantId from url
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/restaurants/${id}`
        );
        if (data.success) {
          console.log("Restaurant data:", data.restaurant);
          setRestaurant(data.restaurant);
          //   setMenu(data.menu);
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
  return (
    <>
      {/* Restaurant header */}
      <div className="relative h-auto w-full bg-[#131222] rounded-b-[20px]">
        <div className="absolute flex w-full text-xl text-white gap-2 items-center font-bold pl-2 pt-2">
          <MdArrowBack onClick={handleBack} className="cursor-pointer" />
        </div>
        <div className="w-full sm:w-xl md:w-2xl flex flex-row items-center mx-auto sm:gap-2 pt-10 pb-2 px-2">
          <div className="hidden sm:block">
            <img
              src={restaurant?.documents?.shopPhotoUrl || Restaurant}
              alt={restaurant?.name}
              className=" h-27 w-27 rounded-[10px] object-cover"
            />
          </div>
          <div className="h-27 flex-1 items-center bg-white rounded-[15px] px-4 pt-4">
            {/* <div className=" block sm:hidden">
                    <img src={restaurant?.documents?.shopPhotoUrl || Restaurant} alt={restaurant.name} className=" h-10 w-10 rounded-[10px] object-cover" />
                  </div> */}
            <div className="flex items-center w-full gap-1">
              <HiShieldCheck className="text-blue-500 w-6 h-6" />
              <p className="text-blue-500 font-bold sm:text-[1rem] border-blue-400 border-b-1 truncate max-w-[200px] sm:max-w-full">
                Best at{" "}
                <span className="capitalize">
                  {Array.isArray(restaurant?.cuisine)
                    ? restaurant?.cuisine.join(", ")
                    : restaurant?.cuisine}{" "}
                </span>
              </p>
            </div>

            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1 min-w-0">
                <GiKnifeFork className="w-5 h-5 shrink-0" />
                <h1 className="text-xl md:text-2xl font-bold capitalize truncate max-w-[170px] sm:max-w-full">
                  {restaurant?.name}
                </h1>
              </div>

              <div className="h-6 flex bg-green-500 rounded-full px-2 items-center">
                <p className="text-sm text-muted-foreground text-white font-bold">
                  {restaurant?.rating || "3.0"}
                </p>
                <MdStar className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[13px] sm:text-[15px] text-gray-700 font-semibold">
              <div className="flex items-center">
                {/* <FiClock className="w-4 h-4" /> */}
                <span className="ml-1 ">
                  {restaurant?.deliveryTimeEstimate}
                </span>
              </div>{" "}
              |
              <div className="flex items-center">
                {/* <MdLocationOn className="h-4 w-4" /> */}
                <span className="">{restaurant?.address.street}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RestaurantHeader;
