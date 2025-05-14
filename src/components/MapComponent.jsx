import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const modeColors = {
  BUS:    "#005bbb",
  FERRY:  "#007f7f",
  RAIL:   "#9900cc",
  SUBWAY: "#c91e00",
  TRAM:   "#009944",
  WALK:   "#393E46",
};

const MapComponent = ({
  category,
  setPlaces,
  selectedPlace,
  setSelectedPlace,
  routeCoordinates,
  routeLegs,
}) => {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const layersRef   = useRef(null);

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

  // 2) Загрузка маркеров мест
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !category) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    fetch(`http://localhost:3000/places/${category}`)
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        data.forEach(place => {
          const marker = L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup(place.name);
          marker.on("click", () => setSelectedPlace(place));
          markersRef.current.push(marker);
        });

        if (selectedPlace) {
          const found = markersRef.current.find(
            m => m.getPopup().getContent() === selectedPlace.name
          );
          if (found) found.openPopup();
        }
      })
      .catch(err => console.error("Ошибка загрузки мест:", err));
  }, [category, selectedPlace, setPlaces, setSelectedPlace]);

  // 3) Отрисовка маршрута + точки пересадки, с разрывами между сегментами
  useEffect(() => {
    const map = mapInstance.current;
    const group = layersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (Array.isArray(routeLegs) && routeLegs.length > 0) {
      const dotStyle = {
        radius:      8,
        fillColor:   "#fff",
        color:       "#333",
        weight:      2,
        opacity:     1,
        fillOpacity: 1,
      };

      routeLegs.forEach((leg, i) => {
        // Используем только собственные координаты сегмента
        const coords = leg.geometry.coordinates;

        const isWalk   = leg.mode === "WALK";
        const baseColor = modeColors[leg.mode] || "#333333";
        const lineOpts = isWalk
          ? { color: baseColor, weight: 4, dashArray: "8,8" }
          : { color: baseColor, weight: 4 };

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

      const allCoords = routeLegs.flatMap(l => l.geometry.coordinates);
      map.fitBounds(L.latLngBounds(allCoords), { padding: [20, 20] });

    } else if (Array.isArray(routeCoordinates) && routeCoordinates.length) {
      const poly = L.polyline(routeCoordinates, {
        color: modeColors.BUS,
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
