import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript, GoogleMap } from "@react-google-maps/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useAddress } from "../../context/AddressContext";
import MapMarker from "../../../assets/MapMarker.png";

const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 21.1458, lng: 79.0882 }; // Nagpur fallback

const CurrentLocationMapModal = () => {
  const navigate = useNavigate();
  const { fetchAddress } = useAddress();

  const [marker, setMarker] = useState(null);
  const [label, setLabel] = useState("");
  const [previewAddress, setPreviewAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  //   const swiggyMapStyle = [
  //   // Hide all icons
  //   { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  //   { featureType: "transit", stylers: [{ visibility: "off" }] },

  //   // General label styling
  //   {
  //     elementType: "labels.text.fill",
  //     stylers: [{ color: "#6b6b6b" }]
  //   },
  //   {
  //     elementType: "labels.text.stroke",
  //     stylers: [{ color: "#000000ff" }, { weight: 2 }]
  //   },

  //   // Administrative areas
  //   {
  //     featureType: "administrative",
  //     elementType: "geometry.fill",
  //     stylers: [{ color: "#fefefe" }]
  //   },
  //   {
  //     featureType: "administrative",
  //     elementType: "geometry.stroke",
  //     stylers: [{ color: "#bbb9b9ff" }]
  //   },

  //   // Landscape
  //   {
  //     featureType: "landscape",
  //     elementType: "geometry",
  //     stylers: [{ color: "#f8f8f8" }]
  //   },

  //   // Buildings (3D structures)
  //   {
  //     featureType: "poi",
  //     elementType: "geometry",
  //     stylers: [{ color: "#f2f2f2" }]
  //   },

  //   // Roads
  //   {
  //     featureType: "road",
  //     elementType: "geometry",
  //     stylers: [{ color: "#000000ff" }]
  //   },
  //   {
  //     featureType: "road.arterial",
  //     elementType: "geometry",
  //     stylers: [{ color: "#fdfdfd" }]
  //   },
  //   {
  //     featureType: "road.highway",
  //     elementType: "geometry",
  //     stylers: [{ color: "#f6f6f6" }]
  //   },
  //   {
  //     featureType: "road.local",
  //     elementType: "geometry",
  //     stylers: [{ color: "#000000ff" }]
  //   },
  //   {
  //     featureType: "road",
  //     elementType: "geometry.stroke",
  //     stylers: [{ color: "#bbb9b9ff" }]
  //   },

  //   // Water
  //   {
  //     featureType: "water",
  //     elementType: "geometry",
  //     stylers: [{ color: "#6cb8f7ff" }]
  //   }
  // ];
  // Reverse geocode function
  // const reverseGeocode = useCallback(async (lat, lng) => {
  //   if (!window.google) return;
  //   const geocoder = new window.google.maps.Geocoder();
  //   geocoder.geocode({ location: { lat, lng } }, (results, status) => {
  //     if (status === "OK" && results[0]) {
  //       setPreviewAddress(results[0].formattedAddress);
  //       // Optionally, you can default label from place type or name
  //       // if (!label) {
  //         setLabel(results[0].formatted_address.split(",")[0]); // first part of address
  //       // }
  //     } else {
  //       setPreviewAddress("");
  //     }
  //   });
  // }, [label]);
  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address || "Unknown Address"; // ✅ safe
        setPreviewAddress(address);
        setLabel((prev) => prev || address.split(",")[0]);
      } else {
        console.warn("Geocoder failed:", status, results);
        setPreviewAddress("Address not found");
      }
    });
  }, []);

  // Get current location on mount
  // useEffect(() => {
  //   if (!navigator.geolocation) {
  //     toast.error("Geolocation not supported by your browser");
  //     setMarker(defaultCenter);
  //     reverseGeocode(defaultCenter.lat, defaultCenter.lng);
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;
  //       setMarker({ lat, lng });
  //       reverseGeocode(lat, lng);
  //     },
  //     (error) => {
  //       toast.error("Unable to get your location");
  //       setMarker(defaultCenter);
  //       reverseGeocode(defaultCenter.lat, defaultCenter.lng);
  //     }
  //   );
  // }, [reverseGeocode]);

  useEffect(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      setMarker(defaultCenter);
      reverseGeocode(defaultCenter.lat, defaultCenter.lng);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position.coords); // ✅ debug log
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMarker({ lat, lng });
        reverseGeocode(lat, lng);
      },
      (error) => {
        console.error("Geolocation error:", error); // ✅ see why it fails
        if (error.code === 1) {
          toast.error("Permission denied for location access");
        } else if (error.code === 2) {
          toast.error("Position unavailable");
        } else if (error.code === 3) {
          toast.error("Location request timed out");
        } else {
          toast.error("Unable to get your location, showing Nagpur");
        }

        // fallback
        setMarker(defaultCenter);
        reverseGeocode(defaultCenter.lat, defaultCenter.lng);
      },
      {
        enableHighAccuracy: true, // ✅ ask for GPS
        timeout: 10000, // 10s timeout
        maximumAge: 0, // no cached location
      }
    );
  }, [reverseGeocode]);

  // Map click handler
  const onMapClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  // Marker drag end handler
  const onMarkerDragEnd = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });
      reverseGeocode(lat, lng);
    },
    [reverseGeocode]
  );

  // Save address handler
  const handleConfirm = async () => {
    if (!label) {
      toast.error("Please provide a label for this location");
      return;
    }
    if (!marker) {
      toast.error("Location not selected");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        label,
        latitude: marker.lat,
        longitude: marker.lng,
      };

      const res = await axios.post(
        "http://localhost:3000/api/users/save-address",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.message || "Address saved");
      if (fetchAddress) await fetchAddress();
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded || !marker) return <div>Loading map and location...</div>;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b gap-4">
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (Home, Work...)"
            className="w-full border px-3 py-2 rounded mb-2"
          />
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {previewAddress || "Drag the pin or click on map to pick location"}
          </p>
        </div>
        <div className="ml-4 flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 rounded bg-gray-200"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 text-white"
            type="button"
          >
            {saving ? "Saving..." : "Confirm Location"}
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1">
        {/* <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={marker}
          zoom={16}
          onClick={onMapClick}
        >
          <Marker position={marker} draggable onDragEnd={onMarkerDragEnd} />
        </GoogleMap> */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={marker}
          zoom={19}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onIdle={() => {
            if (!mapRef.current) return;
            const center = mapRef.current.getCenter();
            if (!center) return;
            const lat = center.lat();
            const lng = center.lng();
            reverseGeocode(lat, lng); // only update address
          }}
        >
          {/* Fixed Center Marker */}
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
        </GoogleMap>
      </div>
    </div>
  );
};

export default CurrentLocationMapModal;
