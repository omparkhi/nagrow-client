import React from "react";
import { CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, paymentId, razorpayOrderId, totalAmount } = location.state || {};
  console.log("PaymentSuccess State:", location.state);
  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-lg font-semibold text-red-600">
          Invalid or expired session.
        </p>
        <button
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/user-home")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <p className="text-gray-700 font-semibold">
          Order ID: <span className="text-black">{orderId}</span>
        </p>
        <p className="text-gray-700 font-semibold">
          Payment ID: <span className="text-black">{paymentId}</span>
        </p>
        <p className="text-gray-700 font-semibold">
          Razorpay Order ID: <span className="text-black">{razorpayOrderId}</span>
        </p>
        <p className="text-lg font-bold mt-4">
          Amount Paid: ₹{totalAmount}
        </p>

      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-semibold">Payment Successful 🎉</h1>
      <p className="text-gray-600 mt-2">Your order has been placed successfully!</p>
    </div>
  );
};

export default PaymentSuccess;
