import { useState, useEffect } from "react";
import { historyAPI } from "../utils/api";

export const useInterviewHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  
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
      
      setHistory(prev => [mapped, ...prev]);
      return mapped;
    }
    return null;
  };

 
  const getEntry = (id) => history.find(e => e._id === id || e.id === id);

  
  const clearHistory = async () => {
    await historyAPI.clear();
    setHistory([]);
  };

  return { history, addEntry, getEntry, clearHistory, loading };
};
