import React, { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton"; // путь поправь, если не совпадает

const Omasivut = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);
    fetch("http://localhost:3000/api/bookmarks", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(ids => {
        setBookmarks(ids);
        // Получаем все места для отображения описаний
        fetch("http://localhost:3000/places/sightseeing")
          .then(res => res.json())
          .then(data => {
            setPlaces(data);
            setLoading(false);
          });
      });
  }, []);

  const myPlaces = places.filter((p) => bookmarks.includes(p.id));

  if (!localStorage.getItem("token")) {
    return <div style={{marginTop:100, textAlign:"center"}}>Kirjaudu sisään nähdäksesi suosikit.</div>;
  }

  if (loading) return <div style={{marginTop:100, textAlign:"center"}}>Ladataan...</div>;

  if (!myPlaces.length) {
    return (
      <div style={{ margin: "100px auto", textAlign: "center" }}>
        <LogoutButton />
        <h2>Ei suosikkeja</h2>
        <p>Lisää paikkoja suosikkeihin painamalla <b>tähtikuvaketta</b> paikankuvauksessa.</p>
      </div>
    );
  }

  return (
    <div style={{ margin: "100px auto", maxWidth: 700 }}>
      <LogoutButton />
      <h2>Suosikkipaikkasi</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {myPlaces.map((place) => (
          <li key={place.id} style={{
            padding: "18px",
            margin: "10px 0",
            background: "#f2f8fc",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <strong style={{ fontSize: "1.15rem" }}>{place.name}</strong>
                <p style={{ margin: "7px 0" }}>{place.description}</p>
              </div>
              {/* Кнопка для удаления */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Omasivut;
