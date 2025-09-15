import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAddress } from "../../context/AddressContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import FoodAnimate from "../../../assets/FoodAnimation.json";
import { MdPerson, MdSearch, MdMic } from "react-icons/md";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BurgerPng from "../../../assets/burger.png";
import PaneerPng from "../../../assets/paneerImg.png";
import "../../../App.css";
import { MdHome } from "react-icons/md";

const UserDashBanner = () => {
  const { addresses, loading } = useAddress();
  const navigate = useNavigate();
  // const [homeAddress, setHomeAddress] = useState(null);
  const placeholder = ["Cake", "Pizza", "Biryani", "Burger", "Thali"];
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const homeAddress = addresses[0] || null;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 1000); // Shake duration (1 second)
    }, 3000); // Every 6 seconds

    return () => clearInterval(interval);
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

  // useEffect(() => {
  //   const handleScroll = () => {
  //     requestAnimationFrame(() => {
  //       setIsScrolled(window.scrollY > 50);
  //     });
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // const navbarOpacity = Math.min(scrollY / 100, 1);

  const handleAddressCard = () => {
    navigate("/address-page");
  };

  return (
    <>
      <div className=" bg-static-stripes h-auto rounded-b-[30px] overflow-hidden">
        {/* <div className=""></div> */}
        {/* Top Navbar Grid Layout */}
        <div
          className="flex items-center justify-between flex-wrap  top-0 left-0 w-full px-6 py-4 mb-4 transition-all duration-200"
          // style={{
          //   backgroundColor: `rgba(255, 255, 255, ${navbarOpacity})`,
          //   color: navbarOpacity > 0.5 ? "#000" : "#fff",
          //   boxShadow:
          //     navbarOpacity > 0.2 ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
          // }}
        >
          {/* Location (Left) */}
          <div className="relative flex flex-col">
            <div
              className="relative flex items-center cursor-pointer"
              onClick={handleAddressCard}
            >
              <MdHome
                className="text-2xl aligns-center text-[#ff5733] -mt-1"
                // style={{
                //   color: navbarOpacity > 0.1 ? "#000" : "#fff",
                //   boxShadow: navbarOpacity > 0.2 ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
                // }}
              />
              <p
                className="text-xl text-white font-bold ml-1"
                // style={{
                //   color: navbarOpacity > 0.1 ? "#000" : "#fff",
                // }}
              >
                Home
              </p>
              <FiChevronDown
                className="text-xl text-slate-200"
                // style={{
                //   color: navbarOpacity > 0.1 ? "#000" : "#fff",
                // }}
              />
            </div>

            {loading ? (
              <p className="text-[0.85rem] truncate text-[#6e6e6e] max-w-[200px] -mt-1">
                Fetching Location...
              </p>
            ) : homeAddress ? (
              <p className="text-[0.85rem] truncate text-slate-300 max-w-[200px] -mt-1">
                {homeAddress.formattedAddress}
              </p>
            ) : (
              <p className="text-[0.85rem] truncate text-[#6e6e6e] max-w-[200px] -mt-1">
                No saved address found
              </p>
            )}
          </div>

          {/* </div> */}
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
              <h2
                className="text-2xl md:text-4xl text-[#6A0DAD] drop-shadow-[0_2px_10px_rgba(255,255,255,0.5)]"
                style={{
                  fontFamily: "Impact, sans-serif",
                  transform: "scaleX(1.2)",
                }}
              >
                EAT BIG, SPEND SMALL!
              </h2>
            </div>

            {/* Right Image */}
          </div>

          <div className=" mx-auto h-20 w-80 sm:h-25 sm:w-96 md:h-25 md:w-[40%] flex items-center justify-center overflow-hidden">
            <Lottie animationData={FoodAnimate} loop={true} />
          </div>
          <div className="text-slate-300 text-sm">
            From Kitchen to Your Doorstep
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 w-full py-2 flex justify-center px-4 -mt-47 sm:-mt-53">
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
                  className={`${
                    isAnimating
                      ? "transition-transform duration-500 ease-in-out"
                      : ""
                  }`}
                  style={{ transform: `translateY(-${index * 1.5}rem)` }}
                >
                  {placeholder.map((word, i) => (
                    <div key={i} className="h-6">
                      {word}
                    </div>
                  ))}
                  <div className="h-6 ">{placeholder[0]}</div>
                </div>
              </div>
            </div>
          )}
          {/* <div className="h-5 w-px bg-gray-500"></div> */}
          <MdMic className="text-2xl cursor-pointer text-[#ff5733]  min-w-[3rem]" />
        </div>
        <div
          className={`w-auto  rounded-[8px] ml-2 px-2 shadow-md ${
            isVegOnly ? "bg-green-700" : "bg-white"
          }`}
        >
          <h6
            className={`text-[15px] ${
              isVegOnly ? "text-bold" : "text-gray-700"
            }`}
          >
            Veg
          </h6>
          <button
            onClick={() => setIsVegOnly(!isVegOnly)}
            className={`w-full h-3 flex items-center bg-gray-300 rounded-sm p-1 transition duration-300 ${
              isVegOnly ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-2 h-2 rounded-sm shadow-md transform transition-transform duration-300 ${
                isVegOnly ? "translate-x-3" : "translate-x-0"
              }`}
            ></div>
          </button>
        </div>
      </div>
      {/* <div className=" mx-auto h-20 w-80 sm:h-25 sm:w-96 md:h-25 md:w-[40%] flex items-center justify-center overflow-hidden"> */}
      {/* <Lottie animationData={FoodAnimate} loop={true}  />  */}

      {/* </div> */}
      <div className="w-full absolute flex justify-between overflow-hidden">
        <img
          src={PaneerPng}
          className={`rotate-10 w-24 sm:w-40 md:w-[18%] object-contain -ml-4 sm:mr-0 mt-15 sm:mt-13 md:mt-2 ${
            isShaking ? "shake-once" : ""
          } `}
        />

        <img
          src={BurgerPng}
          className={` w-24 sm:w-40 md:w-[18%] object-contain -mr-4 sm:mr-0 mt-11 sm:mt-3 md:-mt-4 ${
            isShaking ? "shake-once" : ""
          }`}
        />
      </div>
    </>
  );
};

export default UserDashBanner;
