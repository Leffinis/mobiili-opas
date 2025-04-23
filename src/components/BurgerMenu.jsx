import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // <--- ВАЖНО: импорт Link

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
          <li><Link to="/" onClick={() => setActive(false)}>Koti</Link></li>
          <li><Link to="/kirjaudu" onClick={() => setActive(false)}>Kirjaudu</Link></li>
          <li><Link to="/tietoa" onClick={() => setActive(false)}>Tietoa</Link></li>
          <li><Link to="/yhteystiedot" onClick={() => setActive(false)}>Yhteystiedot</Link></li>
          <li><Link to="/yrityksille" onClick={() => setActive(false)}>Yrityksille</Link></li>
          <li><Link to="/yhteistyokumppanit" onClick={() => setActive(false)}>Yhteistyökumppanit</Link></li>
        </ul>
      </div>
    </>
  );
};

export default BurgerMenu;
