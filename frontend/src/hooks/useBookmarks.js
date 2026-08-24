import { useState, useEffect } from "react";
import { storage, STORAGE_KEYS } from "../utils/storage";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() =>
    storage.get(STORAGE_KEYS.BOOKMARKS, [])
  );

  const toggle = (questionId) => {
    setBookmarks(prev => {
      const next = prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId];
      storage.set(STORAGE_KEYS.BOOKMARKS, next);
      return next;
    });
  };

  const isBookmarked = (questionId) => bookmarks.includes(questionId);

  return { bookmarks, toggle, isBookmarked };
};
