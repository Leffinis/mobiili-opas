// src/hooks/useUserBookmarks.js

import { useState, useEffect, useCallback } from "react";

export function useUserBookmarks(selectedPlaceId = null) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

// Ottaa talteen bookmarkit
  const fetchBookmarks = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) { setBookmarks([]); setLoading(false); return; }
    setLoading(true);
    fetch("http://localhost:3000/api/bookmarks", {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        setBookmarks(data || []);
        setLoading(false);
      });
  }, []);

  // Lisää uusi bookmark
  const addBookmark = useCallback((placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/bookmarks/" + placeId, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    }).then(fetchBookmarks);
  }, [fetchBookmarks]);

  // Poistaa bookmarkin
  const removeBookmark = useCallback((placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/bookmarks/" + placeId, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }).then(fetchBookmarks);
  }, [fetchBookmarks]);

  // Hakee bookmarkit kun komponentti ladataan
  useEffect(() => {
    fetchBookmarks();
  }, [selectedPlaceId, fetchBookmarks]);

  // Hakee bookmarkit kun token muuttuu
  const isBookmarked = useCallback((placeId) => bookmarks.includes(placeId), [bookmarks]);

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark
  };
}
