import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserDash = () => {
  const navigate = useNavigate();
  const [homeAddress, setHomeAddress] = useState(null);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/user-login");
    }, 1500);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/users/get-address",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched Address Response:", res.data);

        if (res.data.success) {
          setHomeAddress(res.data.addresses[0]);
        }
      } catch (error) {
        console.error("Failed to fetch address", error);
      }
    };
    fetchAddress();
  }, []);
  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-2xl">📍</span>
          {/* <div className="w-full flex justify-between"> */}
          {homeAddress ? (
            <p className="text-lg font-semibold">{homeAddress.label}</p>
          ) : (
            <p className="text-lg text-gray-400">Fetching Location...</p>
          )}
          {/* </div> */}
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

export default UserDash;
