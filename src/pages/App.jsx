// src/pages/App.jsx

import React, { useState, useContext, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import PlaceDescription from "../components/PlaceDescription";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BurgerMenu from "../components/BurgerMenu";
import { LanguageContext } from "../components/LanguageContext";
import "leaflet/dist/leaflet.css";
import "../App.css";

// PAGES
import Tietoa from "./Tietoa";
import Yhteistyokumppanit from "./Yhteistyokumppanit";
import Yhteystiedot from "./Yhteystiedot";
import Yrityksille from "./Yrityksille";
import LoginPage from "./LoginPage";
import Omatsivut from "./omatsivut";

function App() {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeLegs, setRouteLegs] = useState([]);

  const [category, setCategory] = useState("sightseeing");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [showRoute, setShowRoute] = useState(false);

  const { lang, setLang } = useContext(LanguageContext);
  const location = useLocation();

  useEffect(() => {
    setRouteCoordinates([]);
    setRouteLegs([]);
    setShowRoute(false);
  }, [category, selectedPlace]);

  const handleShowRoute = useCallback(() => {
    setShowRoute(true);
  }, []);

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/src/images/Flag_of_Helsinki.webp" alt="Logo" />
          <span className="nav-title">Mobiili matkaopas</span>
        </a>
        <div className="nav-right">
          <select value={lang} onChange={handleLanguageChange}>
            <option value="fi">Suomi</option>
            <option value="en">English</option>
            <option value="sv">Svenska</option>
            <option value="uk">Українська</option>
            <option value="ru">Русский</option>
          </select>
          <BurgerMenu />
        </div>
      </nav>

      {!["/tietoa", "/yhteistyokumppanit", "/yhteystiedot", "/yrityksille", "/kirjaudu"].includes(location.pathname) && (
        <Header />
      )}

      <main id="content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MapComponent
                  category={category}
                  setPlaces={setPlaces}
                  selectedPlace={selectedPlace}
                  setSelectedPlace={setSelectedPlace}
                  routeCoordinates={routeCoordinates}
                  routeLegs={routeLegs}
                  showRoute={showRoute}
                />

                <PlaceDescription
                  place={selectedPlace}
                  setRouteCoordinates={setRouteCoordinates}
                  setRouteLegs={setRouteLegs}
                  routeLegs={routeLegs}
                  onShowRoute={handleShowRoute}
                />

                <Sidebar
                  category={category}
                  setCategory={setCategory}
                  places={places}
                  setSelectedPlace={setSelectedPlace}
                />
              </>
            }
          />
          <Route path="/tietoa" element={<Tietoa />} />
          <Route path="/yhteistyokumppanit" element={<Yhteistyokumppanit />} />
          <Route path="/yhteystiedot" element={<Yhteystiedot />} />
          <Route path="/yrityksille" element={<Yrityksille />} />
          <Route path="/kirjaudu" element={<LoginPage />} />
          <Route path="/omatsivut" element={<Omatsivut />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
