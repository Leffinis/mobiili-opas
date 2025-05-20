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
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
    loading: bookmarksLoading
  } = useUserBookmarks(place?.id);

  if (!place) {
    return (
      <div className="place-description">
        <h2>{t.placedescription_1}</h2>
        <p>{t.placedescription_2}</p>
      </div>
    );
  }

  const bookmarked = isBookmarked(place.id);

  return (
    <div className="place-description">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h2>{place.name}</h2>
        <button
          className="bookmark-btn"
          disabled={bookmarksLoading}
          title={bookmarked ? t.remove_bookmark : t.add_bookmark}
          onClick={() => bookmarked ? removeBookmark(place.id) : addBookmark(place.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "2rem",
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
