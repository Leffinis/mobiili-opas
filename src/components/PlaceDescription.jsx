import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const PlaceDescription = ({ place }) => {
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
          style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
        />
      )}
      <p>{place.description}</p>
    </div>
  );
};

export default PlaceDescription;
