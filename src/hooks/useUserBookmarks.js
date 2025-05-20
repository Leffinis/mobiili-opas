// src/hooks/useUserBookmarks.js

import { useState, useEffect, useCallback } from "react";

export function useUserBookmarks(selectedPlaceId) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Получить все закладки пользователя с сервера
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

  // Добавить в закладки
  const addBookmark = useCallback((placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/bookmarks/" + placeId, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    }).then(fetchBookmarks);
  }, [fetchBookmarks]);

  // Удалить из закладок
  const removeBookmark = useCallback((placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/bookmarks/" + placeId, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }).then(fetchBookmarks);
  }, [fetchBookmarks]);

  // Подгружаем закладки на монтировании и при смене selectedPlaceId
  useEffect(() => {
    fetchBookmarks();
  }, [selectedPlaceId, fetchBookmarks]);

  // Проверить, добавлен ли placeId в закладки
  const isBookmarked = useCallback((placeId) => bookmarks.includes(placeId), [bookmarks]);

  return {
    bookmarks,
    loading,
    isBookmarked,
    addBookmark,
    removeBookmark
  };
}
