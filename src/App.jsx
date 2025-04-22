import React, { useState, useContext } from "react";
import MapComponent from "./components/MapComponent";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BurgerMenu from "./components/BurgerMenu";
import { LanguageContext } from "./components/LanguageContext"; // Используем LanguageContext
import "leaflet/dist/leaflet.css";

import "./App.css";

function App() {
  const [category, setCategory] = useState("sightseeing");
  const [places, setPlaces] = useState([]);
  const { lang, setLang, t } = useContext(LanguageContext); // Получаем язык и функцию для его изменения из контекста

  // Функция для обработки изменения языка
  const handleLanguageChange = (event) => {
    setLang(event.target.value); // Обновляем язык в контексте
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/html/images/Flag_of_Helsinki.webp" alt="Helsingin vaakuna" />
          <span className="nav-title">Mobiili matkaopas</span>
        </a>
        <div className="nav-right">
          <div className="language-selector">
            <select id="language-select" value={lang} onChange={handleLanguageChange}>
              <option value="fi">Suomi</option>
              <option value="en">English</option>
              <option value="sv">Svenska</option>
              <option value="uk">Українська</option>
              <option value="ru">Русский</option>
            </select>
          </div>
          <BurgerMenu />
        </div>
      </nav>

      <Header />

      <main id="content">
        <div id="map-container">
          <MapComponent category={category} setPlaces={setPlaces} />
        </div>
        <Sidebar category={category} setCategory={setCategory} places={places} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
