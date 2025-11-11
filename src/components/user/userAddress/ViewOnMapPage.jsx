import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapPicker from "../../maps/MapPicker";
import { useAddress } from "../../../context/AddressContext";

const ViewOnMapPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { updateAddress } = useAddress();

    if(!state?.address) {
        navigate("/address-page");
        return null;
    }

    const { address, addressId } = state;

    const center = {
        lat: address.coordinates?.coordinates[1],
        lng: address.coordinates?.coordinates[0],
    }

    const handleSelect = async({ address: newAddr, latitude, longitude }) => {
    await updateAddress(addressId, {
      formattedAddress: newAddr,
      coordinates: { type: "Point", coordinates: [longitude, latitude] },
    });
    navigate("/address-page");
  };

 return (
    <MapPicker
      initialCenter={center}
      onSelect={handleSelect}
      onCancel={() => navigate("/address-page")}
      showSave={true}
    />
  );
};

export default ViewOnMapPage;