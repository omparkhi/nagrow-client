import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useAddress } from "../../context/AddressContext";
import MapMarker from "../../../assets/MapMarker.png";

const LIBRARIES = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 21.1458, lng: 79.0882 };

const MapModalPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { fetchAddress } = useAddress();
  const existing = state?.address || null;

  const initialLat =
    existing?.coordinates?.coordinates?.[1] ?? defaultCenter.lat;
  const initialLng =
    existing?.coordinates?.coordinates?.[0] ?? defaultCenter.lng;

  const [marker, setMarker] = useState({ lat: initialLat, lng: initialLng });
  const [label, setLabel] = useState(existing?.label || "");
  const [previewAddress, setPreviewAddress] = useState(
    existing?.formattedAddress || existing?.fullAddress || ""
  );
  const [saving, setSaving] = useState(false);

  // Autocomplete state
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState([]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef(null);
  const debounceRef = useRef(null);

  // Reverse Geocode
  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google) return;
    new window.google.maps.Geocoder().geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results[0]) {
          setPreviewAddress(results[0].formatted_address);
        }
      }
    );
  }, []);

  // Pan map when marker changes
  useEffect(() => {
    if (mapRef.current && marker) {
      mapRef.current.panTo(marker);
      mapRef.current.setZoom(16);
    }
  }, [marker]);

  // Fetch predictions from REST Autocomplete API
  const fetchPredictions = async (input) => {
    if (!input) {
      setPredictions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete?key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-FieldMask":
              "suggestions.placePrediction.text,suggestions.placePrediction.placeId",
          },
          body: JSON.stringify({ input }),
        }
      );

      const data = await res.json();
      setPredictions(data.suggestions || []);
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setPredictions([]);
    }
  };

  // Debounced input effect
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query) {
      setPredictions([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchPredictions(query);
    }, 400);
  }, [query]);

  // Handle select from predictions
  const handlePredictionSelect = async (prediction) => {
    setQuery(prediction.placePrediction.text.text);
    setPredictions([]);

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${
          prediction.placePrediction.placeId
        }?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&languageCode=en`,
        {
          headers: {
            "X-Goog-FieldMask": "id,displayName,formattedAddress,location",
          },
        }
      );

      const place = await res.json();
      if (place?.location) {
        setMarker({
          lat: place.location.latitude,
          lng: place.location.longitude,
        });
        setPreviewAddress(
          place.formattedAddress || place.displayName?.text || ""
        );
      }
    } catch (err) {
      console.error("Error fetching place details:", err);
    }
  };

  // Save confirmed address
  const handleConfirm = async () => {
    if (!label) {
      toast.error("Please provide a label (Home / Work / etc.)");
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        addressId: existing?._id,
        label,
        latitude: marker.lat,
        longitude: marker.lng,
        fullAddress: previewAddress,
      };

      const res = await axios.post(
        "http://localhost:3000/api/users/save-address",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.message || "Saved");
      await fetchAddress?.();
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b gap-4">
        <div className="flex-1 flex flex-col relative">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (Home, Work...)"
            className="w-full border px-3 py-2 rounded mb-2"
          />

          {/* Custom Autocomplete Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address..."
            className="w-full border px-3 py-2 rounded"
          />

          {/* Predictions dropdown */}
          {predictions.length > 0 && (
            <ul className="absolute top-[72px] left-0 w-full bg-white border rounded shadow z-50">
              {predictions.map((p, idx) => (
                <li
                  key={idx}
                  onClick={() => handlePredictionSelect(p)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {p.placePrediction.text.text}
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm text-gray-600 mt-2">
            {previewAddress || "Pick a location on the map or via search"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            {saving ? "Saving..." : "Confirm Location"}
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={marker}
          zoom={20}
          onLoad={(map) => (mapRef.current = map)}
          onIdle={() => {
            if (!mapRef.current) return;
            const center = mapRef.current.getCenter();
            if (center) {
              const lat = center.lat();
              const lng = center.lng();
              setMarker({ lat, lng }); // ✅ update marker state
              reverseGeocode(lat, lng); // ✅ update address
            }
          }}
        />

        {/* Fixed overlay marker */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <img
            src={MapMarker}
            alt="marker"
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MapModalPage;
