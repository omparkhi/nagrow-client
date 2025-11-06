import React, { useState, useEffect } from "react";
import MapPicker from "../../maps/MapPicker";
import { useAddress } from "../../../context/AddressContext";
import { useNavigate, useLocation } from "react-router-dom";

const UserAddressMap = ({ mode = "add" }) => {
    const navigate = useNavigate();
    const { saveAddress } = useAddress();
    const location = useLocation();
    const state = location.state || {};

    const [initialCenter, setInitialCenter] = useState(null);   
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const loadLocation = async () => {
    try {
      if (mode === "current" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            // console.log("Accurate GPS:", pos.coords.latitude, pos.coords.longitude);
            setInitialCenter({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
            setLoading(false);
          },
          (err) => {
            console.error(err);
            toast.error("Location permission denied");
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // 👈 Add this
        );
      } else if (mode === "view" && state.address) {
        const coords = state.address.coordinates.coordinates;
        setInitialCenter({ lat: coords[1], lng: coords[0] });
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  loadLocation();
}, [mode, state.address]);


    const handleSave = async (locationData) => {
        const { address, coordinates } = locationData;
        await saveAddress({
    label: "other",
    latitude: coordinates.lat,
    longitude: coordinates.lng, 
  });
  navigate(-1);
    };

    const handleCancel = () => window.history.back();

    return (
        <MapPicker
            mode={mode}
            initialCenter={initialCenter}
            onSave={handleSave}
            onCancel={handleCancel}
        />
    );

};

export default UserAddressMap;