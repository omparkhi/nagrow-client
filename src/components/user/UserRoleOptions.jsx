import React from "react";
import { Link } from "react-router-dom";

const UserRoleOptions = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4">
      <h2 className="text-3xl font-bold text-[#ff5733] mb-8">
        Welcome, Customer!
      </h2>
      <div className="flex flex-col gap-6 w-full max-w-md">
        <Link to="/user-login">
          <button className="w-full bg-[#ff5733] text-white py-3 rounded-xl text-xl font-medium">
            Login
          </button>
        </Link>
        <Link to="/user-verification">
          <button className="w-full border-2 border-[#ff5733] text-[#ff5733] py-3 rounded-xl text-xl font-medium">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserRoleOptions;
