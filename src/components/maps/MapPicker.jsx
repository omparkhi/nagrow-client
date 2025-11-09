    import React, { useRef, useCallback, useEffect, useState } from "react";
    import { useLoadScript, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
    import { reverseGeocode } from "../../utils/reverseGeocode";
    import PlaceAutocompleteInput from "./PlaceAutocompleteInput";
    import { toast } from "react-toastify";
    import MapMarker from "../../assets/MapMarker.png";
    import { useLocation } from "react-router-dom";

    const libraries = ["places"]; 

    const MapPicker = ({ 
        initialCenter,
        onSelect,
        onCancel,
        showSave = true,
    }) => {

        // const location = useLocation();
        // const [isUserLocated, setIsUserLocated] = useState(false);
        const [center, setCenter] = useState(initialCenter || null);
        const [address, setAddress] = useState("");
        const [searchValue, setSearchValue] = useState("");
        const [loading, setLoading] = useState(false);
        const mapRef = useRef();

        const { isLoaded } = useJsApiLoader({
                id: "google-map-script",
                googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                libraries,
        });

        // Get current location once if no initialCenter
        useEffect(() => {
  return () => {
    mapRef.current = null;
  };
}, []);


    useEffect(() => { 
        if (initialCenter) return;

        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by browser");
            setCenter({ lat: 21.1458, lng: 79.0882 });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => {
                console.error("Geolocation error:", err);
                setCenter({ lat: 21.1458, lng: 79.0882 }); // fallback Nagpur
                toast.warn("Using fallback location");
            },

            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } 
        );
    }, [initialCenter]);

    

        // Reverse geocode on map move
        const handleIdle = useCallback(async () => {
            if(!mapRef.current) return;
            const c = mapRef.current.getCenter();
            if(!c) return;

            const lat = c.lat();
            const lng = c.lng();
            setLoading(true);
            // console.log("Center lat/lng before reverse geocode:", lat, lng);

            try {
                const addr = await reverseGeocode(lat, lng);
                setAddress(addr);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, []);

        const handlePlaceSelect = (data) => {
            setCenter({ lat: data.lat, lng: data.lng });
            setAddress(data.address);
        };

        if (!isLoaded) return <p>Loading Google Maps...</p>;
        if (!center) return <p>Fetching your current location...</p>;




        const handleSave = () => {
            if (!address) return toast.error("Select a valid address");
            onSelect?.({ 
                address, 
                latitude: center.lat, 
                longitude: center.lng 
            });
        };


        
        return (
            <div className="relative w-full h-[75vh] flex flex-col gap-2">
                <PlaceAutocompleteInput
                    value={searchValue}
                    onChange={setSearchValue}
                    onSelect={handlePlaceSelect}
                />

                <div className="relative flex-1">
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={center}
                        zoom={19}
                        onLoad={(map) => (mapRef.current = map)}
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