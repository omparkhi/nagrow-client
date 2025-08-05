import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import FoodAnimate from "../../../assets/FoodAnimation.json";
import {
  MdLocationOn,
  MdSpeed,
  MdPerson,
  MdSearch,
  MdMic,
} from "react-icons/md";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { HiMenuAlt3, HiX } from 'react-icons/hi';
import BurgerPng from "../../../assets/burger.png";
import PaneerPng from "../../../assets/paneerImg.png";
import { FiBookmark } from "react-icons/fi";
import "../../../App.css";
import { HiOutlineHome, HiHome } from "react-icons/hi";
import { MdHome } from "react-icons/md";
// import CategoryItem from './CategoryItem';/

import UserDashCategory from "./UserDashCategory";
import UserDashRestaurants from "./UserDashRestaurants";
import UserDashBanner from "./UserDashBanner";

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

  const [isShaking, setIsShaking] = useState(false);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarOpacity = Math.min(scrollY / 100, 1);

  return (
    <div className="relative max-w-full  bg-white">
      <UserDashBanner />

      {/* Dashboard Content */}

      <UserDashCategory />

      <UserDashRestaurants />
    </div>
  );
};

export default UserDash;
