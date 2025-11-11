import React from "react";
import { useNavigate } from "react-router-dom";
import MapPicker from "../../maps/MapPicker";
import { useAddress } from "../../../context/AddressContext";
import { useCurrentLocation } from "../../maps/useCurrentLocation";

const AddAddress = () => {
    const navigate = useNavigate();
    const { saveAddress } = useAddress();
    const { location, loading } = useCurrentLocation();

    const handleSelect = async ({ address, latitude, longitude }) => {
        await saveAddress({
            label: "new",
            latitude,
            longitude,
            formattedAddress: address.formattedAddress,
            fullAddress: address,
            coordinates: { type: "Point", coordinates: [longitude, latitude] },
        });

        navigate("/address-page");
    };

    if (loading || !location) return <p>Getting your location...</p>;

    return (
        <div>
            <MapPicker
                initialCenter={location}
                onSelect={handleSelect}
                onCancel={() => navigate("/address-page")}
                showSave={true}
            />
        </div>
    );
};

export default AddAddress;