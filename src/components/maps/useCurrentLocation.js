import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useCurrentLocation = (fallback = { lat: 21.1458, lng: 79.0882 }) => {
    const [location, setLocation] = useState(null);
    const [loading,  setLoading] = useState(true);

    useEffect(() => {
        if(!navigator.geolocation) {
            toast.error("Geolocation not supported by browser");
            setLocation(fallback);
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLoading(false);
            },
            (err) => {
                console.error("Geolocation error:", err);
                toast.warn("Using fallback location");
                setLocation(fallback);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    return { location, loading };
}