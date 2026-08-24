// ============================================================
// LOCAL STORAGE UTILITIES
// ============================================================

export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage write failed:", e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

export const STORAGE_KEYS = {
  THEME: "prepify_theme",
  USER: "prepify_user",
  BOOKMARKS: "prepify_bookmarks",
  HISTORY: "prepify_history",
  ROLE: "prepify_role",
  QUESTIONS: "prepify_questions",
  TOKENS: "prepify_tokens",
  SUBSCRIPTION: "prepify_subscription",
};

