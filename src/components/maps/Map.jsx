import React, { useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const Map = ({ center, zoom = 15, children, onLoad }) => {
    const mapRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        return () => {
            mapRef.current = null;
        };
    }, []);


    return (
        <div>
            <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "12px" }}
            center={center}
            zoom={zoom}
            onLoad={(map) => {
                mapRef.current = map;
                onLoad?.(map);
            }}
            >
            {children}
            </GoogleMap>
        </div>
    );
}

export default Map;