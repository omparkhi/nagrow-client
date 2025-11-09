import React, { useEffect, useState } from "react";
import MapPicker from "../../maps/MapPicker";
import { useAddress } from "../../../context/AddressContext";
import { useLocation, useNavigate } from "react-router-dom";
import { reverseGeocode } from "../../../utils/reverseGeocode";

const CurrentLocation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [initialCenter, setInitialCenter] = useState();
    const [address, setAddress] = useState(initialCenter?.address || "");

    const [loading, setLoading] = useState(true);
    const { saveAddress } = useAddress();

    useEffect(() => {
        const getCurrentLocation =  () => {
            try {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        const lat = pos.coords.latitude;
                        const lng = pos.coords.longitude;
                        console.log("cuurent location: ", "lat: ", lat, "lng: ", lng);
                        const addr =  await reverseGeocode(lat, lng);
                        setInitialCenter({ lat, lng, address: addr })
                        setLoading(false);
                        
                        
                    }, 
                    (err) => {
                        console.error(err);
                        toast.error("Location permission denied");
                        setLoading(false);
                    },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    )
                }

                
            } catch (err) {
                console.error(err);
                toast.error("Location permission denied");
                setLoading(false);
            }
            
        };
        getCurrentLocation();
    }, []);

    const handleSelect = ({ address, latitude, longitude }) => {
        saveAddress({
            label: "New",
            latitude,
            longitude,
            fullAddress: address,
        });
        navigate(-1);
};


    return (
        <div>
            <MapPicker 
                initialCenter={initialCenter}
                onSelect={handleSelect} 
            />
        </div>
    );
}

export default CurrentLocation;