import React, { useEffect, useRef } from "react";
import L from "leaflet";

const MapComponent = ({ category, setPlaces, selectedPlace, setSelectedPlace }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    
    if (!mapRef.current || mapInstance.current) return;

    // initializing the map
    mapInstance.current = L.map(mapRef.current).setView([60.1699, 24.9384], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);
  }, []); // only run once when the component mounts

  useEffect(() => {
    if (!mapInstance.current || !category) return;

    // fetch to get places based on the selected category
    fetch(`http://localhost:3000/places/${category}`)
      .then((res) => res.json())
      .then((data) => {
        // remove old markers
        markers.current.forEach((marker) => {
          if (marker instanceof L.Marker) {
            marker.remove(); // remove
          }
        });
        markers.current = []; // clear the array
        setPlaces(data);

        // add new markers
        data.forEach((place) => {
          const marker = L.marker([place.latitude, place.longitude])
            .addTo(mapInstance.current)
            .bindPopup(place.name);
        
          marker.on("click", () => {
            setSelectedPlace(place); // устанавливаем выбранное место при клике на маркер
          });
        
          markers.current.push(marker);
        });
        

        // if a place is selected, center the map on it and open its popup
        if (selectedPlace) {
          const placeMarker = markers.current.find(
            (marker) => marker.getPopup().getContent() === selectedPlace.name
          );
          if (placeMarker) {
            // center map on the selected place, but it not works good then i commented it
            /*mapInstance.current.setView(
              [placeMarker.getLatLng().lat, placeMarker.getLatLng().lng],
              10 // zoom in on the selected place
            );*/
            placeMarker.openPopup(); // open the popup of the selected place
          }
        }
      })
      .catch((err) => console.error("Error fetching places:", err));
  }, [category, selectedPlace]); // re-run when category or selectedPlace changes

  return <div id="map" ref={mapRef}  />;
};

export default MapComponent;
