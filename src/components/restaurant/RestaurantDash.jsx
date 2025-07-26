import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RestaurantDash = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("nagrow_token");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/restaurant-login");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl">📍</span>
        </div>
        <div>
          <button
            onClick={handleLogOut}
            className="cursor-pointer bg-[#ff5733] text-white py-2 px-4  rounded-md font-bold hover:bg-[#e43a14]"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to NaGrow Dashboard!</h1>
      </div>
    </div>
  );
};

export default RestaurantDash;
