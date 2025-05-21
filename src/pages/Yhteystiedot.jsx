import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Yhteystiedot = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="tietoa-page">
      <h2>{t.yhteystiedot_1}</h2>
      <h3>
          {t.yhteystiedot_2}
      </h3>
        <h5>geobrosinternational@gmail.com</h5>
        <h5>Instagram:</h5>
        <a href="https://www.instagram.com/geobrosinternational/" target="_blank">
        <img src="/src/images/logo.png" alt="logo" style={{ width: '80px', height:'80px', borderRadius: '40px'}}/>
        </a>
        <p style={{ textAlign: 'center' }}>{t.yhteystiedot_3}</p>



    </div>
  );
};

export default Yhteystiedot;
