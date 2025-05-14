import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import "./RouteButton.css";

const RouteButton = ({
  place,
  setRouteCoordinates,
  setRouteLegs,
  onShowRoute,    // колбэк из PlaceDescription → App
}) => {
  const { t } = useContext(LanguageContext);

  const handleRouteClick = () => {
    if (!place) {
      alert(t.route_origin);
      return;
    }
    if (!navigator.geolocation) {
      alert(t.geolocation_unsupported || "Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const fromLat = position.coords.latitude;
          const fromLng = position.coords.longitude;
          const toLat   = place.latitude;
          const toLng   = place.longitude;

          const res = await fetch("http://localhost:3000/api/route", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ fromLat, fromLng, toLat, toLng }),
          });
          if (!res.ok) throw new Error(res.statusText);

          const legs = await res.json();
          if (!Array.isArray(legs) || legs.length === 0) {
            alert(t.route_not_found);
            return;
          }

          setRouteCoordinates(legs.flatMap(l => l.geometry.coordinates));
          setRouteLegs(legs);
          onShowRoute();    // включаем режим «скрывать все маркеры, кроме выбранного»
        } catch (err) {
          console.error(err);
          alert(t.route_load_error);
        }
      },
      () => alert(t.geolocation_error)
    );
  };

  return (
    <button onClick={handleRouteClick} className="route-button">
      {t.route_button}
    </button>
  );
};

export default RouteButton;
