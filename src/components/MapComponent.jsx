import React, { useEffect, useRef } from "react";
import L from "leaflet";

const MapComponent = ({ category, setPlaces, selectedPlace }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    // Инициализация карты только один раз
    if (!mapRef.current || mapInstance.current) return;

    // Инициализируем карту
    mapInstance.current = L.map(mapRef.current).setView([60.1699, 24.9384], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);
  }, []); // Эффект выполняется только один раз

  useEffect(() => {
    if (!mapInstance.current || !category) return;

    // Запрос для получения мест по категории
    fetch(`http://localhost:3000/places/${category}`)
      .then((res) => res.json())
      .then((data) => {
        // Удаляем старые маркеры перед добавлением новых
        markers.current.forEach((marker) => {
          if (marker instanceof L.Marker) {
            marker.remove(); // Убедитесь, что это маркер
          }
        });
        markers.current = []; // Очистить массив маркеров
        setPlaces(data);

        // Добавляем новые маркеры
        data.forEach((place) => {
          const marker = L.marker([place.latitude, place.longitude])
            .addTo(mapInstance.current)
            .bindPopup(place.name);
          markers.current.push(marker); // Добавляем только маркеры
        });

        // Если был выбран маркер, центрируем карту на его месте
        if (selectedPlace) {
          const placeMarker = markers.current.find(
            (marker) => marker.getPopup().getContent() === selectedPlace.name
          );
          if (placeMarker) {
            mapInstance.current.setView(
              [placeMarker.getLatLng().lat, placeMarker.getLatLng().lng],
              15 // Увеличиваем зум при переходе к месту
            );
          }
        }
      })
      .catch((err) => console.error("Error fetching places:", err));
  }, [category, selectedPlace]); // Эффект срабатывает при изменении категории или выбранного места

  return <div id="map" ref={mapRef}  />;
};

export default MapComponent;
