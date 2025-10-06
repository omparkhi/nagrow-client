import React from "react";

const OfferCard = () => {
  const offers = [
    {
      type: "bank",
      name: "Axis Bank Credit Card",
      discount: 100,
      minOrder: 299,
    },
    { type: "wallet", name: "PayTM Wallet", discount: 50, minOrder: 199 },
    { type: "platform", name: "First Order", discount: 80, minOrder: 0 },
  ];

  return (
    <div className="flex">
      <div className="p-3 rounded-md bg-gray-50">
        <h4 className="font-bold">
          Save &#8377;{offers.discount} on this order
        </h4>
        <p className="text-sm text-gray-600">{offers.name}</p>
        <p>{offers.minOrder}</p>
      </div>
      <div className="text-[13px] sm:text-[15px] py-1 px-1 border-1 border-gray-400 rounded-md  cursor-pointer">
        Apply
      </div>
    </div>
  );
};

export default OfferCard;
