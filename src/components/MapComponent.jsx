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
  const markersRef = useRef([]);
  const layersRef = useRef(null); // для маршрутов и точек

  // 1) Инициализация карты
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const map = L.map(mapRef.current).setView([60.1699, 24.9384], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // группа для полилиний и transfer-поинтов
    layersRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;
  }, []);

  // 2) Маркеры мест
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !category) return;

    // сброс старых
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    fetch(`http://localhost:3000/places/${category}`)
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        data.forEach(place => {
          const m = L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup(place.name);
          m.on("click", () => setSelectedPlace(place));
          markersRef.current.push(m);
        });
        // открыть попап выбранного
        if (selectedPlace) {
          const found = markersRef.current.find(
            m => m.getPopup().getContent() === selectedPlace.name
          );
          if (found) found.openPopup();
        }
      })
      .catch(err => console.error("Ошибка загрузки мест:", err));
  }, [category, selectedPlace]);

  // 3) Отрисовка маршрута + точек пересадки
  useEffect(() => {
    const map = mapInstance.current;
    const group = layersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (Array.isArray(routeLegs) && routeLegs.length > 0) {
      // поля для точек
      const dotStyle = {
        radius: 5,
        fillColor: "#fff",
        color: "#333",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      };

      // рисуем каждый leg своей линией
      const colors = ["red", "green", "blue", "orange", "purple"];
      routeLegs.forEach((leg, i) => {
        // полилиния
        const line = L.polyline(leg.geometry.coordinates, {
          color: colors[i % colors.length],
          weight: 4,
        }).addTo(group);

        // если это пересадка (не первая leg и смена вида транспорта) — ставим точку
        if (
          i > 0 &&
          routeLegs[i - 1].mode !== leg.mode &&
          leg.geometry.coordinates.length
        ) {
          const [lat, lng] = leg.geometry.coordinates[0];
          L.circleMarker([lat, lng], dotStyle).addTo(group);
        }
      });

      // подгоняем вид под всё сразу
      const all = routeLegs.flatMap(l => l.geometry.coordinates);
      map.fitBounds(L.latLngBounds(all), { padding: [20, 20] });

    } else if (Array.isArray(routeCoordinates) && routeCoordinates.length) {
      const poly = L.polyline(routeCoordinates, { color: "blue", weight: 4 });
      group.addLayer(poly);
      map.fitBounds(poly.getBounds(), { padding: [20, 20] });
    }
  }, [routeLegs, routeCoordinates]);

  return (
    <div
      id="map"
      ref={mapRef}
      style={{ height: "100vh", width: "100%" }}
    />
  );
};

export default MapComponent;
