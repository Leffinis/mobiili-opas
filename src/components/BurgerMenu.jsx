import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Импортируем Link

const BurgerMenu = () => {
  const [active, setActive] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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

  // Обработчик закрытия меню
  const closeMenu = () => setActive(false);

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
      <div className={`off-screen-menu ${active ? "active" : ""}`} ref={menuRef}>
        <span className="close-menu" onClick={closeMenu}>X</span>
        <ul>
          <li><Link to="/" onClick={closeMenu}>Koti</Link></li>
          <li><a href="/html/auth/login.html">Kirjaudu</a></li> {/* Можно оставить как есть, если это внешний HTML */}
          <li><Link to="/tietoa" onClick={closeMenu}>Tietoa</Link></li>
          <li><Link to="/yhteystiedot" onClick={closeMenu}>Yhteystiedot</Link></li>
          <li><Link to="/yrityksille" onClick={closeMenu}>Yrityksille</Link></li>
          <li><Link to="/yhteistyokumppanit" onClick={closeMenu}>Yhteistyökumppanit</Link></li>
        </ul>
      </div>
    </>
  );
};

export default BurgerMenu;
