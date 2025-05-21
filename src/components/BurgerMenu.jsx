import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom"; // <--- ВАЖНО: импорт Link
import { LanguageContext } from "./LanguageContext";
const BurgerMenu = () => {
  const [active, setActive] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { t } = useContext(LanguageContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div
        className={`ham-menu ${active ? "active" : ""}`}
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setActive(!active);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div
        className={`off-screen-menu ${active ? "active" : ""}`}
        ref={menuRef}
      >
        
        
        <ul>
          <li><Link to="/" onClick={() => setActive(false)}>{t.koti}</Link></li>
          <li><Link to="/kirjaudu" onClick={() => setActive(false)}>{t.kirjaudu}</Link></li>
          <li><Link to="/tietoa" onClick={() => setActive(false)}>{t.tietoa}</Link></li>
          <li><Link to="/yhteystiedot" onClick={() => setActive(false)}>{t.yhteystiedot}</Link></li>
          <li><Link to="/yrityksille" onClick={() => setActive(false)}>{t.yrityksille}</Link></li>
          <li><Link to="/yhteistyokumppanit" onClick={() => setActive(false)}>{t.yhteistyökumppanit}</Link></li>
          <li><Link to="/omatsivut" onClick={() => setActive(false)}>{t.omatsivusi || "Omatsivut"}</Link></li>
        </ul>
      </div>
    </>
  );
};

export default BurgerMenu;
