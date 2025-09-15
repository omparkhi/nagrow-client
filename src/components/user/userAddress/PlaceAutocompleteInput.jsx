import React, { useEffect, useRef } from "react";

const PlaceAutocompleteInput = ({ onPlaceSelect }) => {
  const ref = useRef();

  useEffect(() => {
    // Load extended component library only once
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@googlemaps/extended-component-library@0.6.0/dist/index.min.js";
    document.head.appendChild(script);
  }, []);

  return (
    <gmpx-place-autocomplete
      ref={ref}
      placeholder="Search area or address"
      style={{
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "14px",
        width: "100%",
      }}
      onplacechanged={(e) => {
        const value = e.target.value;
        if (onPlaceSelect) onPlaceSelect(value);
      }}
    />
  );
};

export default PlaceAutocompleteInput;
