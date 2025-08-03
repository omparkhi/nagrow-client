import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import FoodAnimate from "../../assets/FoodAnimation.json";
import { MdLocationOn,MdSpeed , MdPerson, MdSearch, MdMic } from 'react-icons/md';
import { FiChevronDown,  FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import { HiMenuAlt3, HiX } from 'react-icons/hi';
import BurgerPng from "../../assets/burger.png";
import PaneerPng from "../../assets/paneerImg.png";
import "../../App.css";
import { HiOutlineHome, HiHome } from 'react-icons/hi';
import { MdHome } from 'react-icons/md';
import CategoryItem from './CategoryItem';
import RestaurantData from './RestaurantData';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // Ant Design Heart
import { AiOutlineBook, AiFillBook } from 'react-icons/ai'; // Ant Design Bookmark
import { AiOutlineClockCircle, AiFillStar } from 'react-icons/ai'; // Ant Design Clock
import { FiHeart } from 'react-icons/fi'; // Feather Outline Heart
import { FiBookmark } from 'react-icons/fi'; 
import { FiClock } from 'react-icons/fi';
import { MdStar, MdStarBorder } from 'react-icons/md'; 

const UserDash = () => {
  const navigate = useNavigate();
  const [homeAddress, setHomeAddress] = useState(null);
  const placeholder = ["Cake", "Pizza", "Biryani", "Burger", "Thali"];
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBookMark, setIsBookMark] = useState({});
  const [isFavorited, setIsFavorited] = useState({});
  const [isShaking, setIsShaking] = useState(false);


  useEffect(() => {
  const interval = setInterval(() => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 1000);  // Shake duration (1 second)
  }, 3000); // Every 6 seconds
  
  return () => clearInterval(interval);
}, []);


  const handleFavoriteClick = (id) => {
    setIsFavorited((prev) => ({
      ...prev, [id]: !prev[id],
    }));
  };
  const handleBookMarkClick = (id) => {
    setIsBookMark((prev) => ({
      ...prev, [id]: !prev[id],
    }));
  }

  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' })
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/users/get-address",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setHomeAddress(res.data.addresses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch address", error);
      }
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    if (inputValue || isFocused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev === placeholder.length ? 1 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [inputValue, isFocused, index]);

  useEffect(() => {
    if (index === placeholder.length) {
      setTimeout(() => {
        setIsAnimating(false);
        setIndex(0);
        setTimeout(() => {
          setIsAnimating(true);
        }, 50);
      }, 500);
    }
  }, [index]);

  useEffect(() => {
  const handleScroll = () => {
    requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 50);
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

 const navbarOpacity = Math.min(scrollY / 100, 1);

  return (
    <div className="relative max-w-full  bg-white">
      <div className=" bg-static-stripes h-auto rounded-b-[30px] overflow-hidden">
        {/* <div className=""></div> */}
        {/* Top Navbar Grid Layout */}
        <div className="flex items-center justify-between flex-wrap  top-0 left-0 w-full px-6 py-4 mb-4 transition-all duration-200"  style={{
          backgroundColor: `rgba(255, 255, 255, ${navbarOpacity})`,
          color: navbarOpacity > 0.5 ? "#000" : "#fff",
          boxShadow: navbarOpacity > 0.2 ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
          
        }}>
          {/* Location (Left) */}
          <div className="relative flex items-center">
            <MdHome className="text-2xl aligns-center text-white -mt-1 " style= {{
            color: navbarOpacity > 0.1 ? "#000" : "#fff",
            // boxShadow: navbarOpacity > 0.2 ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        }} />
            {homeAddress ? (
              <div><p className="text-xl text-white font-semibold ml-1" style= {{
            color: navbarOpacity > 0.1 ? "#000" : "#fff"
        }} >{homeAddress.label}</p>
        <p className="text-sm truncate max-w-[200px]" style={{ color: navbarOpacity > 0.1 ? "#333" : "#ddd" }}>
           {homeAddress.fullAddress}
        </p>
              
              </div>
            ) : (
              <p className="text-lg text-gray-400" style= {{
            color: navbarOpacity > 0.1 ? "#000" : "#fff"
        }}>Fetching Location...</p> 
            )}
            <FiChevronDown className="text-xl text-slate-200" style= {{
            color: navbarOpacity > 0.1 ? "#000" : "#fff"
        }} />
            
          </div> 
          <div className="bg-black grid place-items-center h-10 w-12 rounded-3xl cursor-pointer text-2xl text-slate-200">
              <MdPerson />
            </div>  
            
        </div>
         
       
        

        {/* Animation Section */}
        <div className="w-full text-center mt-10">
          <div className="flex items-center justify-between w-full px-4 md:px-10 ">
  
  {/* Left Image */}
 

  {/* Text in Middle */}
  <div className="flex-grow text-center px-2 mt-6">
    <h2 className="text-2xl md:text-4xl text-[#6A0DAD] drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]" style={{ fontFamily: 'Impact, sans-serif', transform: 'scaleX(1.2)' }}>
      EAT BIG, SPEND SMALL!
    </h2>
  </div>

  {/* Right Image */}
 
</div>


          <div className=" mx-auto h-20 w-80 sm:h-25 sm:w-96 md:h-25 md:w-[40%] flex items-center justify-center overflow-hidden">
              <Lottie animationData={FoodAnimate} loop={true}  /> 
              
            </div>
            <div className="text-slate-300 text-sm">From Kitchen to Your Doorstep</div>
        </div>
      </div>
      {/* Search Bar (Center) */}
        <div className="sticky top-0 z-50 w-full py-2 flex justify-center px-4 -mt-47 sm:-mt-53" >
          <div className="relative flex items-center bg-white rounded-[8px] px-1 py-2 shadow-md border-1 border-gray-300">
            <MdSearch className="text-[#ff5733] text-xl min-w-[3rem]" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full md:w-60 lg:w-96 text-[1rem] text-gray-700 placeholder-gray-700 outline-none"
              placeholder=""
            />
            {/* Animated Placeholder */}
            {!inputValue && !isFocused && (
              <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-700 font-semibold text-[1rem] pointer-events-none flex">
                <span>Search for&nbsp;</span>
                <div className="relative h-6 overflow-hidden">
                  <div
                    className={`${isAnimating ? 'transition-transform duration-500 ease-in-out' : ''}`}
                    style={{ transform: `translateY(-${index * 1.5}rem)` }}
                  >
                    {placeholder.map((word, i) => (
                      <div key={i} className="h-6">{word}</div>
                    ))}
                    <div className="h-6 ">{placeholder[0]}</div>
                  </div>
                </div>
              </div>
            )}
            {/* <div className="h-5 w-px bg-gray-500"></div> */}
            <MdMic className="text-2xl cursor-pointer text-[#ff5733]  min-w-[3rem]" />
          </div>
          <div className={`w-auto  rounded-[8px] ml-2 px-2 shadow-md ${isVegOnly ? "bg-green-700" : "bg-white"}`}>
            <h6 className={`text-[15px] ${isVegOnly ? 'text-bold' : 'text-gray-700' }`}>Veg</h6>
            <button
        onClick={() => setIsVegOnly(!isVegOnly)}
        className={`w-full h-3 flex items-center bg-gray-300 rounded-sm p-1 transition duration-300 ${
          isVegOnly ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`bg-white w-2 h-2 rounded-sm shadow-md transform transition-transform duration-300 ${
            isVegOnly ? 'translate-x-3' : 'translate-x-0'
          }`}
        ></div>
      </button>
          </div>
        </div>
{/* <div className=" mx-auto h-20 w-80 sm:h-25 sm:w-96 md:h-25 md:w-[40%] flex items-center justify-center overflow-hidden"> */}
              {/* <Lottie animationData={FoodAnimate} loop={true}  />  */}
              
            {/* </div> */}
            <div className="w-full absolute flex justify-between overflow-hidden">
          <img src={PaneerPng} className={`rotate-10 w-24 sm:w-40 md:w-[18%] object-contain -ml-4 sm:mr-0 mt-15 sm:mt-13 md:mt-2 ${isShaking ? 'shake-once' : ''} `} />
      
        
          <img src={BurgerPng} className={` w-24 sm:w-40 md:w-[18%] object-contain -mr-4 sm:mr-0 mt-11 sm:mt-3 md:-mt-4 ${isShaking ? 'shake-once' : ''}`} />
      
        </div>

      {/* Dashboard Content */}
      <div className="w-full h-auto mt-39 p-0 md:p-6">
        <div className="text-sm font-semibold text-gray-500 px-4 md:px-0">What's in your mind?</div>

        {/* left scroll button */}
        <div className="relative mt-1">
        <button onClick={() => scroll(-200)} className="flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md px-3 py-2 z-10">
          <FiChevronLeft size={20} />
        </button>
          {/* Scrollable Categories */}
        <div ref={scrollRef} className=" flex overflow-x-auto whitespace-nowrap scroll-smooth px-8 gap-2" style={{scrollbarWidth: "none", msOverflowStyle: "none" }}>
          { CategoryItem.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform min-w-[70px] lg:min-w-[100px]">
              <div className="items-center rounded-full">
                <img
                src={item.image}  
                alt={item.name}
                className="h-17 w-17 sm:h-22 sm:w-22 md:h-27 md:w-27 lg:h-30 lg:w-30 object-contain"
                />
                <p className="-mt-3 text-sm text-[#515966ff] font-bold text-center">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
        <button
        onClick={() => scroll(200)}  // Scroll right by 200px
        className="flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md  px-3 py-2 z-10"
      >
        <FiChevronRight size={20} />
      </button>
      </div>
    </div>

    {/* //RestaurantData */}
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Top Restaurants to Explore</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {RestaurantData.map((restaurant) => (
           <div key={restaurant.id} className="group relative bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden  cursor-pointer shadow-lg">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img 
          src={restaurant.image}
          alt={restaurant.name}
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
            onClick = {() => handleBookMarkClick(restaurant.id)}
          >
            <FiBookmark className={`mx-auto h-4 w-4 ${ isBookMark[restaurant.id] ? "fill-green-500 text-gray-500 " : "text-gray-500"}`} />
            {/* {isBookMark ? <AiOutlineBook className="text-white" /> : <AiFillBook className="fill-green-500 text-green-500 transition-colors" />} */}
            
          </button>
          <button
            size="sm"
            // variant="ghost"
            className="w-8 h-8 p-0 bg-white rounded-full cursor-pointer"
            onClick= {() => handleFavoriteClick(restaurant.id)}
          >
            <FiHeart className={`mx-auto h-4 w-4 ${ isFavorited[restaurant.id] ? "fill-pink-500 text-gray-500" : "text-gray-500"}`} />
            
          </button>
        </div>
        <div className="absolute flex items-center justify-between pt-2 top-2 left-3">
          
              <span className="text-[0.9rem] text-white font-bold">
                at {restaurant.priceForTwo} 
              </span>
            {/* <span className="text-lg font-bold text-foreground">
              ₹{discountedPrice}
            </span> */}
          
        </div>
        {/* Delivery Time */}
         <div className="absolute top-42 right-2">
          <div className="bg-white/95 backdrop-blur-sm px-2 py-[0.1rem] rounded-sm flex items-center gap-1">
            <FiClock className="w-3 h-3 text-gray-700" />
            <span className="text-[0.8rem] text-gray-700 font-bold">{restaurant.deliveryTime}</span>
          </div>
        </div>
        {/* Delivery Time */}
         <div className="absolute top-42 bg-white/95 " style={{
          clipPath: 'circle(50%)'
        }}>
          <div className="px-5 py-[0.1rem] flex items-center gap-1 flex">
            {/* <FiClock className="w-3 h-3 text-gray-700" /> */}
            <MdSpeed className="h-3 w-3 text-gray-700" />
            <span className="text-[0.8rem] text-gray-700 font-bold">{restaurant.distance}</span>
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
                <p className="text-sm text-muted-foreground text-white font-bold">{restaurant.rating}</p>
                <MdStar className="h-3 w-3 text-white ml-1" />
            </div>

          </div>
        </div>
        <div className="flex items-center text-[#6e6e6e]">
          <MdLocationOn className="h-4 w-4" />
          <div className="text-[0.9rem] font-semibold">{restaurant.location}</div>
        </div>

        <div className="flex items-center text-[#6e6e6e] ml-1">
          <div className="text-[0.9rem] font-semibold">{restaurant.dishName}</div>
          <div className="text-[0.9rem] font-semibold truncate ml-2">
          <span className="mx-1 text-sm">•</span>
          {restaurant.tags}
          </div>
        </div>
      </div>
    </div>
        
        ))}
      </div>
    </div>
    </div>
  );
};

export default UserDash;

