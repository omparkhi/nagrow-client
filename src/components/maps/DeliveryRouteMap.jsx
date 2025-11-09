import React, { useEffect, useState } from "react";
import {GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { toast } from "react-toastify";

const containerStyle = { width: "100%", height: "400px" };
const libraries = ["places"];

const DeliveryRouteMap = ({ restaurantLocation, deliveryLocation, riderLocation }) => {
    const [directions, setDirections] = useState(null);

    const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ✅ your env key
    libraries,
  });

  const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
//   mapId: "YOUR_CUSTOM_MAP_ID", // Create from Google Cloud console
   styles: [
    // Hide all icons
    { featureType: "poi.business", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },

    // General label styling
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b6b6b" }]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#000000ff" }, { weight: 2 }]
    },

    // Administrative areas
    {
      featureType: "administrative",
      elementType: "geometry.fill",
      stylers: [{ color: "#fefefe" }]
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#bbb9b9ff" }]
    },

    // Landscape
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f8f8f8" }]
    },

    // Buildings (3D structures)
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#f2f2f2" }]
    },

    // Roads
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#000000ff" }]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#fdfdfd" }]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f6f6f6" }]
    },
    {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [{ color: "#000000ff" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#bbb9b9ff" }]
    },

    // Water
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#6cb8f7ff" }]
    }
  ],
};


    useEffect(() => {
        if (!isLoaded || !restaurantLocation || !deliveryLocation) return;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: restaurantLocation,
                destination: deliveryLocation,
                travelMode: window.google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    const shortestRoute = result.routes.reduce((bestIndex, route, i, arr) => 
                        route.legs[0].distance.value <
                        arr[bestIndex].legs[0].distance.value
                        ? i
                        : bestIndex,
                        0
                    );
                    setDirections({ result, routeIndex: shortestRoute });
                } else {
                    toast.error("Failed to get route: " + status);
                }
            }
        );
    }, [isLoaded, restaurantLocation, deliveryLocation]);

    const center = riderLocation || restaurantLocation;

    if (loadError) return <p>Map failed to load</p>;
if (!isLoaded || !window.google) return <p>Loading map...</p>;


    return (
        <div className="w-full mt-3 mb-3">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14} options={mapOptions}>
                {directions && <DirectionsRenderer directions={directions.result} routeIndex={directions.routeIndex}  />}
                <Marker position={restaurantLocation} label="R" />
                <Marker position={deliveryLocation} label="D" />
                {riderLocation && <Marker position={riderLocation} label="🛵" />}
            </GoogleMap>

        </div>
    )
}

export default DeliveryRouteMap;