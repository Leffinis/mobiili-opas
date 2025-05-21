// src/pages/Omasivut.jsx

import React, { useContext } from "react";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import LogoutButton from "../components/LogoutButton";
import CategoryBadge from "../components/CategoryBadge";
import { LanguageContext } from "../components/LanguageContext";

export default function Omasivut() {
  const {t} = useContext(LanguageContext);
  const {
    bookmarks,      
    loading,        
    removeBookmark, // fn(id) → DELETE /api/bookmarks/id 
  } = useUserBookmarks();


  const [places, setPlaces] = React.useState([]);
  const [placesLoading, setPlacesLoading] = React.useState(true);

  const token = localStorage.getItem("token");


  if (!token) {
    return (
      <div className="omasivut-message">
         {t.kirjauduensi}
      </div>
    );
  }


  React.useEffect(() => {
    if (loading) return;
    setPlacesLoading(true);

    Promise.all([
      fetch("http://localhost:3000/places/sightseeing").then(r => r.json()),
      fetch("http://localhost:3000/places/restaurants").then(r => r.json()),
      fetch("http://localhost:3000/places/parks").then(r => r.json()),
    ])
      .then(([sights, rests, parks]) => {
        const all = [
          ...sights.map(p => ({ ...p, category: "sightseeing" })),
          ...rests.map(p => ({ ...p, category: "restaurants" })),
          ...parks.map(p => ({ ...p, category: "parks" })),
        ];
        setPlaces(all.filter(p => bookmarks.includes(p.id)));
      })
      .catch(console.error)
      .finally(() => setPlacesLoading(false));
  }, [loading, bookmarks]);


  if (loading || placesLoading) {
    return (
      <div className="omasivut-message">
        Ladataan…
      </div>
    );
  }


  if (places.length === 0) {
    return (
      <>
        <LogoutButton />
        <div className="omasivut-container">
          <h2>{t.eisuosi}</h2>
          <p>
          {t.painakuva}
          </p>
        </div>
      </>
    );
  }


  return (
    <>
      <LogoutButton />
      <div className="omasivut-container">
        <h2>{t.suosikkipaikkasi}</h2>
        <ul className="bookmark-list">
          {places.map(place => (
            <li key={place.id} className="bookmark-item">
              <div className="bookmark-header">
                <CategoryBadge category={place.category} />
                <strong className="bookmark-title">{place.name}</strong>
                <button
                  className="remove-btn"
                  title="Poista suosikeista"
                  onClick={() => removeBookmark(place.id)}
                >
                  ×
                </button>
              </div>
              <p className="bookmark-desc">{place.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
