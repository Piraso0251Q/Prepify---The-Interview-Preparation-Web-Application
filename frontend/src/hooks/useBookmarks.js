import { useState, useEffect } from "react";
import { bookmarksAPI } from "../utils/api";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]); 
  const [loading, setLoading] = useState(true);

  
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

  
  const toggle = async (questionId) => {
    const id = questionId.toString();
    const alreadyBookmarked = bookmarks.includes(id);

   
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
