import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Restaurant from "../../../assets/restaurant.jpg";
import {MdLocationOn, MdStar, MdArrowBack, MdSearch, MdRestaurant} from "react-icons/md";
import { FiClock } from "react-icons/fi";
import { HiShieldCheck } from "react-icons/hi";
import { GiKnifeFork } from "react-icons/gi";
import { useCart } from "../../context/CartContext";

const UserDashRestaurantPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // restaurantId from url
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState({});
  const [loading, setLoading] = useState(true);

  const { items: cartItems, addToCart, increment, decrement, getTotalItems, clearCart } = useCart();

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

  const onAddClick = async (menuItem) => {
    // Try add; addToCart returns { success, conflict }
    const result = addToCart(menuItem, { _id: restaurant._id, name: restaurant.name });
    if(result.success) return;
    if(result.conflict) {
      const ok = window.confirm(`Your cart has items from "${result.currentRestaurant}". Clear cart and add this item?`);

      if (ok) {
        clearCart();
        addToCart(menuItem, { _id: restaurant._id, name: restaurant.name });
      }
    }
  };

  // helper to read quantity in cart for a menu item
  const getQuantity = (itemId) => {
    const it = cartItems.find((c) => c.id === itemId);
    return it ? it.quantity : 0;
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
      <div className="relative h-auto w-full bg-[#131222] rounded-b-[20px]">
        <div className="absolute flex w-full text-xl text-white gap-2 items-center font-bold pl-2 pt-2">
        <MdArrowBack onClick={handleBack} className="cursor-pointer" />
        </div>
      <div className="w-full sm:w-xl md:w-2xl flex flex-row items-center mx-auto sm:gap-2 pt-10 pb-2 px-2">
        <div className="hidden sm:block">
          <img src={restaurant?.documents?.shopPhotoUrl || Restaurant} alt={restaurant.name} className=" h-27 w-27 rounded-[10px] object-cover" />
        </div> 
        <div className="h-27 flex-1 items-center bg-white rounded-[15px] px-4 pt-4">
          
            {/* <div className=" block sm:hidden">
              <img src={restaurant?.documents?.shopPhotoUrl || Restaurant} alt={restaurant.name} className=" h-10 w-10 rounded-[10px] object-cover" />
            </div> */}
            <div className="flex items-center w-full gap-1">
            <HiShieldCheck className="text-blue-500 w-6 h-6" />
            <p className="text-blue-500 font-bold sm:text-[1rem] border-blue-400 border-b-1 truncate max-w-[200px] sm:max-w-full">Best at <span className="capitalize">{Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(", ") : restaurant.cuisine} </span></p>
            </div>
          
          <div className="flex justify-between mt-2">
            <div className="flex items-center gap-1 min-w-0">
              <GiKnifeFork className="w-5 h-5 shrink-0" />
              <h1 className="text-xl md:text-2xl font-bold capitalize truncate max-w-[170px] sm:max-w-full">{restaurant.name}</h1>
            </div>
          
          <div className="h-6 flex bg-green-500 rounded-full px-2 items-center">
            <p className="text-sm text-muted-foreground text-white font-bold">
              {restaurant.rating || "3.0"}
            </p>
            <MdStar className="h-3 w-3 text-white" />
          </div>
          </div>
          <div className="flex items-center gap-2 text-[13px] sm:text-[15px] text-gray-700 font-semibold">  
            <div className="flex items-center">
              {/* <FiClock className="w-4 h-4" /> */}
              <span className="ml-1 ">
                {restaurant.deliveryTimeEstimate} 
              </span>
            </div> | 
              <div className="flex items-center">
                    {/* <MdLocationOn className="h-4 w-4" /> */}
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
      <div className="w-full flex justify-center mt-1 px-3 sm:px-0 ">
        <div className="flex justify-between w-full sm:w-xl md:w-2xl bg-gray-200 rounded-md px-4 py-2 items-center">
          <input
            type="text"
            name="address"
            placeholder="Search for dishes"
            className="w-full  placeholder:font-semibold placeholder:text-[#1c1c1e] outline-none"
          />
          <MdSearch className="text-xl text-[#1c1c1e]" />
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="max-w-2xl w-full px-3 py-6 rounded-lg ">
        {/* <h2 className="text-xl sm:text-lg font-bold mb-2 text-slate-600">Here is Top Picks for u</h2> */}
        {Object.keys(menu).map((category) => (
          <div key={category} className="mb-3 ">
            <h3 className="text-xl font-bold mb-4">{category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-6 ">
              {menu[category].map((item) => {
                const qty = getQuantity(item._id);
                
                return (
                <div 
                  key={item._id}
                  className="flex items-center justify-between gap-4 px-4 pt-4 pb-6 border-t border-gray-200 "
                >
                  <div className="w-25 h-auto relative">
                  {item.image && (
                    
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    
                  )}
                  </div>
                  {/* Add / qty controls */}
                  <div className=" absolute ml-4 mt-22">
                  {qty === 0 ? (
                     <button 
                     onClick={() => onAddClick(item)}
                     className="px-3 py-[2px] text-[17px] font-bold border-1 border-gray-300 text-blue-500 rounded-lg shadow-lg bg-white hover:text-blue-600">
                    ADD
                  </button>
                  ) : (
                    <div className="flex items-center justify-center rounded-lg border-1 border-gray-300 shadow-lg bg-white gap-2 text-blue-500 py-[2px] font-bold">
                          <button onClick={() => decrement(item._id)} className="w-4 h-4 flex items-center justify-center text-blue-500">−</button>
                          <div>{qty}</div>
                          <button onClick={() => increment(item._id)} className="w-4 h-4 flex items-center justify-center text-blue-500">+</button>
                        </div>
                  )}
                  </div>
                  <div className="flex-1 flex-end text-[#333333]">
                    <h4 className="text-[17px] font-bold capitalize">{item.name}</h4>
                    <p className="text-sm font-semibold">₹{item.price}</p>
                    <p className="text-xs">[{item.description}]</p>
                  </div>

                  
                 
                </div>
              );
            })}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default UserDashRestaurantPage;

