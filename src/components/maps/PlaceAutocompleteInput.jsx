import React, { useEffect, useRef } from "react";

const PlaceAutocompleteInput = ({ value, onChange, onSelect }) => {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google?.maps?.places) {
      console.error("Google Maps API not loaded.");
      return;
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
      componentRestrictions: { country: "in" },
      fields: ["geometry", "formatted_address"],
    });

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place.geometry) return;

      onSelect({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        address: place.formatted_address,
      });
    });

    // Cleanup listener on unmount
    return () => {
      if (listener) listener.remove();
      if (autocompleteRef.current)
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    };
  }, [onSelect]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search location, area, or landmark"
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm 
                   focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none 
                   transition-all duration-200 ease-in-out placeholder-gray-400"
      />
      <span
        className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
          />
        </svg>
      </span>
    </div>
  );
};

export default PlaceAutocompleteInput;
