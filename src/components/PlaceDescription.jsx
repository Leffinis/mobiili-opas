// src/components/PlaceDescription.jsx

import React, { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { useUserBookmarks } from "../hooks/useUserBookmarks";
import RouteButton from "./RouteButton";
import RouteDetails from "./RouteDetails";

const PlaceDescription = ({
  place,
  setRouteCoordinates,
  setRouteLegs,
  routeLegs,
  onShowRoute,
}) => {
  const { t } = useContext(LanguageContext);
  // hook
  const {
    bookmarks,
    addBookmark,
    removeBookmark,
    loading: bookmarksLoading
  } = useUserBookmarks();

  if (!place) {
    return (
      <div className="place-description">
        <h2>{t.placedescription_1}</h2>
        <p>{t.placedescription_2}</p>
      </div>
    );
  }

  // onko bookmarkattu?
  const bookmarked = bookmarks.includes(place.id);

  return (
    <div className="place-description">
      <div className="place-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h2>{place.name}</h2>
        <button
          className="bookmark-btn"
          disabled={bookmarksLoading}
          title={bookmarked ? t.remove_bookmark : t.add_bookmark}
          onClick={() => {
            if (bookmarked) removeBookmark(place.id);
            else addBookmark(place.id);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.8rem",
            color: bookmarked ? "#0066cc" : "#bbb",
            marginLeft: 10
          }}
        >
          {bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
        </button>
      </div>

      {place.image_url && (
        <img
          src={place.image_url.startsWith("/") ? place.image_url : "/" + place.image_url}
          alt={place.name}
          className="place-image"
        />
      )}

      <p className="place-text">{place.description}</p>

      <RouteButton
        place={place}
        setRouteCoordinates={setRouteCoordinates}
        setRouteLegs={setRouteLegs}
        onShowRoute={onShowRoute}
      />

      {routeLegs.length > 0 && <RouteDetails legs={routeLegs} />}
    </div>
  );
};

export default PlaceDescription;
