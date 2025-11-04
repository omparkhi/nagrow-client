import React, { useState, useEffect, useRef } from "react";
import { MdStar } from "react-icons/md";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

const cuisines = ["Main Course", "Dessert", "Snacks", "Beverages", "Appetizers"];
const deliveryOptions = [
  { label: "Under 15 mins", value: 15 },
  { label: "30 mins", value: 30 },
  { label: "30-45 mins", value: 45 },
  { label: "45+ mins", value: 60 },
];
const ratingOptions = [3, 4, 5];


const FilterBar = ({ onFilterChange }) => {
  const [vegOnly, setVegOnly] = useState(false);
  const [nonVegOnly, setNonVegOnly] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [rating, setRating] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [showCuisineModal, setShowCuisineModal] = useState(false);
  const [searchCuisine, setSearchCuisine] = useState("");
  const dropdownRef = useRef(null);

  // Close cuisine dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCuisineModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  onFilterChange({
    rating,
    veg: vegOnly,
    nonVeg: nonVegOnly,
    cuisines: selectedCuisines,
    deliveryTime,
  });
}, [rating, vegOnly, nonVegOnly, selectedCuisines, deliveryTime, onFilterChange]);

  const handleVegToggle = () => {
    setVegOnly(!vegOnly);
    if (!vegOnly && nonVegOnly) setNonVegOnly(false);
  };

  const handleNonVegToggle = () => {
    setNonVegOnly(!nonVegOnly);
    if (!nonVegOnly && vegOnly) setVegOnly(false);
  };

  const handleCuisineSelect = (c) => {
    if (c === "All Cuisines") {
      setSelectedCuisines([]);
      setShowCuisineModal(false);
      return;
    }
    setSelectedCuisines((prev) =>
      prev.includes(c) ? prev.filter((item) => item !== c) : [...prev, c]
    );
  };

  const removeCuisine = (c) => {
    setSelectedCuisines((prev) => prev.filter((item) => item !== c));
  };

  const handleRatingSelect = (r) => setRating(rating === r ? 0 : r);

  const handleDeliverySelect = (d) =>
    setDeliveryTime(deliveryTime === d ? 0 : d);

  const getDeliveryLabel = () => {
    const selected = deliveryOptions.find((d) => d.value === deliveryTime);
    return selected ? selected.label : "";
  };

  const clearFilters = () => {
    setVegOnly(false);
    setNonVegOnly(false);
    setSelectedCuisines([]);
    setRating(0);
    setDeliveryTime(0);
    setSearchCuisine("");
  };

  const filteredCuisines = ["All Cuisines", ...cuisines].filter((c) =>
    c.toLowerCase().includes(searchCuisine.toLowerCase())
  );

  return (
    <>
      {/* --- Main Filter Bar --- */}
      <div className="flex flex-wrap gap-3 py-4 bg-white shadow-sm rounded-lg px-2 sm:px-4 relative">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-800 font-medium text-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter</span>
        </button>

        <button
          className={`px-4 py-2 rounded-xl border text-sm font-medium shadow-sm ${
            vegOnly
              ? "bg-green-500 text-white border-green-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={handleVegToggle}
        >
          Veg Only
        </button>

        <button
          className={`px-4 py-2 rounded-xl border text-sm font-medium shadow-sm ${
            nonVegOnly
              ? "bg-green-500 text-white border-green-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={handleNonVegToggle}
        >
          Non-Veg
        </button>

        {ratingOptions.map((r) => (
          <button
            key={r}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium shadow-sm ${
              rating === r
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleRatingSelect(r)}
          >
            {r}+ <MdStar className="h-4 w-4 text-yellow-400" />
          </button>
        ))}

        {deliveryOptions.map((d) => (
          <button
            key={d.value}
            className={`px-4 py-2 rounded-xl border text-sm font-medium shadow-sm ${
              deliveryTime === d.value
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => handleDeliverySelect(d.value)}
          >
            {d.label}
          </button>
        ))}

        {/* Cuisine Dropdown (Desktop) */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          <button
            onClick={() => setShowCuisineModal(!showCuisineModal)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-800 font-medium text-sm"
          >
            Cuisine
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showCuisineModal ? "rotate-180" : ""
              }`}
            />
          </button>

          {showCuisineModal && (
            <div className="absolute mt-2 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-56 max-h-60 overflow-y-auto">
              {["All Cuisines", ...cuisines].map((c, i) => (
                <label
                  key={i}
                  onClick={() => handleCuisineSelect(c)}
                  className={`flex justify-between items-center px-4 py-2 text-sm cursor-pointer ${
                    selectedCuisines.includes(c)
                      ? "bg-orange-100 text-orange-600 font-semibold"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <span>{c}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cuisine Button (Mobile) */}
        <button
          onClick={() => setShowCuisineModal(true)}
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-800 font-medium text-sm"
        >
          Cuisine
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* --- Selected Filters --- */}
      {Boolean(vegOnly ||
        nonVegOnly ||
        selectedCuisines.length > 0 ||
        rating ||
      deliveryTime) && (
        <div className="flex flex-wrap gap-2 mt-3 px-3">
          {vegOnly && (
            <span className="flex items-center gap-1 border border-green-500 text-green-600 px-3 py-1 rounded-full text-sm">
              Veg
              <X className="w-4 h-4 cursor-pointer" onClick={() => setVegOnly(false)} />
            </span>
          )}
          {nonVegOnly && (
            <span className="flex items-center gap-1 border border-green-500 text-green-600 px-3 py-1 rounded-full text-sm">
              Non-Veg
              <X className="w-4 h-4 cursor-pointer" onClick={() => setNonVegOnly(false)} />
            </span>
          )}
          {selectedCuisines.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1 border border-orange-500 text-orange-600 px-3 py-1 rounded-full text-sm"
            >
              {c}
              <X className="w-4 h-4 cursor-pointer" onClick={() => removeCuisine(c)} />
            </span>
          ))}
          {rating !== 0 && (
            <span className="flex items-center gap-1 border border-green-500 text-green-600 px-3 py-1 rounded-full text-sm">
              {rating}+ Star
              <X className="w-4 h-4 cursor-pointer" onClick={() => setRating(0)} />
            </span>
          )}
          {deliveryTime !== 0 && (
            <span className="flex items-center gap-1 border border-green-500 text-green-600 px-3 py-1 rounded-full text-sm">
              {getDeliveryLabel()}
              <X className="w-4 h-4 cursor-pointer" onClick={() => setDeliveryTime(0)} />
            </span>
          )}
        </div>
      )}

      {/* --- Mobile Cuisine Overlay --- */}
      {showCuisineModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:hidden">
          <div className="bg-white w-full h-[85vh] rounded-t-3xl shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Cuisines</h2>
              <X
                className="w-5 h-5 cursor-pointer text-gray-700"
                onClick={() => setShowCuisineModal(false)}
              />
            </div>

            {/* Search */}
            <div className="p-4 pb-0">
              <input
                type="text"
                placeholder="Search cuisines..."
                value={searchCuisine}
                onChange={(e) => setSearchCuisine(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Cuisine List */}
            <div className="flex-1 overflow-y-auto mt-3 px-4 space-y-2">
              {filteredCuisines.map((c, i) => (
                <label
                  key={i}
                  className="flex items-center justify-between py-2 cursor-pointer border-b last:border-none"
                  onClick={() => handleCuisineSelect(c)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCuisines.includes(c)}
                      readOnly
                      className="accent-orange-500 w-4 h-4"
                    />
                    <span className="text-gray-800 text-sm">{c}</span>
                  </div>
                </label>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t mt-auto p-4 space-y-2">
              <button
                onClick={() => setShowCuisineModal(false)}
                className="w-full bg-orange-500 text-white py-3 rounded-xl font-medium"
              >
                Apply
              </button>
              <button
                onClick={clearFilters}
                className="w-full text-gray-600 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;
