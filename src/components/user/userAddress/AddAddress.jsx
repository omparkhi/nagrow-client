import React, { useState } from "react";
import MapPicker from "../../maps/MapPicker";
import { useNavigate, useLocation } from "react-router-dom";
import { useAddress } from "../../../context/AddressContext";

const AddAddress = () => {
    const { state } = useLocation();
    const existing = state?.address;
    const [label, setLabel] = useState(existing?.label || "");
   
    const navigate = useNavigate();
    const { saveAddress } = useAddress();

    const handleSave = async ({ address, latitude, longitude }) => {
        const payload = {
            addressId: address?._id,
            label,
            latitude,
            longitude,
            fullAddress: address?.fullAddress,
        }
        await saveAddress(payload);
        navigate(-1);
    };

    return (
        <div>
            <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (Home, Work...)"
            className="w-full border px-3 py-2 rounded mb-2"
          />
            <MapPicker onSelect={handleSave} />
        </div>
    )
    
}

export default AddAddress;