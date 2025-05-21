import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Yhteistyokumppanit = () => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="tietoa-page">
      <h2>{t.yhteistyokumppanit_1}</h2>
      <p>{t.yhteistyokumppanit_2}</p>
    </div>
  );
};

export default Yhteistyokumppanit;
