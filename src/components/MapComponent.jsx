import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// värit 
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
  showRoute,    
}) => {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const layersRef   = useRef(null);

  // kartta luodaan vain kerran
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    const map = L.map(mapRef.current).setView([60.1699, 24.9384], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    layersRef.current = L.layerGroup().addTo(map);
    mapInstance.current = map;
  }, []);

  // kartta keskitetään valitun paikan ympärille
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !category) return;

    // postamisen jälkeen kartta ei keskity
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    fetch(`http://localhost:3000/places/${category}`)
      .then(r => r.json())
      .then(data => {
        setPlaces(data);

        data.forEach(place => {
          // jos route on näkyvissä, ei piirretä paikkoja
          if (showRoute && selectedPlace && place.id !== selectedPlace.id) {
            return;
          }

          const m = L.marker([place.latitude, place.longitude])
            .addTo(map)
            .bindPopup(place.name);
          m.on("click", () => setSelectedPlace(place));
          markersRef.current.push(m);
        });

        // если что-то выбрано — открываем его попап
        if (selectedPlace) {
          const found = markersRef.current.find(
            m => m.getPopup().getContent() === selectedPlace.name
          );
          if (found) found.openPopup();
        }
      })
      .catch(err => console.error("Ошибка загрузки мест:", err));
  }, [category, selectedPlace, showRoute, setPlaces, setSelectedPlace]);

  // route
  useEffect(() => {
    const map = mapInstance.current;
    const group = layersRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (routeLegs?.length > 0) {
      routeLegs.forEach((leg, i) => {
        const coords    = leg.geometry.coordinates;
        const baseColor = modeColors[leg.mode] || "#333";
        const opts      = leg.mode === "WALK"
          ? { color: baseColor, weight: 4, dashArray: "8,8" }
          : { color: baseColor, weight: 4 };

        L.polyline(coords, opts).addTo(group);

        // missä on reitti, siellä on myös marker
        if (i > 0 && routeLegs[i - 1].mode !== leg.mode && coords.length) {
          const [lat, lng] = coords[0];
          L.circleMarker([lat, lng], {
            radius:      6,
            fillColor:   baseColor,
            color:       "#fff",
            weight:      2,
            opacity:     1,
            fillOpacity: 1,
          }).addTo(group);
        }
      });

      const all = routeLegs.flatMap(l => l.geometry.coordinates);
      map.fitBounds(L.latLngBounds(all), { padding: [20, 20] });

    } else if (routeCoordinates?.length > 0) {
      const poly = L.polyline(routeCoordinates, {
        color: modeColors.BUS,
        weight: 4,
      });
      group.addLayer(poly);
      map.fitBounds(poly.getBounds(), { padding: [20, 20] });
    }
  }, [routeLegs, routeCoordinates]);

  return <div id="map" ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
};

export default MapComponent;
