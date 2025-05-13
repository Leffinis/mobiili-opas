import React, { useContext } from 'react'
import "./RouteButton.css"; // css import
import { LanguageContext } from "./LanguageContext";

const RouteButton = ({ place, setRouteCoordinates, setRouteLegs }) => {
  const { t } = useContext(LanguageContext);
  const handleRouteClick = () => {
    if (!place) {
      alert("Сначала выберите место.");
      return;
    }
    if (!navigator.geolocation) {
      alert("Ваш браузер не поддерживает геолокацию.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const destLat = place.latitude;
          const destLng = place.longitude;

          const response = await fetch("http://localhost:3000/api/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fromLat: userLat, fromLng: userLng, toLat: destLat, toLng: destLng }),
          });

          if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
          }

          // Наш прокси отдаёт просто массив legs
          const legs = await response.json();

          if (!Array.isArray(legs) || legs.length === 0) {
            alert("En voi löytää reittiä.");
            return;
          }

          // 1) координаты для карты
          setRouteCoordinates(legs.flatMap((leg) => leg.geometry.coordinates));
          // 2) детали для списка
          setRouteLegs(legs);
        } catch (err) {
          console.error("Virhe: ", err);
          alert("En voi ladata reittiä. Yritä uudelleen myöhemmin.");
        }
      },
      (error) => {
        console.error("Virhe: ", error);
        alert("Missä olet?");
      }
    );
  };

  return (
    <button onClick={handleRouteClick} className="route-button">
      {t.route_button}
    </button>
  );
};

export default RouteButton;
