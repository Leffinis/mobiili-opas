import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Yhteystiedot = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="tietoa-page">
      <h2>Yhteystietomme</h2>
      <h3>
            Ota yhteyttä rohkeasti!
      </h3>
        <h5>geobrosinternational@gmail.com</h5>
        <h5>Instagram:</h5>
        <a href="https://www.instagram.com/geobrosinternational/" target="_blank">
        <img src="/src/images/logo.png" alt="Helsingin vaakuna" width="80" height="80" />
        </a>
        <p>Mobiili matkaopas made by: Aliaksei "Leffinis" Mitsiushyn & Tuomas "Kapa" Niemi </p>

    </div>
  );
};

export default Yhteystiedot;
