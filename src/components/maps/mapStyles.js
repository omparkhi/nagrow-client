export const defaultMapStyles  = [
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
  ];