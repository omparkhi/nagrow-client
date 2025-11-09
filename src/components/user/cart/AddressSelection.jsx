import React, { useState, useEffect } from "react";
import { useAddress } from "../../../context/AddressContext";
import { FaBuilding } from "react-icons/fa";
import {
  Home,
  Edit,
  MapPin,
  Trash2,
  LocateFixed,
  MapPinPlus,
  MoreVertical,
} from "lucide-react";

const AddressSelection = () => {
  const { selectedAddress ,addresses, loading, error } = useAddress();
  

  // useEffect(() => {
  //   if (addresses.length > 0 && !selectedAddressId) {
  //     //   console.log(addresses, addresses.formattedAddress);
  //     setSelectedAddressId(addresses[0]._id);
  //   }
  // }, [addresses, selectedAddressId]);


  if (loading) return <p>loading address ...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!selectedAddress) return <p>No address found</p>;

  return (
    <div className="w-full sm:w-xl md:w-2xl mx-auto px-4 pt-3 pb-4 bg-white rounded-xl mt-3">
      <p className="text-[13px] font-bold text-gray-500">
        YOUR DELIVERY ADDRESS
      </p>
      <div className="flex mt-2 cursor-pointerrounded-md">
        <div className=" p-1 rounded-sm inline-flex items-center justify-center">
          <div className="flex-shrink-0">
                  <Home className="h-5 w-5 text-[#ff5733] " />
                </div>

                <div className="ml-4  w-full flex items-center justify-between">
                  <p className="text-sm font-semibold  text-gray-800 line-clamp-2">
                    {selectedAddress.formattedAddress}
                  </p>
                </div>
        </div>
      </div>
              
          <div className="border-t border-gray-500 mt-2 flex items-center  gap-2 cursor-pointer">
            <MapPinPlus
              size={20}
              strokeWidth={1.5}
              className="text-[#ff5733] mt-2"
            />
            <p className="text-sm font-bold text-[#121212] mt-2 ml-2">
              Change delivery address
            </p>
          </div>
       
    </div>
  );
};

export default AddressSelection;
