import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RiderDocVerification = () => {
  const [docs, setDocs] = useState({
    license: null,
    idProof: null,
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("not_submitted"); // track doc status
  const [reason, setReason] = useState(""); // rejection reason
  const navigate = useNavigate();

  const riderId = localStorage.getItem("riderId");

  // fetch rider verification status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/rider/get-verification-status/${riderId}`
        );
        setStatus(res.data.status); // "not_submitted", "pending", "verified", "rejected"
        setReason(res.data.reason || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch verification status");
      }
    };

    if (riderId) fetchStatus();
  }, [riderId]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDocs((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async () => {
    const missingFields = Object.entries(docs)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      toast.error(`Please upload: ${missingFields.join(", ")}`);
      return;
    }

    const formData = new FormData();
    formData.append("riderId", riderId);

    if (docs.profilePhoto) formData.append("profilePhoto", docs.profilePhoto);
    if (docs.idProof) formData.append("idProof", docs.idProof);
    if (docs.license) formData.append("license", docs.license);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/rider/send-verify-req/rider",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data.message);
      setStatus("pending");
    } catch (err) {
      console.error(err);
      toast.error(
        `Verification failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white max-w-3xl mx-auto p-6 rounded-2xl text-center">
      <h2 className="text-xl font-bold mb-6 text-gray-800">
        Rider Document Verification
      </h2>

      {/* ✅ Show status */}
      {status === "pending" && (
        <div className="text-blue-600 font-semibold">
          ⏳ Documents under review. Please wait.
        </div>
      )}

      {status === "verified" && (
        <div className="text-green-600 font-semibold">
          ✅ Documents verified successfully!
        </div>
      )}

      {status === "rejected" && (
        <div className="text-red-600">
          ❌ Documents rejected <br />
          {reason && <p className="mt-2 text-sm text-gray-600">Reason: {reason}</p>}
          <button
            onClick={() => setStatus("not_submitted")}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            Re-upload Documents
          </button>
        </div>
      )}

      {/* ✅ Show form only if not_submitted */}
      {status === "not_submitted" && (
        <>
          <div className="grid grid-cols-1 gap-4 text-left">
            {[
              { label: "Profile Photo", name: "profilePhoto" },
              { label: "Aadhaar / ID Proof", name: "idProof" },
              { label: "Driving License", name: "license" },
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
        </>
      )}
    </div>
  );
};

export default RiderDocVerification;
