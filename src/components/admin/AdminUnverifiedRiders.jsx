import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, AlertCircle } from "lucide-react";

const AdminUnverifiedRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState({}); // store per-rider rejection reason

  // Fetch unverified riders
  const fetchRiders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/admin/unverified/riders"
      );
      setRiders(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch unverified riders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiders();
  }, []);

  // Approve/Reject Handler
  const handleVerification = async (id, action) => {
  try {
    const payload =
      action === "reject"
        ? { action, rejectionReason: reasons[id] || "" }
        : { action };

    await axios.post(
      `http://localhost:3000/api/admin/rider/verify-status-update/${id}`,
      payload
    );

    toast.success(`Rider ${action} successfully`);

    // Remove rider locally from state
    setRiders((prev) => prev.filter((r) => r._id !== id));

    // Clear reason input for that rider
    setReasons((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
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
        Unverified Riders
      </h2>

      {riders.length === 0 ? (
        <p className="text-green-600 font-medium text-center text-lg">
          No pending verifications 🎉
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {riders.map((rider) => (
            <div
              key={rider._id}
              className="rounded-2xl shadow-md bg-white border border-red-100 hover:border-red-300 p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Rider Photo */}
              {rider.documents?.photoUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={rider.documents.photoUrl}
                    alt="Rider"
                    className="w-20 h-20 object-cover rounded-full shadow-md border-2 border-red-200"
                  />
                </div>
              )}

              {/* Name */}
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {rider.name}
              </h3>

              {/* Info */}
              <div className="text-sm space-y-2 bg-red-50 rounded-lg p-3 mt-3">
                <p>
                  <span className="font-medium text-gray-700">📞 Phone:</span>{" "}
                  {rider.phone}
                </p>
                <p>
                  <span className="font-medium text-gray-700">⏳ Status:</span>{" "}
                  <span className="text-red-600 font-medium">
                    {rider.verificationStatus}
                  </span>
                </p>
              </div>

              {/* Documents */}
              <div className="mt-4">
                <p className="font-medium flex items-center gap-2 text-gray-800">
                  <FileText className="w-4 h-4 text-red-600" />
                  Documents:
                </p>
                {rider.documents ? (
                  <ul className="ml-6 mt-2 space-y-1 text-sm">
                    {rider.documents.aadharUrl && (
                      <li>
                        <a
                          href={rider.documents.aadharUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          🆔 Aadhaar
                        </a>
                      </li>
                    )}
                    {rider.documents.licenseUrl && (
                      <li>
                        <a
                          href={rider.documents.licenseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          📄 License
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
                          🖼️ Rider Photo
                        </a>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No documents uploaded
                  </p>
                )}
              </div>

              {/* Approve / Reject */}
              <div className="mt-6 flex gap-2 items-center">
                <button
                  onClick={() => handleVerification(rider._id, "approve")}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <input
                  type="text"
                  placeholder="Rejection Reason"
                  value={reasons[rider._id] || ""}
                  onChange={(e) =>
                    setReasons({ ...reasons, [rider._id]: e.target.value })
                  }
                  className="border rounded px-2 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <button
                  onClick={() => handleVerification(rider._id, "reject")}
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

export default AdminUnverifiedRiders;
