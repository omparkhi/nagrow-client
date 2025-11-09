import React, { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SOCKET_URL}`); 

const RiderLiveTracker = ({ riderId }) => {
    useEffect(() => {
        if (!riderId) return;

        socket.emit("joinRiderRoom", riderId);

        const updateLocation = async () => {
           if (navigator.geolocation) {
             navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    console.log("📍 Sending location:", latitude, longitude);

                    socket.emit("riderLocationUpdate", {
                        riderId,
                        latitude,
                        longitude,
                    });
                },
                (err) => console.error("Location error:", err),
                { enableHighAccuracy: true }
            );
           } else {
                console.log("❌ Geolocation not supported");
           }
        };

        updateLocation();
        const interval = setInterval(updateLocation, 15000);
        return () => clearInterval(interval);
    }, [riderId]);

    return <p className="text-green-500 font-semibold">Tracking active...</p>;
};

export default RiderLiveTracker;