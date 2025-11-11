    import React from "react";
    import { useNavigate } from "react-router-dom";
    import { useAddress } from "../../../context/AddressContext";
    import { useCurrentLocation } from "../../maps/useCurrentLocation";
    import MapPicker from "../../maps/MapPicker";

    const CurrentLocationPage = () => {
        const navigate = useNavigate();
        const { saveAddress } = useAddress();
        const {location, loading} = useCurrentLocation();

        if (loading || !location) return <p>Detecting location...</p>;

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
    <MapPicker
      initialCenter={location}
      onSelect={handleSelect}
      onCancel={() => navigate("/address-page")}
      showSave={true}
    />
  );
    };

    export default CurrentLocationPage;