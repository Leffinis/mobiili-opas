import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";

const Sidebar = ({ category, setCategory, places, setSelectedPlace }) => {
  const { t } = useContext(LanguageContext);

  return (
    <div id="category-container">
      <h3>{t.selectCategory}</h3>
      <select
        id="category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled hidden>{t.selectCategory}</option>
        <option value="sightseeing">{t.sightseeing}</option>
        <option value="restaurants">{t.restaurants}</option>
        <option value="parks">{t.parks}</option>
      </select>
      <div id="places-list">
        {places.map((place, idx) => (
          <div
            key={idx}
            className="place-item"
            onClick={() => setSelectedPlace(place)} // 👈 устанавливаем выбранное место
            style={{ cursor: "pointer" }} // 👈 визуально понятно, что кликабельно
          >
            {place.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
