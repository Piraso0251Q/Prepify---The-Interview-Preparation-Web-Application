import { useState, useEffect } from "react";
import { historyAPI } from "../utils/api";

export const useInterviewHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load history from backend on mount
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoading(false); return; }
      const data = await historyAPI.getAll();
      if (data.success) {
        const mappedSessions = data.sessions.map(s => ({
          ...s,
          id: s._id,
          completedAt: s.endTime || s.createdAt,
          overallScore: s.overallScore || 0,
        }));
        setHistory(mappedSessions);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Save a new interview session to backend
  const addEntry = async (entry) => {
    const data = await historyAPI.save(entry);
    if (data.success) {
      const mapped = {
        ...data.session,
        id: data.session._id,
        completedAt: data.session.endTime || data.session.createdAt,
        overallScore: data.session.overallScore || 0,
      };
      // Add the saved session to the top of local state
      setHistory(prev => [mapped, ...prev]);
      return mapped;
    }
    return null;
  };

  // Get a single session by ID from local state
  const getEntry = (id) => history.find(e => e._id === id || e.id === id);

  // Clear all history
  const clearHistory = async () => {
    await historyAPI.clear();
    setHistory([]);
  };

  return { history, addEntry, getEntry, clearHistory, loading };
};
