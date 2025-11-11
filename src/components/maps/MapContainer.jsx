import React, { useRef, useEffect } from "react";
import { GoogleMap } from "@react-google-maps/api";
import { defaultMapStyles } from "./mapStyles";

const MapContainer = ({ center, zoom = 14, children, onLoad, onIdle }) => {
    const mapRef = useRef();

    useEffect(() => () => (mapRef.current = null), []);

    // const options = {
    //     disableDefaultUI: true,
    //     zoomControl: true,
    //     styles: defaultMapStyles,
       
    // };

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "12px" }}
            center={center}
            zoom={zoom}
            // options={options}
            onLoad={(map) => {
                mapRef.current = map;
                onLoad?.(map);
            }}
            onIdle={() => onIdle?.(mapRef.current)}
        >
            {children}
        </GoogleMap>
    );
};  

export default MapContainer;