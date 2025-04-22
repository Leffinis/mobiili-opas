import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

const Header = () => {
  const { t } = useContext(LanguageContext);
  return (
    <header>
      <h2>{t.welcome}</h2>
      <p>{t.description}</p>
    </header>
  );
};

export default Header;