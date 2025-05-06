import React, { useContext } from 'react';
import { LanguageContext } from "/src/components/LanguageContext";

const Tietoa = () => {
  const { t } = useContext(LanguageContext);
  return (

    <div className="tietoa-page">
        <h1>{t.Tietoa_meistä}</h1>
        <p id="about4">Tervetuloa Helsingin mobiili matkaoppaaseen!</p>
        <p id="about5">Olemme kaksi kaverusta jotka halusivat luoda helpon ja kätevän tavan löytää kaupungin parhaat paikat.</p>
        <p id="about6">Meidän tavoitteemme on tehdä matkustamisesta Helsingissä mahdollisimman vaivatonta ja hauskaa.</p>
        <p id="about7">Olemme keränneet yhteen kaikki tärkeimmät tiedot, jotta voit keskittyä nauttimaan matkasta.</p>
        <p id="about8">Tämä mobiili matkaopas on suunniteltu auttamaan sinua löytämään Helsingin parhaat nähtävyydet, ravintolat ja aktiviteetit.</p>
        <p id="about9">Olemme sitoutuneet tarjoamaan ajankohtaista ja tarkkaa tietoa, jotta voit nauttia vierailustasi Helsingissä.</p>
        <p id="about10">Jos sinulla on kysymyksiä tai palautetta, älä epäröi ottaa meihin yhteyttä!</p>
        <p id="about11">Voit myös seurata meitä sosiaalisessa mediassa saadaksesi viimeisimmät päivitykset ja tarjoukset.</p>
    </div>
  );
};

export default Tietoa;
