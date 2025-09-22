import React from "react";
import { useNavigate } from "react-router-dom";

const AdminRiderDocs = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 ">
      <div className="text-center space-y-8">
        <h1 className="text-3xl font-bold text-gray-800 mt-[-20px]">Rider Documents</h1>
        <p className="text-gray-600">Choose which riders you want to review</p>

        <div className="flex gap-6 justify-center">
          {/* Unverified Button */}
          <button
            onClick={() => navigate("/admin/riders/unverified-docs")}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg text-lg transition"
          >
            Unverified Riders
          </button>

          {/* Verified Button */}
          <button
            onClick={() => navigate("/admin/riders/verified-docs")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg text-lg transition"
          >
            Verified Riders
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRiderDocs;
