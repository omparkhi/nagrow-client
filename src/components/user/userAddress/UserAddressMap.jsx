import React, { useState, useEffect } from "react";
import MapPicker from "../../maps/MapPicker";
import { useAddress } from "../../../context/AddressContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const UserAddressMap = () => {
    const navigate = useNavigate();
    const { fetchAddresses ,saveAddress } = useAddress();
    const { state } = useLocation();
    const mode = state?.mode;
    const address = state?.address;
    const addressId = state?.addressId;
    

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
        const coords = state?.address?.coordinates?.coordinates;
        if (Array.isArray(coords) && coords.length === 2) {
          setInitialCenter({ lat: coords[1], lng: coords[0] });
        } else {
          toast.error("Invalid address coordinates. Using default.");
          setInitialCenter({ lat: 21.1458, lng: 79.0882 });
        }
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
}, [mode, address]);


    const handleSave = async ({ address, coordinates }) => {
      const payload = {
        label: "other",
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        addressId,
      }
      console.log("payload saved: ", payload);
      await saveAddress(payload);
      await fetchAddresses();
      toast.success(mode === "view" ? "Address updated" : "Address added");

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