import { useState, useEffect } from "react";
import { bookmarksAPI } from "../utils/api";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]); // array of question ID strings
  const [loading, setLoading] = useState(true);

  // Load bookmarks from backend on mount
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoading(false); return; }
      const data = await bookmarksAPI.getAll();
      if (data.success) setBookmarks(data.bookmarks);
      setLoading(false);
    };
    load();
  }, []);

  // Toggle: add if not bookmarked, remove if already bookmarked
  const toggle = async (questionId) => {
    const id = questionId.toString();
    const alreadyBookmarked = bookmarks.includes(id);

    // Optimistic update — update UI immediately, then sync with backend
    setBookmarks(prev =>
      alreadyBookmarked ? prev.filter(b => b !== id) : [...prev, id]
    );

    if (alreadyBookmarked) {
      await bookmarksAPI.remove(id);
    } else {
      await bookmarksAPI.add(id);
    }
  };

  const isBookmarked = (questionId) => bookmarks.includes(questionId?.toString());

  return { bookmarks, toggle, isBookmarked, loading };
};
