import React, { useState } from "react";
import { MapPin, Bike, Clock, DollarSign, Star, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RiderDash = () => {
  const [status, setStatus] = useState("Offline");
  const navigate = useNavigate();

  const toggleStatus = () => {
    setStatus((prev) => (prev === "Offline" ? "Online" : "Offline"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token
    navigate("/rider-login"); // redirect to login page
  };

  return (
    <section className="min-h-screen bg-[#f5f5f5] text-black p-6">
      <div className="max-w-5xl mx-auto">
        {/* Top Section with Status and Logout */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6 flex items-center justify-between flex-wrap">
          <button
            onClick={toggleStatus}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              status === "Online"
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {status}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <Bike className="text-orange-500 w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Deliveries</h3>
              <p className="text-gray-600">{0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <DollarSign className="text-green-500 w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Earnings</h3>
              <p className="text-gray-600">₹{0}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow flex items-center gap-4">
            <Star className="text-yellow-400 w-8 h-8" />
            <div>
              <h3 className="text-lg font-semibold">Rating</h3>
              <p className="text-gray-600">4.5</p>
            </div>
          </div>
        </div>

        {/* Current Shift */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="text-blue-500 w-6 h-6" />
              <h3 className="text-xl font-semibold">Current Shift</h3>
            </div>
            <button
              onClick={toggleStatus}
              className="bg-orange-500 text-white px-5 py-2 rounded-md font-medium hover:bg-orange-600"
            >
              {status === "Online" ? "End Shift" : "Start Shift"}
            </button>
          </div>
          <p className="mt-4 text-gray-600">
            {status === "Online"
              ? "You are currently active and visible for delivery assignments."
              : "You are offline. Tap 'Start Shift' to begin receiving orders."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RiderDash;
