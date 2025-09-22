import React, { useState, useEffect } from "react";
import { MapPin, Bike, Clock, DollarSign, Star, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RiderDash = () => {
  const [status, setStatus] = useState("Offline");
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const navigate = useNavigate();

  const riderId = localStorage.getItem("riderId");

  // Fetch rider info (to get verification status)
  useEffect(() => {
    const fetchRider = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/rider/${riderId}`);
        setVerificationStatus(res.data.data?.verificationStatus || "pending");
      } catch (err) {
        console.error("Error fetching rider info", err);
      }
    };
    if (riderId) fetchRider();
  }, [riderId]);

  const toggleStatus = () => {
    setStatus((prev) => (prev === "Offline" ? "Online" : "Offline"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userType"); 
    localStorage.removeItem("riderId"); 
    navigate("/rider-login");
  };

  return (
    <section className="min-h-screen bg-[#f5f5f5] text-black p-6">
      <div className="max-w-5xl mx-auto">

        {/* Top bar */}
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

        {/* Stats */}
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
        <div className="bg-white p-6 rounded-xl shadow mb-6">
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

        {/* Document Verification Section */}
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="text-purple-500 w-6 h-6" />
              <h3 className="text-xl font-semibold">Document Verification</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                verificationStatus === "verified"
                  ? "bg-green-100 text-green-700"
                  : verificationStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {verificationStatus}
            </span>
          </div>

          <p className="text-gray-600 mb-4">
            Upload your Aadhaar, License and Photo to complete verification.
          </p>
          <button
            onClick={() => navigate("/rider-verify")}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition"
          >
            {verificationStatus === "verified"
              ? "View Documents"
              : "Upload / Update Documents"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RiderDash;
