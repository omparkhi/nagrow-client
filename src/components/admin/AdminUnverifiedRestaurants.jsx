import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, AlertCircle } from "lucide-react";

const AdminUnverifiedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState({}); // store per-restaurant rejection reason

  // Fetch unverified restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/unverified/restaurants"
      );
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch unverified restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Approve/Reject Handler
  const handleVerification = async (id, action) => {
    try {
      const payload =
        action === "reject"
          ? { action, rejectionReason: reasons[id] || "" }
          : { action };

      await axios.post(
        `http://localhost:3000/api/admin/restaurant/verify-status-update/${id}`,
        payload
      );

      toast.success(`Restaurant ${action}ed successfully`);
      // fetchRestaurants(); // refresh list
      setRestaurants((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Error updating verification status");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2 text-red-700">
        <AlertCircle className="text-red-600" />
        Unverified Restaurants
      </h2>

      {restaurants.length === 0 ? (
        <p className="text-green-600 font-medium text-center text-lg">
          No pending verifications 🎉
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              className="rounded-2xl shadow-md bg-white border border-red-100 hover:border-red-300 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Logo */}
              {rest.documents?.logoUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={rest.documents.logoUrl}
                    alt="Restaurant Logo"
                    className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-red-200"
                  />
                </div>
              )}

              {/* Name */}
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {rest.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-4">
                Owner: {rest.ownername}
              </p>

              {/* Info */}
              <div className="text-sm space-y-2 bg-red-50 rounded-lg p-3">
                <p>
                  <span className="font-medium text-gray-700">📧 Email:</span>{" "}
                  {rest.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">📞 Phone:</span>{" "}
                  {rest.phone}
                </p>
                <p>
                  <span className="font-medium text-gray-700">⏳ Status:</span>{" "}
                  <span className="text-red-600 font-medium">
                    {rest.verificationStatus}
                  </span>
                </p>
              </div>

              {/* Documents */}
              <div className="mt-4">
                <p className="font-medium flex items-center gap-2 text-gray-800">
                  <FileText className="w-4 h-4 text-red-600" />
                  Documents:
                </p>
                {rest.documents ? (
                  <ul className="ml-6 mt-2 space-y-1 text-sm">
                    {rest.documents.licenseUrl && (
                      <li>
                        <a
                          href={rest.documents.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          📄 License
                        </a>
                      </li>
                    )}
                    {rest.documents.gstUrl && (
                      <li>
                        <a
                          href={rest.documents.gstUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🧾 GST
                        </a>
                      </li>
                    )}
                    {rest.documents.ownerIdUrl && (
                      <li>
                        <a
                          href={rest.documents.ownerIdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🪪 Owner ID
                        </a>
                      </li>
                    )}
                    {rest.documents.shopPhotoUrl && (
                      <li>
                        <a
                          href={rest.documents.shopPhotoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🏠 Shop Photo
                        </a>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded</p>
                )}
              </div>

              {/* Approve / Reject */}
              <div className="mt-6 flex gap-2 items-center">
                <button
                  onClick={() => handleVerification(rest._id, "approve")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <input
                  type="text"
                  placeholder="Rejection Reason"
                  value={reasons[rest._id] || ""}
                  onChange={(e) =>
                    setReasons({ ...reasons, [rest._id]: e.target.value })
                  }
                  className="border rounded px-2 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={() => handleVerification(rest._id, "reject")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUnverifiedRestaurants;
