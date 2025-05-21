
import { useState, useEffect, useCallback } from "react";

export function useUserBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading]     = useState(true);


  const fetchBookmarks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setBookmarks([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/bookmarks", {
        headers: { Authorization: "Bearer " + token }
      });
      const data = await res.json();
      setBookmarks(data || []);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  
  const addBookmark = useCallback(async (placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
   
    setBookmarks(prev => [...prev, placeId]);
   
    try {
      await fetch(`http://localhost:3000/api/bookmarks/${placeId}`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token }
      });
    } catch (err) {
      console.error("Failed to add bookmark:", err);
      
    }
  }, []);

  
  const removeBookmark = useCallback(async (placeId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setBookmarks(prev => prev.filter(id => id !== placeId));
    try {
      await fetch(`http://localhost:3000/api/bookmarks/${placeId}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });
    } catch (err) {
      console.error("Failed to remove bookmark:", err);
   
    }
  }, []);

  return { bookmarks, loading, addBookmark, removeBookmark };
}
