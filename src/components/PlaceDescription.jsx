import React from "react";

const PlaceDescription = ({ place }) => {
  if (!place) {
    return (
      <div className="place-description">
        <h2>Valitse paikka kartalta tai sivupalkista</h2>
        <p>Tietoja valitusta paikasta näkyvät tässä.</p>
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
