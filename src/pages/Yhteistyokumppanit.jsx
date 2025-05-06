import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Yhteistyokumppanit = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="tietoa-page">
      <h2>Yhteistyökumppanimme</h2>
      <p>
        Tärkeät yhteistyökumppanit
      </p>
      <p>
        Tilaa yhteistyökumppaneiden mainoksille.
      </p>
    </div>
  );
};

export default Yhteistyokumppanit;
