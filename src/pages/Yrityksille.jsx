import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Yrityksille = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="tietoa-page">
      <h2>{t.yrityksille_1}</h2>
      <p>
        {t.yrityksille_2}
      </p>
      
        <h1>{t.yrityksille_3}</h1>
        <p>{t.yrityksille_4}</p>
        <p>{t.yrityksille_5}</p>
        <p>{t.yrityksille_6}</p>
        <p>{t.yrityksille_7}</p>
        <h4>geobrosinternational@gmail.com</h4>
        <p>{t.yrityksille_8}</p>
    

    </div>
  );
};

export default Yrityksille;
