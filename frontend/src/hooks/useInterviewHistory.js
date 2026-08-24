import { useState } from "react";
import { storage, STORAGE_KEYS } from "../utils/storage";

export const useInterviewHistory = () => {
  const [history, setHistory] = useState(() =>
    storage.get(STORAGE_KEYS.HISTORY, [])
  );

  const addEntry = (entry) => {
    setHistory(prev => {
      const next = [entry, ...prev];
      storage.set(STORAGE_KEYS.HISTORY, next);
      return next;
    });
  };

  const getEntry = (id) => history.find(e => e.id === id);

  const clearHistory = () => {
    setHistory([]);
    storage.remove(STORAGE_KEYS.HISTORY);
  };

  return { history, addEntry, getEntry, clearHistory };
};
