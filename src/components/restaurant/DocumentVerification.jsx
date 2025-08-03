import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RestaurantDocVerification = () => {
  const [docs, setDocs] = useState({
    license: null,
    gst: null,
    ownerId: null,
    shopPhoto: null,
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocs((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const restaurantId = localStorage.getItem("restaurantId");
    const formData = new FormData();
    formData.append("restaurantId", restaurantId);




    
    const missingFields = Object.entries(docs)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length > 0) {
    toast.error(`Please upload: ${missingFields.join(", ")}`);
    return;
  }

    Object.keys(docs).forEach((key) => {
      if (docs[key]) {
        formData.append(key, docs[key]);
      }
    });

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/restaurants/send-verify-req/restaurant",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      navigate("/restaurant-home")
    } catch (err) {
      console.error(err);
      alert( "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-3xl mx-auto p-6 rounded-2xl ">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
        Document Verification
      </h2>

      <div className="grid grid-cols-1 gap-4 ">
        {[
          { label: "Food License", name: "license" },
          { label: "GST Certificate", name: "gst" },
          { label: "Owner ID Proof", name: "ownerId" },
          { label: "Shop Photo", name: "shopPhoto" },
          { label: "Restaurant Logo", name: "logo" },
        ].map((item) => (
          <div key={item.name}>
            <label className="block font-medium text-gray-700 mb-1">
              {item.label}
            </label>
            <input
              type="file"
              name={item.name}
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="block w-full border rounded-md p-2 text-sm  bg-[#f0f5fa]  border-none focus:outline-none"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold"
      >
        {loading ? "Submitting..." : "Submit Verification"}
      </button>
    </div>
  );
};

export default RestaurantDocVerification;
