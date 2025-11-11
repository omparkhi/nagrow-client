    import React, { useRef, useCallback, useEffect, useState } from "react";
    import MapContainer from "./MapContainer";
    import { reverseGeocode } from "../../utils/reverseGeocode";
    import { useMapLoader } from "./useMapLoader";
    import { useCurrentLocation } from "./useCurrentLocation";
    import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
    import { toast } from "react-toastify";
    import MapMarker from "../../assets/MapMarker.png";


    const MapPicker = ({ 
        initialCenter,
        onSelect,
        onCancel,
        showSave = true,
    }) => {

        const { isLoaded } = useMapLoader();
        const { location: fallback, loading: loadingLocation } = useCurrentLocation();
        const [center, setCenter] = useState(initialCenter || null);
        const [address, setAddress] = useState("");
        const [searchValue, setSearchValue] = useState("");
        const [loading, setLoading] = useState(false);
        const mapRef = useRef(null);



     const handleIdle = useCallback(async () => {
    if (!mapRef.current) return;

    const c = mapRef.current.getCenter();
    if (!c) return;

    const newCenter = { lat: c.lat(), lng: c.lng() };
    setCenter((prev) => {
        if (
            !prev ||
            Math.abs(prev.lat - newCenter.lat) > 0.000001 ||
            Math.abs(prev.lng - newCenter.lng) > 0.000001
        ) {
            return newCenter;
        }
        return prev; // no change → no rerender
    });

    // console.log("Center changed:", newCenter);

    setLoading(true);
    try {
      const addr = await reverseGeocode(newCenter.lat, newCenter.lng);
      console.log("Reverse geocoded address:", addr);
      const formatted =
        typeof addr === "object"
          ? addr.formattedAddress || addr.fullAddress || JSON.stringify(addr)
          : addr;
      setAddress(formatted);
    } catch (err) {
      console.error("Reverse geocode error:", err);
      setAddress("");
    } finally {
      setLoading(false);
    }
  }, [reverseGeocode]);

//   // ✅ Initialize map once location is available
//   useEffect(() => {
//     if (!center && !loadingLocation && fallback) {
//       setCenter(fallback);
//     }
//   }, [center, loadingLocation, fallback]);

  if (!isLoaded) return <p>Loading map...</p>;
  if (loadingLocation || !center) return <p>Getting your location...</p>;

  const handleSave = () => {
    if (!address) return toast.error("Select a valid address");
    onSelect?.({ address, latitude: center.lat, longitude: center.lng });
  };

  const handlePlaceSelect = ({ lat, lng, address }) => {
    setCenter({ lat, lng });
    setAddress(address);
  };
        return (
            <div className="relative w-full h-[75vh] flex flex-col gap-2">
                <PlaceAutocompleteInput
                    value={searchValue}
                    onChange={setSearchValue}
                    onSelect={handlePlaceSelect}
                />

                <div className="relative flex-1">
                    <MapContainer 
                        center={center} 
                        zoom={18} 
                        onLoad={(m) => {
                            mapRef.current = m;
                            handleIdle(); // fetch address immediately for initial position
                        }}
                        onIdle={handleIdle}
                        />

                    <img
                        src={MapMarker} 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full w-12 pointer-events-none"
                        alt="marker"
                    />
                </div>

                <div className="bg-white p-3 rounded-md shadow-md flex justify-between items-center">
                    <p className="text-sm text-gray-700 truncate">
                        {loading ? "Fetching address..." : address || "Move map to pick location"}
                    </p>
                {showSave && (
                <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                    Save
                </button>
                )}
                {onCancel && (
                <button
                    onClick={onCancel}
                    className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                    Cancel
                </button>
                )}
            </div>
        </div>
        );
    }

    export default MapPicker;