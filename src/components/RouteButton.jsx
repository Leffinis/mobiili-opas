import React from "react";

const RouteButton = ({ place, setRouteCoordinates }) => {
  const handleRouteClick = () => {
    if (!navigator.geolocation) {
      alert("Selaimesi ei tue geopaikannusta.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const destLat = place.latitude;
      const destLng = place.longitude;

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/walking/${userLng},${userLat};${destLng},${destLat}?overview=full&geometries=geojson`
      );

      const data = await response.json();
      if (data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setRouteCoordinates(coordinates);
      }
    });
  };

  return (
    <button onClick={handleRouteClick} className="route-button">
      Näytä reitti
    </button>
  );
};

export default RouteButton;
