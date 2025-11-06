export const reverseGeocode = async (lat, lng) => {
  if (!window.google) throw new Error("Google Maps API not loaded");

  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        resolve(results[0].formatted_address);
      } else {
        console.warn("Reverse geocode failed:", status);
        reject(new Error(`Geocode failed: ${status}`));
      }
    });
  });
};
