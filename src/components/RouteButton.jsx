import React from "react";

const RouteButton = ({ place, setRouteCoordinates, setRouteLegs }) => {
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

        const response = await fetch("http://localhost:3000/api/route", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromLat: userLat,
            fromLng: userLng,
            toLat:   destLat,
            toLng:   destLng,
          }),
        });

        if (!response.ok) {
          throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }

        const itineraries = await response.json();
        if (!itineraries.length || !itineraries[0].legs.length) {
          alert("Маршрут не найден.");
          return;
        }

        const legs = itineraries[0].legs;
        // 1) передаем клиенту массив полилиний для карты
        setRouteCoordinates(legs.map((leg) => leg.geometry.coordinates));
        // 2) передаем клиенту детали каждой leg для разметки списка
        setRouteLegs(legs);
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
