import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import RouteButton from "./RouteButton";
import RouteDetails from "./RouteDetails";

const PlaceDescription = ({
  place,
  setRouteCoordinates,
  setRouteLegs,
  routeLegs,
}) => {
  const { t } = useContext(LanguageContext);

  if (!place) {
    return (
      <div className="place-description">
        <h2>{t.placedescription_1}</h2>
        <p>{t.placedescription_2}</p>
      </div>
    );
  }

  return (
    <div className="place-description">
      <h2>{place.name}</h2>
      {place.image_url && (
        <img
          src={place.image_url}
          alt={place.name}
          className="place-image"
        />
      )}
      <p className="place-text">{place.description}</p>

      <RouteButton
        place={place}
        setRouteCoordinates={setRouteCoordinates}
        setRouteLegs={setRouteLegs}
      />

      {routeLegs && routeLegs.length > 0 && (
        <RouteDetails legs={routeLegs} />
      )}
    </div>
  );
};

export default PlaceDescription;
