import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({
  category,
  setPlaces,
  selectedPlace,
  setSelectedPlace,
  routeCoordinates
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);
  const routeLayer = useRef(null); // для линии маршрута

  // Инициализация карты
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([60.1699, 24.9384], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);
  }, []);

  // Загрузка мест по категории
  useEffect(() => {
    if (!mapInstance.current || !category) return;

    fetch(`http://localhost:3000/places/${category}`)
      .then((res) => res.json())
      .then((data) => {
        // Очистка старых маркеров
        markers.current.forEach((marker) => {
          if (marker instanceof L.Marker) {
            marker.remove();
          }
        });
        markers.current = [];

        setPlaces(data);

        // Добавление новых маркеров
        data.forEach((place) => {
          const marker = L.marker([place.latitude, place.longitude])
            .addTo(mapInstance.current)
            .bindPopup(place.name);

          marker.on("click", () => {
            setSelectedPlace(place);
          });

          markers.current.push(marker);
        });

        // Попап и центрирование выбранного места
        if (selectedPlace) {
          const placeMarker = markers.current.find(
            (marker) => marker.getPopup().getContent() === selectedPlace.name
          );
          if (placeMarker) {
            placeMarker.openPopup();
          }
        }
      })
      .catch((err) => console.error("Ошибка загрузки мест:", err));
  }, [category, selectedPlace]);

  // Отображение маршрута
  useEffect(() => {
    if (!mapInstance.current) return;

    // Удалить старый маршрут, если был
    if (routeLayer.current) {
      mapInstance.current.removeLayer(routeLayer.current);
      routeLayer.current = null;
    }

    if (routeCoordinates && routeCoordinates.length > 0) {
      routeLayer.current = L.polyline(routeCoordinates, {
        color: "blue",
        weight: 4,
      }).addTo(mapInstance.current);

      mapInstance.current.fitBounds(routeLayer.current.getBounds());
    }
  }, [routeCoordinates]);

  return <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default MapComponent;
