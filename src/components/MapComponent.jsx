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
  const layersRef = useRef(null);

  // 1) Инициализация карты
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;

    const map = L.map(mapRef.current).setView([60.1699, 24.9384], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    layersRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;
  }, []);

  // 2) Маркеры мест
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !category) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    fetch(`http://localhost:3000/places/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data);
        data.forEach((place) => {
          const m = L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup(place.name);
          m.on("click", () => setSelectedPlace(place));
          markersRef.current.push(m);
        });
        if (selectedPlace) {
          const found = markersRef.current.find(
            (m) => m.getPopup().getContent() === selectedPlace.name
          );
          if (found) found.openPopup();
        }
      })
      .catch((err) => console.error("Ошибка загрузки мест:", err));
  }, [category, selectedPlace, setPlaces, setSelectedPlace]);

  // 3) Отрисовка маршрута + точек пересадки, с пунктиром для WALK
  useEffect(() => {
    const map = mapInstance.current;
    const group = layersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (Array.isArray(routeLegs) && routeLegs.length > 0) {
      const dotStyle = {
        radius: 5,
        fillColor: "#fff",
        color: "#333",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      };
      const colors = ["#e30000", "#005bbb", "#00994d", "#ffa500", "#800080"]; // пример набор

      routeLegs.forEach((leg, i) => {
        // Собираем coords, стыкуем с предыдущим leg, как раньше
        let coords = leg.geometry.coordinates;
        if (i > 0) {
          const prev = routeLegs[i - 1].geometry.coordinates;
          const lastPrev = prev[prev.length - 1];
          if (
            coords.length === 0 ||
            coords[0][0] !== lastPrev[0] ||
            coords[0][1] !== lastPrev[1]
          ) {
            coords = [lastPrev, ...coords];
          }
        }

        // Опции линии: пунктир и серый для WALK, цвет для остальных
        const isWalk = leg.mode === "WALK";
        const lineOpts = isWalk
          ? {
              color: "#393E46",
              weight: 4,
              dashArray: "8,8",
            }
          : {
              color: colors[i % colors.length],
              weight: 4,
            };

        L.polyline(coords, lineOpts).addTo(group);

        // Точка пересадки при смене транспорта
        if (
          i > 0 &&
          routeLegs[i - 1].mode !== leg.mode &&
          coords.length
        ) {
          const [lat, lng] = coords[0];
          L.circleMarker([lat, lng], dotStyle).addTo(group);
        }
      });

      const allCoords = routeLegs.flatMap((l) => l.geometry.coordinates);
      map.fitBounds(L.latLngBounds(allCoords), { padding: [20, 20] });
    } else if (Array.isArray(routeCoordinates) && routeCoordinates.length) {
      const poly = L.polyline(routeCoordinates, {
        color: "blue",
        weight: 4,
      });
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
