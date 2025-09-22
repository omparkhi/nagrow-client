import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, CheckCircle } from "lucide-react";

const AdminVerifiedRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch verified riders from backend
  const fetchRiders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/verified/riders"
      );
      setRiders(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch verified riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-200 to-white p-8">
      <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-2 text-green-700">
        <CheckCircle className="text-green-600" />
        Verified Riders
      </h2>

      {riders.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No verified riders yet.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {riders.map((rider) => (
            <div
              key={rider._id}
              className="rounded-2xl shadow-md bg-white border border-green-100 hover:border-2 hover:border-green-500 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Profile Photo */}
              {rider.documents?.photoUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={rider.documents.photoUrl}
                    alt="Rider Profile"
                    className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-green-200"
                  />
                </div>
              )}

              {/* Name */}
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {rider.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mb-4">
                {rider.phone || "N/A"}
              </p>

              {/* Info */}
              <div className="text-sm space-y-2 bg-green-50 rounded-lg p-3">
                <p>
                  <span className="font-medium text-gray-700">📧 Email:</span>{" "}
                  {rider.email}
                </p>
                <p>
                  <span className="font-medium text-gray-700">📞 Phone:</span>{" "}
                  {rider.phone}
                </p>
                <p>
                  <span className="font-medium text-gray-700">✅ Status:</span>{" "}
                  <span className="text-green-600 font-medium">
                    {rider.verificationStatus}
                  </span>
                </p>
              </div>

              {/* Documents */}
              <div className="mt-4">
                <p className="font-medium flex items-center gap-2 text-gray-800">
                  <FileText className="w-4 h-4 text-green-600" />
                  Documents:
                </p>
                {rider.documents ? (
                  <ul className="ml-6 mt-2 space-y-1 text-sm">
                    {rider.documents.licenseUrl && (
                      <li>
                        <a
                          href={rider.documents.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          📄 Driving License
                        </a>
                      </li>
                    )}
                    {rider.documents.aadharUrl && (
                      <li>
                        <a
                          href={rider.documents.aadharUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🪪 Aadhaar / ID Proof
                        </a>
                      </li>
                    )}
                    {rider.documents.photoUrl && (
                      <li>
                        <a
                          href={rider.documents.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🖼️ Profile Photo
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

export default AdminVerifiedRiders;
