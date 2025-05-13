import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({
  category,
  setPlaces,
  selectedPlace,
  setSelectedPlace,
  routeCoordinates,
  routeLegs,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);
  const routeLayers = useRef([]);

  // Инициализация карты
  useEffect(() => {
    const container = mapRef.current;
    if (!container) return;
    // Предотвращаем повторную инициализацию
    if (mapInstance.current) return;

    mapInstance.current = L.map(container).setView([60.1699, 24.9384], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    return () => {
      // Удаляем карту при размонтировании
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, []);

  // Загрузка мест по категории
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !category) return;

    fetch(`http://localhost:3000/places/${category}`)
      .then((res) => res.json())
      .then((data) => {
        // Удаляем старые маркеры
        markers.current.forEach((m) => map.removeLayer(m));
        markers.current = [];
        setPlaces(data);

        data.forEach((place) => {
          const m = L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup(place.name);
          m.on("click", () => setSelectedPlace(place));
          markers.current.push(m);
        });

        // Открываем попап выбранного места
        if (selectedPlace) {
          const sel = markers.current.find(
            (m) => m.getPopup().getContent() === selectedPlace.name
          );
          if (sel) sel.openPopup();
        }
      })
      .catch((e) => console.error("Ошибка загрузки мест:", e));
  }, [category, selectedPlace]);

  // Отображение маршрута с разными линиями
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Удаляем предыдущие слои маршрута
    routeLayers.current.forEach((layer) => map.removeLayer(layer));
    routeLayers.current = [];

    // Выбираем legs, если есть; иначе единая линия
    const legs =
      routeLegs && routeLegs.length
        ? routeLegs
        : routeCoordinates && routeCoordinates.length
        ? [{ geometry: { coordinates: routeCoordinates } }]
        : [];

    if (legs.length) {
      const colors = ["red", "green", "blue", "orange", "purple"];
      legs.forEach((leg, idx) => {
        const coords = leg.geometry.coordinates;
        const poly = L.polyline(coords, {
          color: colors[idx % colors.length],
          weight: 4,
        }).addTo(map);
        routeLayers.current.push(poly);
      });
      // Подгонка карты по всем точкам маршрута
      const allCoords = legs.flatMap((leg) => leg.geometry.coordinates);
      map.fitBounds(L.polyline(allCoords).getBounds());
    }
  }, [routeCoordinates, routeLegs]);

  return <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default MapComponent;
