import React, { createContext, useState, useEffect } from "react";
import { translations } from "../translations.js";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem("selectedLanguage") || "fi");

  useEffect(() => {
    localStorage.setItem("selectedLanguage", lang);
  }, [lang]);

  const t = translations[lang] || translations.fi;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};