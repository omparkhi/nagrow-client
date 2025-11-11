    import React, { useEffect, useState } from "react";
    import {Marker, DirectionsRenderer } from "@react-google-maps/api";
    import { toast } from "react-toastify";
    import { useMapLoader  } from "./useMapLoader";
    import MapContainer from "./MapContainer";

    const DeliveryRouteMap = ({ restaurantLocation, deliveryLocation, riderLocation }) => {
      const { isLoaded, loadError } = useMapLoader();
      const [directions, setDirections] = useState(null);

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
            <div className="w-full mt-3 mb-3" style={{ height: 400 }}>
              <MapContainer center={center}>
                {directions && (
                  <DirectionsRenderer
                    directions={directions.result}
                    routeIndex={directions.routeIndex}
                  />
                )}
                <Marker position={restaurantLocation} label="R" />
                <Marker position={deliveryLocation} label="D" />
                {riderLocation && <Marker position={riderLocation} label="🛵" />}
              </MapContainer>
            </div>
        );
    };

    export default DeliveryRouteMap;