import React, { useState, useContext } from "react";
import MapComponent from "../components/MapComponent";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BurgerMenu from "../components/BurgerMenu";
import { LanguageContext } from "../components/LanguageContext";

function HomePage() {
  const [category, setCategory] = useState("sightseeing");
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { lang, setLang } = useContext(LanguageContext);

  return (
    <>
      <Header />
      <main id="content">
        <div id="map-container">
          <MapComponent
            category={category}
            setPlaces={setPlaces}
            selectedPlace={selectedPlace}
          />
        </div>
        <Sidebar
          category={category}
          setCategory={setCategory}
          places={places}
          setSelectedPlace={setSelectedPlace}
        />
      </main>
      <BurgerMenu />
      <Footer />
    </>
  );
}

export default HomePage;