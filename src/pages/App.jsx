import React, { useState, useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import MapComponent from "../components/MapComponent";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BurgerMenu from "../components/BurgerMenu";
import { LanguageContext } from "../components/LanguageContext";
import "leaflet/dist/leaflet.css";
import "../App.css";
import PlaceDescription from "../components/PlaceDescription";

// PAGES
import Tietoa from "/src/pages/Tietoa.jsx";
import Yhteistyokumppanit from "/src/pages/Yhteistyokumppanit.jsx";
import Yhteystiedot from "/src/pages/Yhteystiedot.jsx";
import Yrityksille from "/src/pages/Yrityksille.jsx";
import LoginPage from "/src/pages/LoginPage.jsx";

function App() {
  // состояния для маршрута
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeLegs, setRouteLegs] = useState([]);

  const [category, setCategory] = useState("sightseeing");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { lang, setLang, t } = useContext(LanguageContext);
  const location = useLocation();

  // при смене категории или выбранного места сбрасываем маршрут
  useEffect(() => {
    setRouteCoordinates([]);
    setRouteLegs([]);
  }, [category, selectedPlace]);

  const handleLanguageChange = (event) => {
    setLang(event.target.value);
  };

  return (
    <div className="app-wrapper">
      <nav className="navbar">
        <a href="/" className="nav-logo">
          <img src="/src/images/Flag_of_Helsinki.webp" alt="Helsingin vaakuna" />
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
        </div>
      </nav>

      {/* Header отображается только на главной */}
      {!["/tietoa", "/yhteistyokumppanit", "/yhteystiedot", "/yrityksille", "/kirjaudu"].includes(location.pathname) && (
        <Header />
      )}

      <main id="content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div id="map-container">
                  <MapComponent
                    category={category}
                    setPlaces={setPlaces}
                    selectedPlace={selectedPlace}
                    setSelectedPlace={setSelectedPlace}
                    routeCoordinates={routeCoordinates}
                    routeLegs={routeLegs}
                  />
                </div>
                <PlaceDescription
                  place={selectedPlace}
                  setRouteCoordinates={setRouteCoordinates}
                  setRouteLegs={setRouteLegs}
                  routeLegs={routeLegs}
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
        </Routes>
      </main>

      <BurgerMenu />
      <Footer />
    </div>
  );
}

export default App;
