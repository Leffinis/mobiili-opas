import React from "react";

const RouteButton = ({ place, setRouteCoordinates }) => {
  const handleRouteClick = () => {
    if (!navigator.geolocation) {
      alert("Ваш браузер не поддерживает геолокацию.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const destLat = place.latitude;
        const destLng = place.longitude;

        // Вызываем ваш серверный прокси, а не Digitransit напрямую
        const response = await fetch("http://localhost:3000/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromLat: userLat, fromLng: userLng, toLat: destLat, toLng: destLng })
        });

        if (!response.ok) {
          throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        const itineraries = await response.json();
        if (!itineraries.length || !itineraries[0].legs.length) {
          alert("Маршрут не найден.");
          return;
        }

        // Преобразуем [lon, lat] → [lat, lon] и объединяем все сегменты
        const coords = itineraries[0].legs.flatMap(leg =>
          leg.geometry.coordinates.map(([lng, lat]) => [lat, lng])
        );
        setRouteCoordinates(coords);
      } catch (error) {
        console.error("Ошибка при получении маршрута:", error);
        alert("Не удалось загрузить маршрут.");
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
