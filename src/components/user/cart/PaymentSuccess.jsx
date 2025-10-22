import React from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-2xl font-semibold">Payment Successful 🎉</h1>
      <p className="text-gray-600 mt-2">Your order has been placed successfully!</p>
    </div>
  );
};

export default PaymentSuccess;
