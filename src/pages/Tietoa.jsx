import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Tietoa = () => {
  const { t } = useContext(LanguageContext);
  return (

    <div className="tietoa-page">
        <h2>{t.Tietoa_meista}</h2>
        
        <p>{t.tietoa_tervetuloa}</p>
        <p>{t.tietoa_kakskaveri}</p>
        <p>{t.tietoa_3}</p>
        <p>{t.tietoa_4}</p>
{/*         <p>{t.tietoa_5}</p>
        <p>{t.tietoa_6}</p>
        <p>{t.tietoa_7}</p> */}
        <p>{t.tietoa_8}</p>
        </div>
  );
};

export default Tietoa;
