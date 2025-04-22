import React, { useState, useEffect, useRef } from "react";

const BurgerMenu = () => {
  const [active, setActive] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Закрытие при клике вне меню
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
        <span className="close-menu" onClick={() => setActive(false)}>X</span>
        <ul>
          <li><a href="/">Koti</a></li>
          <li><a href="/html/auth/login.html">Kirjaudu</a></li>
          <li><a href="/html/about/tietoa.html">Tietoa</a></li>
          <li><a href="/html/about/yhteystiedot.html">Yhteystiedot</a></li>
          <li><a href="/html/about/yrityksille.html">Yrityksille</a></li>
          <li><a href="/html/about/yhteistyokumppanit.html">Yhteistyökumppanit</a></li>
        </ul>
      </div>
    </>
  );
};

export default BurgerMenu;
