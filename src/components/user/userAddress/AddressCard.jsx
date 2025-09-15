import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAddress } from "../../context/AddressContext";
// import EditAddress from "./EditAddress";
import {
  MdEdit,
  MdDelete,
  MdLocationOn,
  MdMap,
  MdArrowBack,
  MdSearch,
} from "react-icons/md";
import { ArrowLeft } from "lucide-react";
import {
  Home,
  Edit,
  MapPin,
  Trash2,
  LocateFixed,
  MapPinPlus,
  MoreVertical,
} from "lucide-react";

const AddressCard = () => {
  const [showMenuIndex, setShowMenuIndex] = useState(false);
  const { addresses, loading, fetchAddress } = useAddress();
  const menuRefs = useRef([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/user-home");
    }
  };

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRefs.current.every((ref) => ref && !ref.contains(e.target))) {
        setShowMenuIndex(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // When clicking edit on a specific card
  const handleEditClick = (address) => {
    setSelectedAddressId(address._id);
    setFormattedAddress(address.formattedAddress);
    setIsEditing(true);
  };

  //edit adress manually handle save
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/users/update-address/${selectedAddressId}`,
        {
          formattedAddress,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Address Updated!");
      // Refresh the addresses in context
      await fetchAddress();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Error whle updating address");
    }
  };

  const handleEditOnMap = (address) => {
    navigate("/map", { state: { address } });
  };

  // delete address call
  const handleDeleteAddress = async (addressId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this address?");
      if (!confirmed) return;
       await axios.delete(
        `http://localhost:3000/api/users/delete-address/${addressId}`,
        {
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
       );
       toast.success("Address deleted successfully");
       // Refresh address list after deletion
       await fetchAddress();
    } catch (error) {
        console.error("Delete Address Error:", error);
        toast.error("Failed to delete address");
    }
  };

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from black to-[#d3d3d3] px-4 py-4">
      <div className="flex w-full text-xl text-[#1c1c1e] gap-2 items-center font-bold">
        <MdArrowBack onClick={handleBack} className="cursor-pointer" />
        <p>Select Your Location</p>
      </div>
      <div className="w-full flex justify-center mt-4">
        <div className="flex justify-between w-full md:w-[90%] lg:w-[60%] bg-white border border-[#686767] rounded-md px-4 py-2 items-center">
          <input
            type="text"
            name="address"
            placeholder="Search an area or address"
            className="w-full  placeholder:font-semibold placeholder:text-[#1c1c1e] outline-none"
          />
          <MdSearch className="text-xl text-[#1c1c1e]" />
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4 sm:gap-4">
        <button className="flex p-2 rounded-md bg-white border border-[#686767] hover:bg-gray-100 " onClick={() => navigate("/map/current-location")}>
          <LocateFixed size={20} strokeWidth={1.5} className="text-[#ff5733]" />
          <p className="text-[0.7rem] font-semibold ml-1 my-auto sm:text-[0.9rem]">
            Use Current Location
          </p>
        </button>
        <button className="flex p-2 rounded-md bg-white border border-[#686767] hover:bg-gray-100 " onClick={() => navigate("/map")}>
          <MapPinPlus size={20} strokeWidth={1.5} className="text-[#ff5733]" />
          <p className="text-[0.7rem] font-semibold ml-1 my-auto sm:text-[0.9rem]">
            Add New Address
          </p>
        </button>
      </div>
      {/* //md:w-96  */}
      <div className="mx-auto w-full md:w-[90%] lg:w-[60%] p-3">
        <p className="text-[1rem] font-semibold text-gray-800 py-2 mt-4">
          Saved Address
        </p>

        {addresses.map((address, idx) => (
          <>
            {/* Left content: icon + title + address */}
            <div
              key={idx}
              className="flex flex-wrap items-start bg-white rounded-xl mt-4 p-4"
            >
              <div className="flex items-start flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <Home className="h-8 w-8 bg-[#F2F2F2] text-[#ff5733] rounded-sm p-2" />
                </div>

                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{address.label}</h2>
                  <p className="text-[#4a4a4a] text-sm mt-1 line-clamp-2">
                    {address.formattedAddress}
                  </p>
                </div>
              </div>
              {/* for Desktop size */}
              <div className="hidden sm:flex gap-3 w-auto ml-auto justify-end">
                <button
                  aria-label="Edit address"
                  className="relative group w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer mt-1"
                  onClick={() => handleEditClick(address)}
                >
                  <Edit size={18} strokeWidth={1.5} className="text-gray-600" />
                  {/* Tooltip */}
                  <span className="absolute w-auto bottom-full mb-2 px-2 py-1 text-sm text-black bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-200">
                    Edit
                  </span>
                </button>

                <button
                  aria-label="View on Map"
                  className="relative group w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer mt-1"
                  onClick={() => handleEditOnMap(address)}
                >
                  <MapPin
                    size={18}
                    strokeWidth={1.5}
                    className="text-gray-600"
                  />
                  {/* Tooltip */}
                  <span className="absolute w-auto bottom-full mb-2 px-2 py-1 text-sm text-black bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-200">
                    Map
                  </span>
                </button>
                <button
                  aria-label="Delete Address"
                  className="relative group w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer mt-1"
                  onClick={() => handleDeleteAddress(address._id)}
                >
                  <Trash2
                    size={18}
                    strokeWidth={1.5}
                    className="text-gray-600"
                  />
                  {/* Tooltip */}
                  <span className="absolute w-auto bottom-full mb-2 px-2 py-1 text-sm text-black bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-200">
                    Delete
                  </span>
                </button>
              </div>

              {/* for mobile size */}
              <button
                className="relative group sm:hidden flex items-center justify-center w-8 h-8 ml-auto hover:bg-gray-200 rounded-full cursor-pointer"
                ref={(el) => (menuRefs.current[idx] = el)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenuIndex(idx === showMenuIndex ? null : idx);
                }}
              >
                <MoreVertical size={18} strokeWidth={1.5} />
              </button>
              {showMenuIndex === idx && (
                <div className="sm:hidden absolute bg-white right-6 mt-9 border border-gray-400 rounded-md">
                  <div className="flex cursor-pointer border-b border-b-gray-400 py-1 px-2 hover:bg-gray-200">
                    <Edit
                      size={18}
                      strokeWidth={1.5}
                      className="text-gray-600"
                    />
                    <p className="ml-1 text-sm text-black">Edit</p>
                  </div>
                  <div className="flex cursor-pointer border-b border-b-gray-400 py-1 px-2 hover:bg-gray-200">
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="text-gray-600"
                    />
                    <p className="ml-1 text-sm text-black">Map</p>
                  </div>
                  <div className="flex cursor-pointer border-b border-b-gray-400 py-1 px-2 hover:bg-gray-200">
                    <Trash2
                      size={18}
                      strokeWidth={1.5}
                      className="text-gray-600"
                    />
                    <p className="ml-1 text-sm text-black">Delete</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ))}
      </div>
      {/* Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Address</h2>
            <input
              type="text"
              value={formattedAddress}
              onChange={(e) => setFormattedAddress(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {isEditing && selectedAddressId === address._id && (
                  <div className="w-full md:w-[70%] bg-gray-300 h-screen flex justify">
                    <div className="p-4 flex">
                      <Home className="h-8 w-8 bg-[#F2F2F2] text-[#ff5733] rounded-sm p-2" />
                      <h2 className="text-xl font-semibold ml-2">
                        {address.label}
                      </h2>
                    </div>
                    <>
                      <input
                        className=" w-[90%] mt-1 px-4 py-2 rounded-lg border-none focus:outline-none bg-[#f0f5fa]"
                        value={formattedAddress}
                        onChange={(e) => setFormattedAddress(e.target.value)}
                      />
                    </>
                  </div>
                )} */}
    </section>
  );
};

export default AddressCard;
