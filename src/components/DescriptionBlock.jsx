// src/components/DescriptionBlock.jsx
import React from 'react';

const DescriptionBlock = ({ selectedPlace }) => {
  if (!selectedPlace) return null;

  return (
    <div id="descriptionblock">
      <h4>{selectedPlace.name}</h4>
      {selectedPlace.image_url && (
        <img
          src={selectedPlace.image_url}
          alt={selectedPlace.name}
          style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }}
        />
      )}
      <p>{selectedPlace.description}</p>
    </div>
  );
};

export default DescriptionBlock;
