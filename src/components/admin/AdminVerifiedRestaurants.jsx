import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, CheckCircle } from "lucide-react";

const AdminVerifiedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/verified/restaurants"
      );
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch verified restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-200 to-white p-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2 text-green-700">
        <CheckCircle className="text-green-600" />
        Verified Restaurants
      </h2>

      {restaurants.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No verified restaurants yet.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              className="rounded-2xl shadow-md bg-white border border-green-100 hover:border-2 hover:border-green-500 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Logo */}
              {rest.documents?.logoUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={rest.documents.logoUrl}
                    alt="Restaurant Logo"
                    className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-green-200"
                  />
                </div>
              )}

              {/* Name */}
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {rest.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-4">
                {rest.cuisine?.join(", ") || "N/A"}
              </p>

              {/* Info */}
              <div className="text-sm space-y-2 bg-green-50 rounded-lg p-3">
                <p>
                  <span className="font-medium text-gray-700">👤 Owner:</span>{" "}
                  {rest.ownername}
                </p>
                <p>
                  <span className="font-medium text-gray-700">📧 Email:</span>{" "}
                  {rest.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">✅ Status:</span>{" "}
                  <span className="text-green-600 font-medium">
                    {rest.verificationStatus}
                  </span>
                </p>
              </div>

              {/* Documents */}
              <div className="mt-4">
                <p className="font-medium flex items-center gap-2 text-gray-800">
                  <FileText className="w-4 h-4 text-green-600" />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerifiedRestaurants;
