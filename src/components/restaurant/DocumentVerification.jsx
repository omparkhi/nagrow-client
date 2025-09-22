import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const RestaurantDocVerification = () => {
  const [docs, setDocs] = useState({
    license: null,
    gst: null,
    ownerId: null,
    shopPhoto: null,
    logo: null,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("not_submitted");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const restaurantId = localStorage.getItem("restaurantId");

  // ✅ Check current status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/restaurants/${restaurantId}/status`
        );
        setStatus(res.data.verificationStatus);
        setReason(res.data.rejectionReason || "");
      } catch (err) {
        console.error(err);
      }
    };
    if (restaurantId) fetchStatus();
  }, [restaurantId]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocs((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("restaurantId", restaurantId);

    // validate missing docs
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message);
      setStatus("pending"); // immediately switch UI
      navigate("/restaurant-home");
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Conditional UI based on status
  if (status === "pending") {
    return (
      <div className="flex flex-col items-center p-8">
        <Clock size={64} className="text-yellow-600" />
        <h2 className="text-xl font-bold mt-4">Verification Pending</h2>
        <p className="text-gray-600">Your documents are under review.</p>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="flex flex-col items-center p-8">
        <CheckCircle size={64} className="text-green-600" />
        <h2 className="text-xl font-bold mt-4">Documents Verified</h2>
        <p className="text-gray-600">Your restaurant is fully verified 🎉</p>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex flex-col items-center p-8">
        <XCircle size={64} className="text-red-600" />
        <h2 className="text-xl font-bold mt-4">Documents Rejected</h2>
        <p className="text-gray-600 mb-2">Reason: {reason || "Not provided"}</p>
        <button
          onClick={() => setStatus("not_submitted")}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Re-upload Documents
        </button>
      </div>
    );
  }

  // ✅ Default: Show form (when not_submitted or rejected & retrying)
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
              className="block w-full border rounded-md p-2 text-sm bg-[#f0f5fa] border-none focus:outline-none"
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
